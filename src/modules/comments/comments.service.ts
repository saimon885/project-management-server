import httpstatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
interface ICommentPayload {
  content: string;
}

const createComment = async (
  payload: ICommentPayload,
  authorId: string,
  taskId: string,
) => {
  const checkTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  if (!checkTask) {
    throw new AppError(httpstatus.NOT_FOUND, "Task not found");
  }
  const result = await prisma.taskComment.create({
    data: {
      content: payload.content,
      userId: authorId,
      taskId: taskId,
    },
  });
  return result;
};
const getComment = async (taskId: string) => {
  const result = await prisma.taskComment.findMany({
    where: {
      taskId: taskId,
    },
  });
  if (!result) {
    throw new AppError(httpstatus.NOT_FOUND, "No comments found for this task");
  }
  return result;
};
const updateComment = async (payload: ICommentPayload, commentId: string) => {
  const checkComment = await prisma.taskComment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!checkComment) {
    throw new AppError(httpstatus.NOT_FOUND, "Comment not found");
  }

  const result = await prisma.taskComment.update({
    where: {
      id: commentId,
    },
    data: {
      content: payload.content,
    },
  });
  return result;
};
const deleteComment = async (commentId: string) => {
  const checkComment = await prisma.taskComment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!checkComment) {
    throw new AppError(httpstatus.NOT_FOUND, "Comment not found");
  }

  const result = await prisma.taskComment.delete({
    where: {
      id: commentId,
    },
  });
  return result;
};

export const commentsService = {
  createComment,
  getComment,
  updateComment,
  deleteComment,
};
