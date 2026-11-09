import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utility/catchAsync";
import { AppError } from "../utility/AppError";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      orgId?: string;
      userRole?: string;
      orgMemberId?: string;
    }
  }
}

export const checkOrgAccess = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access.");
    }

    if (!organizationId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Organization ID is required.",
      );
    }

    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
      include: {
        organization: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    // console.log(member.);
    if (!member || !member.status) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not an active member of this organization.",
      );
    }

    // if (!member.organizationId) {
    //   throw new AppError(httpStatus.FORBIDDEN, "Organization is not active.");
    // }

    req.orgId = member.organizationId;
    req.userRole = member.role;
    req.orgMemberId = member.id;

    next();
  });
};
