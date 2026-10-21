import z from "zod";

const zodRegisterSchema = z.object({
  name: z.string("Name is Required!"),
  email: z.email("email is Required!"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  phone_number: z.string().optional(),
  image_url: z.string().optional(),
});

const zodLoginSchema = z.object({
  email: z.email("email is Required!"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

const zodVerifySchema = z.object({
  email: z.email("email is Required!"),
  otp: z.string("otp is Required!"),
});

const zodGoogleLoginSchema = z.object({
  idToken: z.string("idToken is Required!"),
});

const zodForgotSchema = z.object({
  email: z.email("email is Required!"),
});

const zodResetSchema = z.object({
  email: z.email("email is Required!"),
  otp: z.string("otp is Required!"),
  newPassword: z.string("newPassword is Required!"),
});

export const authValidation = {
  zodRegisterSchema,
  zodVerifySchema,
  zodLoginSchema,
  zodForgotSchema,
  zodResetSchema,
  zodGoogleLoginSchema,
};
