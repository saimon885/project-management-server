import type { SprintStatus } from "../../../generated/prisma/enums";

export interface ISprintPayload {
	name: string;
	goal?: string;
	startDate: Date;
	endDate: Date;
	status?: SprintStatus;
}
