import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utility/AppError";
import { taskAssignService } from "./task-assign.service";

const AssignTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Task ID is required");
  }
  const userId = req.user?.userId;
  const result = await taskAssignService.assignTask(
    req.body,
    taskId as string,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "Task assigned successfully.",
    data: result,
  });
});

const ReassignTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Task ID is required");
  }
  const userId = req.user?.userId;
  const result = await taskAssignService.reassignTask(
    req.body,
    taskId as string,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "Task reassigned successfully.",
    data: result,
  });
});

const assignHistory = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Task ID is required");
  }
  const result = await taskAssignService.getTaskAssignmentHistory(
    taskId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "Task assignment history retrieved successfully.",
    data: result,
  });
});

export const taskAssignController = {
  AssignTask,
  ReassignTask,
  assignHistory,
};
