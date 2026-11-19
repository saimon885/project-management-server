import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { bkashPaymentService } from "./bkashPayment.service";
import { UserPayload } from "../../middleware/checkAuth";

const CreateBkashPayment = catchAsync(async (req: Request, res: Response) => {
  const orgId = req.params.organizationId;
  const user = req.user;
  const result = await bkashPaymentService.createPayment(
    req.body,
    orgId as string,
    user as UserPayload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "payment create successfull.",
    data: result,
  });
});

const getMyPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "inviteation Send  successfull.",
    data: "result",
  });
});

export const bkashPaymentController = {
  CreateBkashPayment,
  getMyPaymentHistory,
};
