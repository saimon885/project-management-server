import { UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import httpStatus from "http-status";
import crypto from "crypto";
import path from "path";
import ejs from "ejs";
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

  const template = path.join(
    process.cwd(),
    "/src/templates/invitation/invite-send-tamplates.ejs",
  );
  const inviteLink = `${config.app_url}/accept-invite?token=${token}`;
  const html = await ejs.renderFile(template, {
    organizationName: invitation.organization.name,
    role: role,
    inviteLink: inviteLink,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: `You've been invited to join ${invitation.organization.name}`,
    html,
  });
  return {
    message: "Invitation sent successfully!",
    inviteLink,
  };
};
const acceptInvitation = async (token: string, userId: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      organization: true,
    },
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

  const template = path.join(
    process.cwd(),
    "/src/templates/invitation/invite-accept-tamplets.ejs",
  );

  const html = await ejs.renderFile(template, {
    name: user.name || "User",
    organizationName: invitation.organization.name,
    role: invitation.role,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: `Successfully Joined ${invitation.organization.name}! 🎉`,
    html,
  });

  return result;
};
export const invitationService = {
  sendInvitation,
  acceptInvitation,
};
