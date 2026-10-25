import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { invitationService } from "./invitation.service";
const InviteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await invitationService.sendInvitation(
    req.body,
    req.params.orgId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "inviteation Send  successfull.",
    data: result,
  });
});
const acceptedInvite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await invitationService.acceptInvitation(
    req.params.token as string,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    messege: "inviteation accepted  successfull.",
    data: result,
  });
});

export const invitationController = {
  InviteUser,
  acceptedInvite,
};
