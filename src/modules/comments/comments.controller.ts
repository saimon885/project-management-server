import type { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { commentsService } from "./comments.service";

const addComment = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user?.userId;
  const result = await commentsService.createComment(
    req.body,
    userId as string,
    taskId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    messege: "comments created successfull.",
    data: result,
  });
});
const getComment = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const result = await commentsService.getComment(taskId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "comments retrieved successfull.",
    data: result,
  });
});
const updateComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const result = await commentsService.updateComment(
    req.body,
    commentId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "comment updated successfull.",
    data: result,
  });
});
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  await commentsService.deleteComment(commentId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    messege: "comment deleted successfull.",
    data: null,
  });
});

export const commentsController = {
  addComment,
  getComment,
  updateComment,
  deleteComment,
};
