import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utility/AppError";
import { sprintService } from "./sprints.service";

const createSprint = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new AppError(httpStatus.BAD_REQUEST, "projectId is required");
  }
  const userId = req.user?.userId;
  const result = await sprintService.createSprint(
    req.body,
    userId as string,
    projectId as string,
  );
  sendResponse(res, {
    success: true,
    messege: "Sprint created successfully.",
    statusCode: httpStatus.CREATED,
    data: result,
  });
});
const getSprint = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new AppError(httpStatus.BAD_REQUEST, "projectId is required");
  }
  const result = await sprintService.getAllSprint(projectId as string);
  sendResponse(res, {
    success: true,
    messege: "Sprint retrieved successfully.",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateSprint = catchAsync(async (req: Request, res: Response) => {
  const { sprintId } = req.params;
  if (!sprintId) {
    throw new AppError(httpStatus.BAD_REQUEST, "sprintId is required");
  }
  const userId = req.user?.userId;
  const result = await sprintService.updateSprint(
    req.body,
    sprintId as string,
    userId as string,
  );

  sendResponse(res, {
    success: true,
    messege: "Sprint updated successfully.",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const sprintController = {
  createSprint,
  getSprint,
  updateSprint,
};
