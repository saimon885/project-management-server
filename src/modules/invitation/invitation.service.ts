import { UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import httpStatus from "http-status";
import crypto from "crypto";
export interface IinviteUserPayload {
  email: string;
  role: UserRole;
}

const sendInvitation = async (payload: IinviteUserPayload, orgId: string) => {
  console.log(orgId);
  const { email, role } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const isMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: existingUser.id,
        },
      },
    });

    if (isMember) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This user is already a member of this organization!",
      );
    }
  }

  const pendingInvite = await prisma.invitation.findFirst({
    where: {
      organizationId: orgId,
      email,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
  });

  if (pendingInvite) {
    throw new AppError(
      httpStatus.CONFLICT,
      "An active invitation has already been sent to this email!",
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invitation = await prisma.invitation.create({
    data: {
      organizationId: orgId,
      email,
      role,
      token,
      expiresAt,
    },
    include: {
      organization: {
        select: { name: true },
      },
    },
  });

  const inviteLink = `${config.app_url}/accept-invite?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: `You've been invited to join ${invitation.organization.name}`,
    html: `
      <h2>You are invited!</h2>
      <p>You have been invited to join <strong>${invitation.organization.name}</strong> as a <strong>${role}</strong>.</p>
      <p>Click the link below to accept the invitation (Valid for 7 days):</p>
      <a href="${inviteLink}" style="padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
    `,
  });

  return {
    message: "Invitation sent successfully!",
    inviteLink,
  };
};
const acceptInvitation = async (token: string, userId: string) => {
    
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Invalid or expired invitation token!",
    );
  }
  if (invitation.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This invitation has already been processed!",
    );
  }

  if (new Date() > invitation.expiresAt) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "REJECTED" },
    });
    throw new AppError(httpStatus.BAD_REQUEST, "This invitation has expired!");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email !== invitation.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This invitation was not sent to your account email!",
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const newMember = await tx.organizationMember.create({
      data: {
        organizationId: invitation.organizationId,
        userId: user.id,
        role: invitation.role,
      },
    });

    await tx.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });

    return newMember;
  });

  return result;
};
export const invitationService = {
  sendInvitation,
  acceptInvitation,
};
