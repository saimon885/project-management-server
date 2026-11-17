import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import httpStatus from "http-status";

interface TaskAssignService {
  assignedToId: string;
}
const assignTask = async (
  payload: TaskAssignService,
  taskId: string,
  userId: string,
) => {
  const checkTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: true,
    },
  });

  if (!checkTask) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found.");
  }

  const checkOrgMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: checkTask.project.organizationId,
        userId,
      },
    },
  });

  if (!checkOrgMember) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not a member of this organization",
    );
  }

  const checkUser = await prisma.user.findUnique({
    where: {
      id: payload.assignedToId,
    },
  });

  if (!checkUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Assignee user not found.");
  }

  const checkAssigneeMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: checkTask.project.organizationId,
        userId: payload.assignedToId,
      },
    },
  });

  if (!checkAssigneeMember) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Assignee is not a member of this organization",
    );
  }

  if (checkTask.assigneeId) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This task is already assigned to someone.",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const taskAssignment = await tx.taskAssignment.create({
      data: {
        taskId,
        assignedToId: payload.assignedToId,
        assignedById: userId,
      },
    });

    await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        assigneeId: payload.assignedToId,
      },
    });

    return taskAssignment;
  });

  return result;
};
const getTaskAssignmentHistory = async (taskId: string) => {
  const checkTask = await prisma.task.findMany({
    where: {
      id: taskId,
    },
  });
  if (!checkTask) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found.");
  }
  const result = await prisma.taskAssignment.findMany({
    where: {
      taskId: taskId,
    },
    include: {
      assignedTo: true,
      assignedBy: true,
    },
  });
  return result;
};
export const taskAssignService = {
  assignTask,
  getTaskAssignmentHistory,
};
