
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utility/catchAsync";
import { AppError } from "../utility/AppError";

type OrgRole =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "MEMBER"
  | "GUEST";

export const requireOrgRole = (...roles: OrgRole[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

      if (!req.userRole || !roles.includes(req.userRole as OrgRole)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission."
        );
      }

      next();
    }
  );
};
