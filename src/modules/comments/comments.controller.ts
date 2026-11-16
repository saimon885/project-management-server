import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
const addComment = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const getComment = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const updateComment = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});

export const commentsController = {
  addComment,
  getComment,
  updateComment,
  deleteComment,
};
