import { UserPayload } from "../../middleware/checkAuth";
import { SUBSCRIPTION_PLANS } from "../../utility/subscription";
import httpStatus from "http-status";
import { AppError } from "../../utility/AppError";
import { PaymentCreatePayload } from "./bkashPayment.interface";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import config from "../../config";

const createPayment = async (
  payload: PaymentCreatePayload,
  orgId: string,
  user: UserPayload,
) => {
    
  const { plan, billingCycle } = payload;
  const selectedPlan = SUBSCRIPTION_PLANS[plan];
  console.log(selectedPlan);

  const bkashIdToken = await getBkashIdToken();
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
        callbackURL: `${config.app_url}/service/payment/callback`,
        amount: amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orgId,
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
  return bkashPaymentResult;
};

export const bkashPaymentService = {
  createPayment,
};
