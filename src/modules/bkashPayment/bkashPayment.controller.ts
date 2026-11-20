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

const getbkashPaymentCallback = catchAsync(
  async (req: Request, res: Response) => {
    const { redirectUrl } = await bkashPaymentService.bkashPaymentCallback(
      req.query,
    );
    res.redirect(redirectUrl);
  },
);
const getMyPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await bkashPaymentService.getMyPaymentHistory(
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    messege: "my payment-history retrive successfull.",
    data: result,
  });
});

export const bkashPaymentController = {
  CreateBkashPayment,
  getMyPaymentHistory,
  getbkashPaymentCallback,
};
