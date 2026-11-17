import httpstatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { ICTaskPayload } from "./task.interface";

const addTask = async (
  payload: ICTaskPayload,
  userId: string,
  projectId: string,
) => {
  const checkProject = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      organizationId: true,
    },
  });

  if (!checkProject) {
    throw new AppError(httpstatus.NOT_FOUND, "Project not found");
  }

  // 2. Check user belongs to this organization
  const checkOrgMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: checkProject.organizationId,
        userId: userId,
      },
    },
  });

  if (!checkOrgMember) {
    throw new AppError(
      httpstatus.FORBIDDEN,
      "You are not a member of this organization",
    );
  }

  // 3. Check duplicate task title inside this project
  const checkTask = await prisma.task.findFirst({
    where: {
      projectId: projectId,
      title: {
        equals: payload.title,
        mode: "insensitive",
      },
      parentTaskId: null,
    },
  });

  if (checkTask) {
    throw new AppError(
      httpstatus.CONFLICT,
      "Task already exists in this project",
    );
  }

  // 4. Create task
  const result = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      createdById: userId,
      projectId: projectId,
      status: payload.status ?? payload.status,
      priority: payload.priority ?? payload.priority,
    },
  });

  return result;
};

const getTask = async (projectId: string) => {
  const checkProject = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!checkProject) {
    throw new AppError(httpstatus.NOT_FOUND, "project not found");
  }
  const result = await prisma.task.findMany({
    where: {
      projectId,
    },
  });
  return result;
};

const updateTask = async (payload: ICTaskPayload, taskId: string) => {
  const checkTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  if (!checkTask) {
    throw new AppError(httpstatus.NOT_FOUND, "task not found");
  }
  const result = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
    },
  });
  return result;
};
const deleteTask = async (taskId: string) => {
  const checkTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  if (!checkTask) {
    throw new AppError(httpstatus.NOT_FOUND, "task not found");
  }
  const result = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return result;
};

export const taskService = {
  addTask,
  getTask,
  updateTask,
  deleteTask,
};
