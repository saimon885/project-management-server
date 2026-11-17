import httpstatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type { ICTaskPayload } from "../task/task.interface";

const addSubTask = async (
	payload: ICTaskPayload,
	userId: string,
	taskId: string,
) => {
	const checkTask = await prisma.task.findUnique({
		where: {
			id: taskId,
		},
		select: {
			id: true,
			projectId: true,
		},
	});

	if (!checkTask) {
		throw new AppError(httpstatus.NOT_FOUND, "Task not found");
	}

	// 2. Check duplicate task title inside this project
	const checkSubTask = await prisma.subTask.findFirst({
		where: {
			taskId,
			title: {
				equals: payload.title,
				mode: "insensitive",
			},
		},
	});

	if (checkSubTask) {
		throw new AppError(
			httpstatus.CONFLICT,
			"SubTask already exists under this task",
		);
	}

	// 4. Create task
	const result = await prisma.subTask.create({
		data: {
			title: payload.title,
			description: payload.description,
			createdById: userId,
			taskId: taskId,
			status: payload.status ?? payload.status,
			priority: payload.priority ?? payload.priority,
		},
	});

	return result;
};

const getSubTask = async (taskId: string) => {
	const checkSubTask = await prisma.subTask.findMany({
		where: {
			taskId: taskId,
		},
	});
	if (!checkSubTask) {
		throw new AppError(httpstatus.NOT_FOUND, "SubTask not found");
	}
	return checkSubTask;
};

const updateSubTask = async (payload: ICTaskPayload, subTaskId: string) => {
	const checkSubTask = await prisma.subTask.findUnique({
		where: {
			id: subTaskId,
		},
	});
	if (!checkSubTask) {
		throw new AppError(httpstatus.NOT_FOUND, "subTask not found");
	}
	const result = await prisma.subTask.update({
		where: {
			id: subTaskId,
		},
		data: {
			title: payload.title,
			description: payload.description,
			status: payload.status ?? payload.status,
			priority: payload.priority ?? payload.priority,
		},
	});
	return result;
};

const deleteSubTask = async (subTaskId: string) => {
	const checkSubTask = await prisma.subTask.findUnique({
		where: {
			id: subTaskId,
		},
	});
	if (!checkSubTask) {
		throw new AppError(httpstatus.NOT_FOUND, "subTask not found");
	}
	const result = await prisma.subTask.delete({
		where: {
			id: subTaskId,
		},
	});
	return result;
};

export const subTaskService = {
	addSubTask,
	getSubTask,
	updateSubTask,
	deleteSubTask,
};
