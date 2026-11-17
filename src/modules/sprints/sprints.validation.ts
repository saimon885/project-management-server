import z from "zod";
import { SprintStatus } from "../../../generated/prisma/enums";

const zSprintSchema = z.object({
	name: z.string("Name is Required!").min(2).max(100),
	goal: z.string().optional(),
	startDate: z.date("Start Date is Required!"),
	endDate: z.date("End Date is Required!"),
	status: z.enum(SprintStatus).optional(),
});

export const sprintValidation = {
	zSprintSchema,
};
