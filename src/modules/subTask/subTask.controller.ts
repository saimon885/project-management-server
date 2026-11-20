import type { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { AppError } from "../../utility/AppError";
import { subTaskService } from "./subTask.service";

const createSubTask = catchAsync(async (req: Request, res: Response) => {
	const { taskId } = req.params;
	// console.log(taskId);
	if (!taskId) {
		throw new AppError(httpstatus.BAD_REQUEST, "taskId is required");
	}
	const userId = req.user?.userId;
	const result = await subTaskService.addSubTask(
		req.body,
		userId as string,
		taskId as string,
	);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.CREATED,
		messege: "SubTask created successfully.",
		data: result,
	});
});

const getSubTask = catchAsync(async (req: Request, res: Response) => {
	const { taskId } = req.params;
	if (!taskId) {
		throw new AppError(httpstatus.BAD_REQUEST, "taskId is required");
	}
	const result = await subTaskService.getSubTask(taskId as string);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		messege: "SubTask retrieved successfully.",
		data: result,
	});
});

const updateSubTask = catchAsync(async (req: Request, res: Response) => {
	const { subTaskId } = req.params;
	if (!subTaskId) {
		throw new AppError(httpstatus.BAD_REQUEST, "subTaskId is required");
	}
	const result = await subTaskService.updateSubTask(
		req.body,
		subTaskId as string,
	);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		messege: "SubTask updated successfully.",
		data: result,
	});
});

const DeleteSubTask = catchAsync(async (req: Request, res: Response) => {
	const { subTaskId } = req.params;
	if (!subTaskId) {
		throw new AppError(httpstatus.BAD_REQUEST, "subTaskId is required");
	}
	const result = await subTaskService.deleteSubTask(subTaskId as string);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		messege: "SubTask deleted successfully.",
		data: null,
	});
});

export const subTaskController = {
	createSubTask,
	getSubTask,
	updateSubTask,
	DeleteSubTask,
};
