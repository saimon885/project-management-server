import z from "zod";

export interface createProjectPayload {
	name: string;
	key: string;
	description?: string;
	teamId: string;
}

const zProjectSchema = z.object({
	name: z.string("Name is Required!").min(2).max(100),
	key: z.string("Key is Required!").min(2).max(100),
	description: z.string().optional(),
	teamId: z.string("Team ID is Required!"),
});

export const projectValidation = {
	zProjectSchema,
};
