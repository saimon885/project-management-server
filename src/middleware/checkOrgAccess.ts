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
    }
  }
}

export const checkOrgAccess = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const organizationId =
      req.cookies?.activeOrgId ||
      (req.headers["x-organization-id"] as string) ||
      req.body.organizationId;

    if (!organizationId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Organization ID is required in headers or request parameters.",
      );
    }
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized access. User information not found.",
      );
    }
    const member = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      include: {
        organization: true,
      },
    });

    if (!member) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Access Denied. You do not belong to this organization or the organization does not exist.",
      );
    }
    req.orgId = organizationId;
    req.userRole = member.role;

    next();
  });
};
