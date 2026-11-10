import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utility/catchAsync";
import { AppError } from "../utility/AppError";
import { UserRole } from "../../generated/prisma/enums";

export const requireOrgRole = (...roles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole as UserRole)) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission.");
    }

    next();
  });
};
