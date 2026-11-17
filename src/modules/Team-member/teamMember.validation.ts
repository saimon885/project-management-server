import z from "zod";

const zTeamvalidationSchema = z.object({
	userId: z.string("userId is Required!"),
	role: z.enum(["TEAM_LEAD", "MEMBER"]).optional(),
});

export const teamMemberValidation = {
	zTeamvalidationSchema,
};
