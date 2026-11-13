import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { AppError } from "../../utility/AppError";
import { projectService } from "./projects.service";

const CreateProject = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.params.organizationId;
  const userId = req.user?.userId;
  if (!orgId) {
    throw new AppError(httpstatus.NOT_FOUND, "orgId not found");
  }
  const result = await projectService.CreateProject(
    req.body,
    orgId as string,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    messege: "project create successfull.",
    data: result,
  });
});
const getAllProject = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.params.organizationId;
  if (!orgId) {
    throw new AppError(httpstatus.NOT_FOUND, "orgId not found");
  }
  const result = await projectService.getAllProject(orgId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "all project retrive successfull.",
    data: result,
  });
});
const getSingleProject = catchAsync(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  if (!projectId) {
    throw new AppError(httpstatus.NOT_FOUND, "projectId not found");
  }
  const result = await projectService.getProjectDetails(projectId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: " project retrive successfull.",
    data: result,
  });
});

export const projectController = {
  CreateProject,
  getAllProject,
  getSingleProject,
};
