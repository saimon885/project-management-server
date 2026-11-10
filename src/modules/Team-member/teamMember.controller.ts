import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { teamMemberService } from "./teamMember.service";
import { AppError } from "../../utility/AppError";

const inviteTeam = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!");
  }

  const result = await teamMemberService.inviteTeam(
    req.body,
    teamId as string,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "Team member added successfully!",
    data: result,
  });
});

const getAllTeamMember = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;

  if (!teamId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!");
  }
  const result = await teamMemberService.teamMember(teamId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "Team-member retrive successfully.",
    data: result,
  });
});

export const teamMemberController = {
  inviteTeam,
  getAllTeamMember,
};
