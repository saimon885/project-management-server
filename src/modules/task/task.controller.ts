import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { taskService } from "./task.service";
import { AppError } from "../../utility/AppError";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new AppError(httpstatus.BAD_REQUEST, "projectId is required");
  }
  const userId = req.user?.userId;
  const result = await taskService.addTask(
    req.body,
    userId as string,
    projectId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    messege: "Task created successfully.",
    data: result,
  });
});

const getTask = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new AppError(httpstatus.BAD_REQUEST, "projectId is required");
  }
  const result = await taskService.getTask(projectId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: result,
  });
});
const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new AppError(httpstatus.BAD_REQUEST, "taskId is required");
  }
  const result = await taskService.updateTask(req.body, taskId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "Task updated successfully.",
    data: result,
  });
});
const DeleteTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new AppError(httpstatus.BAD_REQUEST, "taskId is required");
  }
  const result = await taskService.deleteTask(taskId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "Task deleted successfully.",
    data: null,
  });
});

export const taskController = {
  createTask,
  getTask,
  updateTask,
  DeleteTask,
};
