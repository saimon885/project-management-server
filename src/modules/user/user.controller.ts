import { catchAsync } from "../../utility/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";
import { Request, Response } from "express";
import { userService } from "./user.service";
import { AppError } from "../../utility/AppError";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await userService.getMyProfile(userId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "user profile retrive successfull.",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUser();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "all user retrive successfull.",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  let parsedBody = {};

  if (req.body.data) {
    parsedBody = JSON.parse(req.body.data);
  }

  if (!req.file) {
    throw new AppError(httpStatus.NOT_FOUND, "file not found!");
  }

  const result = await userService.updateUserProfile(
    req.file?.buffer,
    parsedBody,
    userId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "user profile update successfull.",
    data: result,
  });
});

export const userController = {
  getMyProfile,
  getAllUsers,
  updateMyProfile,
};
