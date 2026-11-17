import httpstatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { SprintStatus } from "../../../generated/prisma/enums";
import type { ISprintPayload } from "./sprints.interface";

const createSprint = async (
	payload: ISprintPayload,
	userId: string,
	projectId: string,
) => {
	// 1. Check project
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

	// 2. Check organization membership
	const checkOrgMember = await prisma.organizationMember.findUnique({
		where: {
			organizationId_userId: {
				organizationId: checkProject.organizationId,
				userId,
			},
		},
	});

	if (!checkOrgMember) {
		throw new AppError(
			httpstatus.FORBIDDEN,
			"You are not a member of this organization",
		);
	}

	// 3. Validate dates
	if (payload.startDate >= payload.endDate) {
		throw new AppError(
			httpstatus.BAD_REQUEST,
			"Sprint end date must be after start date",
		);
	}

	// 4. Create sprint
	const result = await prisma.sprint.create({
		data: {
			name: payload.name,
			goal: payload.goal,
			startDate: payload.startDate,
			endDate: payload.endDate,
			projectId: projectId,
			createdById: userId,
		},
	});

	return result;
};

const getAllSprint = async (projectId: string) => {
	const sprints = await prisma.sprint.findMany({
		where: {
			projectId,
		},
	});
	if (!sprints || sprints.length === 0) {
		throw new AppError(
			httpstatus.NOT_FOUND,
			"No sprints found for this project",
		);
	}
	return sprints;
};

const updateSprint = async (
	payload: ISprintPayload,
	sprintId: string,
	userId: string,
) => {
	const checkSprint = await prisma.sprint.findUnique({
		where: {
			id: sprintId,
		},
	});

	if (!checkSprint) {
		throw new AppError(httpstatus.NOT_FOUND, "Sprint not found");
	}

	// 1. Check project
	const checkProject = await prisma.project.findUnique({
		where: {
			id: checkSprint.projectId,
		},
		select: {
			id: true,
			organizationId: true,
		},
	});

	if (!checkProject) {
		throw new AppError(httpstatus.NOT_FOUND, "Project not found");
	}

	// 2. Check organization membership
	const checkOrgMember = await prisma.organizationMember.findUnique({
		where: {
			organizationId_userId: {
				organizationId: checkProject.organizationId,
				userId,
			},
		},
	});

	if (!checkOrgMember) {
		throw new AppError(
			httpstatus.FORBIDDEN,
			"You are not a member of this organization",
		);
	}

	// 3. Validate dates
	if (payload.startDate >= payload.endDate) {
		throw new AppError(
			httpstatus.BAD_REQUEST,
			"Sprint end date must be after start date",
		);
	}

	// 4. Create sprint
	const result = await prisma.sprint.update({
		where: {
			id: sprintId,
		},
		data: {
			name: payload.name,
			goal: payload.goal,
			startDate: payload.startDate,
			endDate: payload.endDate,
			projectId: checkSprint.projectId,
			createdById: userId,
			status: payload.status ?? payload.status,
		},
	});

	return result;
};

export const sprintService = {
	createSprint,
	getAllSprint,
	updateSprint,
};
