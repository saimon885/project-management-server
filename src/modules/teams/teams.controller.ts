import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import { teamService } from "./teams.service";

const CreateTeam = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.orgId;
  const userId = req.user?.userId;

  if (!orgId || !userId) {
    throw new Error("Organization or user information is missing.");
  }

  const result = await teamService.CreateTeam(req.body, orgId, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "Team created successfully.",
    data: result,
  });
});

const getTeam = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.orgId;

  if (!orgId) {
    throw new Error("Organization or user information is missing.");
  }

  const result = await teamService.getAllTeam();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "Team retrive successfully.",
    data: result,
  });
});

export const teamController = {
  CreateTeam,
  getTeam,
};
