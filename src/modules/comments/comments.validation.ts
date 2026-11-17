import z from "zod";

const zCommentSchema = z.object({
	content: z.string("Content is required").min(2).max(200),
});

export const commentsValidation = {
	zCommentSchema,
};
