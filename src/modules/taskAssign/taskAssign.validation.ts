import z from "zod";

const zTaskAssignSchema = z.object({
	assignedToId: z.string().uuid("Invalid assignedToId format!"),
});

export const taskAssignValidation = {
	zTaskAssignSchema,
};
