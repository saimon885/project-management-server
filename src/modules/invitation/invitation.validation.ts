import z from "zod";

const zInviteUserPayload = z.object({
	email: z.email("email is Required!"),
	role: z.string("role is Required!"),
});

export const invitationValidation = {
	zInviteUserPayload,
};
