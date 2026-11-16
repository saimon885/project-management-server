import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
const createSubTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const getSubTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const updateSubTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const DeleteSubTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});

export const subTaskController = {
  createSubTask,
  getSubTask,
  updateSubTask,
  DeleteSubTask,
};
