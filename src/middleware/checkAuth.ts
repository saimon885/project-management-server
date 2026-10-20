import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utility/catchAsync";
import { AppError } from "../utility/AppError";
import httpStatus from "http-status";
import { jwtUtils } from "../utility/jwt";
import config from "../config";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export interface UserPayload {
  email: string;
  name: string;
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;
    console.log(token);
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource.",
      );
    }
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error);
    }
    const { userId, name, email, role } = verifiedToken.data as UserPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource.",
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        email,
        name,
        role,
      },
    });

    if (!user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User not found. Please log in again.",
      );
    }

    // if (user. === "BLOCKED") {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     "Your account has been blocked. Please contact support.",
    //   );
    // }
    req.user = {
      email,
      name,
      userId,
      role,
    };
    next();
  });
};
