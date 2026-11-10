import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
const CreateProject = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    messege: "inviteation Send  successfull.",
    data: "result",
  });
});

export const projectRoutes = {
  CreateProject,
};
