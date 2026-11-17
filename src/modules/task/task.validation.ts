import z from "zod";

const zTaskSchema = z.object({
	title: z.string("Title is Required!").min(2).max(100),
	description: z.string().optional(),
	status: z
		.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"])
		.optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

export const taskValidation = {
	zTaskSchema,
};
