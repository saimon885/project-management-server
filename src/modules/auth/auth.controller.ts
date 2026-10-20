import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import config from "../../config";
const RegisterUser = catchAsync(async (req: Request, res: Response) => {
  await authService.RegisterUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "check your email for otp.",
    data: null,
  });
});

const VerifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await authService.VerifyEmail(
    req.body,
  );
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "User Register Successfull",
    data: { accessToken, refreshToken, user },
  });
});

const LoginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await authService.LoginUser(
    req.body,
  );
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "User LogIn Successfull",
    data: { accessToken, refreshToken, user },
  });
});
const LogOut = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions = {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite:
      config.node_env === "production" ? ("none" as const) : ("lax" as const),
    path: "/",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "LogOut successfull.",
    data: null,
  });
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.ForgotPassword(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "check your email for otp.",
    data: null,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "password reset successfully.",
    data: null,
  });
});
export const authController = {
  RegisterUser,
  LoginUser,
  VerifyEmail,
  LogOut,
  forgotPassword,
  resetPassword,
};
