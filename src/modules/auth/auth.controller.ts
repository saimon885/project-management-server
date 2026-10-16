import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";
const RegisterUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await authService.RegisterUser(
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
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "User Register Successfull",
    data: null,
  });
});
const VerifyEmail = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "User Register Successfull",
    data: null,
  });
});

export const authController = {
  RegisterUser,
  LoginUser,
  VerifyEmail,
};
