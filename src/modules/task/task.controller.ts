import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
const createTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const getTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const updateTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});
const DeleteTask = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: "result",
  });
});

export const taskController = {
  createTask,
  getTask,
  updateTask,
  DeleteTask,
};
