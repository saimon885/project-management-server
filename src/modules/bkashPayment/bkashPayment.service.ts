import type { UserPayload } from "../../middleware/checkAuth";
import { BILLING_CYCLE, SUBSCRIPTION_PLANS } from "../../utility/subscription";
import httpStatus from "http-status";
import { AppError } from "../../utility/AppError";
import type { PaymentCreatePayload } from "./bkashPayment.interface";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import crypto from "crypto";
import path from "path";
import ejs from "ejs";
import { transporter } from "../../lib/nodemailer";

const createPayment = async (
	payload: PaymentCreatePayload,
	orgId: string,
	user: UserPayload,
) => {
	const { plan, billingCycle } = payload;
	const bkashIdToken = await getBkashIdToken();

	const selectedPlan = SUBSCRIPTION_PLANS[plan];
	const durationMonths = BILLING_CYCLE[billingCycle];

	const durationDays = durationMonths * 30;
	if (!bkashIdToken) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"bKash Authentication Token not found!",
		);
	}
	const organization = await prisma.organization.findUnique({
		where: {
			id: orgId,
		},
		select: {
			id: true,
			subscription: true,
			members: {
				where: {
					userId: user.userId,
				},
				select: {
					role: true,
				},
			},
		},
	});

	if (!organization) {
		throw new AppError(httpStatus.NOT_FOUND, "Organization not found!");
	}

	const membership = organization.members[0];

	if (!membership || membership.role !== "ORGANIZATION_OWNER") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only organization owner can make payments!",
		);
	}
	if (organization?.subscription?.paymentStatus === "COMPLETED") {
		throw new AppError(httpStatus.OK, "already paid!");
	}
	const amount =
		billingCycle === "MONTHLY"
			? selectedPlan.monthlyPrice
			: selectedPlan.yearlyPrice;

	if (amount <= 0) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid subscription amount");
	}
	const merchantInvoiceNumber = `INV-${crypto.randomUUID()}`;
	const bkashCreatePayment = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
				mode: "0011",
				payerReference: user?.email,
				callbackURL: `${config.bkash_callback_url}/organization/payment/callback`,
				amount: amount,
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber,
			}),
		},
	);
	if (!bkashCreatePayment.ok) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Failed to initiate bKash payment!",
		);
	}

	const bkashPaymentResult = await bkashCreatePayment.json();

	if (
		bkashPaymentResult.statusCode &&
		bkashPaymentResult.statusCode !== "0000"
	) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			bkashPaymentResult.statusMessage || "bKash Payment Creation Failed",
		);
	}
	const transactionResult = await prisma.$transaction(async (tx) => {
		await tx.payment.create({
			data: {
				organizationId: organization.id,
				amount: Number(amount),
				merchantInvoiceNumber,
				bkashPaymentID: bkashPaymentResult.paymentID,
				userId: user.userId,
				plan,
				durationDays: Number(durationDays),
			},
		});
		return {
			paymentUrl: bkashPaymentResult.bkashURL,
		};
	});
	return transactionResult;
};

