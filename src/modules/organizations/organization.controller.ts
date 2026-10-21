import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { organizationService } from "./organization.service";

const createOrganization = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const parsedBody = req.body.data ? JSON.parse(req.body.data) : {};

  const result = await organizationService.CreateOrganization(
    parsedBody,
    req.file?.buffer,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "organization Create successfull.",
    data: result,
  });
});

export const organizationController = {
  createOrganization,
};
