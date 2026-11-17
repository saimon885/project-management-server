import z from "zod";

const zupdateUserSchema = z.object({
	name: z.string("name is Required!").optional(),
	image_url: z.string("image_url is Required!").optional(),
	imagePublishedID: z.string("imagePublishedID is Required!").optional(),
	phone_number: z.string("phone_number is Required!").optional(),
});

export const userValidation = {
	zupdateUserSchema,
};