const bkashPaymentCallback = async (query: Record<string, any>) => {
	const paymentID = query.paymentID;
	const status = query.status;

	if (!paymentID) {
		throw new AppError(httpStatus.BAD_REQUEST, "Payment ID is missing");
	}

	if (!status) {
		throw new AppError(httpStatus.BAD_REQUEST, "Status is missing");
	}

	const payment = await prisma.payment.findUnique({
		where: {
			bkashPaymentID: paymentID,
		},
		include: {
			paidBy: {
				select: {
					name: true,
					email: true,
				},
			},
			organization: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
	}

	if (payment.status === "COMPLETED") {
		return {
			redirectUrl: `${config.app_url}/dashboard/organization/billing?status=success`,
		};
	}

	if (!["PENDING", "INITIATED"].includes(payment.status)) {
		throw new AppError(httpStatus.CONFLICT, "Payment cannot be processed");
	}

	if (status === "failure") {
		await prisma.payment.updateMany({
			where: {
				id: payment.id,
				status: payment.status,
			},
			data: {
				status: "FAILED",
				failureReason: "Payment failed from bKash",
			},
		});

		return {
			redirectUrl: `${config.app_url}/dashboard/organization/billing?status=failed`,
		};
	}

	if (status === "cancel") {
		await prisma.payment.updateMany({
			where: {
				id: payment.id,
				status: payment.status,
			},
			data: {
				status: "CANCELLED",
				failureReason: "Payment cancelled by user",
			},
		});

		return {
			redirectUrl: `${config.app_url}/dashboard/organization/billing?status=cancel`,
		};
	}

	if (status === "success") {
		const bkashIdToken = await getBkashIdToken();

		if (!bkashIdToken) {
			throw new AppError(httpStatus.NOT_FOUND, "bKash id not found");
		}

		const bkashExecutePayment = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/execute`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({
					paymentID,
				}),
			},
		);

		const bkashExecutePaymentResult = await bkashExecutePayment.json();

		// console.log("BKASH EXECUTE RESULT:", bkashExecutePaymentResult);

		if (
			!bkashExecutePayment.ok ||
			bkashExecutePaymentResult.transactionStatus !== "Completed" ||
			bkashExecutePaymentResult.statusCode !== "0000" ||
			bkashExecutePaymentResult.merchantInvoiceNumber !==
				payment.merchantInvoiceNumber ||
			Number(bkashExecutePaymentResult.amount) !== Number(payment.amount) ||
			bkashExecutePaymentResult.currency !== payment.currency ||
			(bkashExecutePaymentResult.paymentID &&
				bkashExecutePaymentResult.paymentID !== paymentID)
		) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"bKash payment verification failed",
			);
		}

		const paidAt = new Date(bkashExecutePaymentResult.paymentExecuteTime);

		const paymentDate = !isNaN(paidAt.getTime()) ? paidAt : new Date();

		const transactionResult = await prisma.$transaction(
			async (tx) => {
				const paymentUpdate = await tx.payment.updateMany({
					where: {
						id: payment.id,
						status: payment.status,
					},
					data: {
						status: "COMPLETED",
						bkashTrxID: bkashExecutePaymentResult.trxID,
						paidAt: paymentDate,
					},
				});

				if (paymentUpdate.count !== 1) {
					throw new AppError(httpStatus.CONFLICT, "Payment already processed");
				}

				const currentSubscription =
					await tx.organizationSubscription.findUnique({
						where: {
							organizationId: payment.organizationId,
						},
					});

				const now = new Date();

				const subscriptionStart =
					currentSubscription?.currentPeriodEnd &&
					currentSubscription.currentPeriodEnd > now
						? currentSubscription.currentPeriodEnd
						: now;

				const subscriptionEnd = new Date(subscriptionStart);

				subscriptionEnd.setDate(
					subscriptionEnd.getDate() + payment.durationDays,
				);

				await tx.payment.update({
					where: {
						id: payment.id,
					},
					data: {
						subscriptionStartAt: subscriptionStart,
						subscriptionEndAt: subscriptionEnd,
					},
				});

				await tx.organizationSubscription.upsert({
					where: {
						organizationId: payment.organizationId,
					},
					create: {
						organizationId: payment.organizationId,
						plan: payment.plan,
						status: "ACTIVE",
						paymentStatus: "COMPLETED",
						currentPeriodStart: subscriptionStart,
						currentPeriodEnd: subscriptionEnd,
					},
					update: {
						plan: payment.plan,
						status: "ACTIVE",
						paymentStatus: "COMPLETED",
						currentPeriodStart: subscriptionStart,
						currentPeriodEnd: subscriptionEnd,
					},
				});

				return {
					subscriptionStart,
					subscriptionEnd,
					redirectUrl: `${config.app_url}/dashboard/organization/billing?status=success`,
				};
			},
			{
				timeout: 15000,
			},
		);

		const emailData = {
			name: payment.paidBy.name,
			organizationName: payment.organization.name,
			plan: payment.plan,
			billingCycle: `${payment.durationDays} Days`,
			trxID: bkashExecutePaymentResult.trxID,
			invoiceNumber: payment.merchantInvoiceNumber,
			paymentDate: paymentDate.toLocaleString("en-BD"),
			amount: payment.amount.toString(),
			subscriptionStart:
				transactionResult.subscriptionStart.toLocaleDateString("en-BD"),
			subscriptionEnd:
				transactionResult.subscriptionEnd.toLocaleDateString("en-BD"),
			year: new Date().getFullYear(),
		};

		try {
			const template = path.join(
				process.cwd(),
				"/src/templates/Payments/payments.tamplates.ejs",
			);

			const html = await ejs.renderFile(template, emailData);

			await transporter.sendMail({
				from: config.email_sender,
				to: payment.paidBy.email,
				subject: "Subscription Payment Successful - Project Management",
				html,
			});
		} catch (error) {
			console.error("PAYMENT CONFIRMATION EMAIL ERROR:", error);
		}

		return {
			redirectUrl: transactionResult.redirectUrl,
		};
	}

	return {
		redirectUrl: `${config.app_url}/dashboard/organization/billing?status=failed`,
	};
};

const getMyPaymentHistory = async (userId: string) => {
	const result = await prisma.payment.findMany({
		where: {
			userId: userId,
		},
		include: {
			paidBy: {
				select: {
					name: true,
					email: true,
				},
			},
			organization: {
				select: {
					name: true,
				},
			},
		},
	});
	if (!result) {
		throw new AppError(httpStatus.NOT_FOUND, "payment not found!");
	}
	return result;
};
export const bkashPaymentService = {
	createPayment,
	bkashPaymentCallback,
	getMyPaymentHistory,
};
