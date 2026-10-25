import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { organizationService } from "./organization.service";
import config from "../../config";

const createOrganization = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const parsedBody = req.body.data ? JSON.parse(req.body.data) : {};

  const newOrganization = await organizationService.CreateOrganization(
    parsedBody,
    req.file?.buffer,
    userId as string,
  );

  res.cookie("activeOrgId", newOrganization.id, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "organization Create successfull.",
    data: newOrganization,
  });
});
const getOrganization = catchAsync(async (req: Request, res: Response) => {
  const result = await organizationService.getOrganization();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "organization retrive successfull.",
    data: result,
  });
});

export const organizationController = {
  createOrganization,
  getOrganization,
};
