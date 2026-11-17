import z from "zod";

const zteamSchema = z.object({
	name: z.string("name is Required!"),
	description: z.string("description is Required!").optional(),
});

export const teamsValidation = {
	zteamSchema,
};
