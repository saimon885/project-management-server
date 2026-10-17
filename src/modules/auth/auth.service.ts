import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { loginPayload, registerPayload, verifyPayload } from "./auth.interface";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import ejs from "ejs";
import { jwtUtils } from "../../utility/jwt";
import crypto from "crypto";
import { redisClient } from "../../lib/redis";
import path from "path";
import { transporter } from "../../lib/nodemailer";

const RegisterUser = async (payload: registerPayload) => {
  const userEmailExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userEmailExist) {
    throw new AppError(httpStatus.CONFLICT, "user already exist!");
  }
  const hashPassword = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds,
  );
  const OTP = crypto.randomInt(100000, 1000000).toString();
  const OTPKEY = `user-registration-otp:${payload.email}`;
  await redisClient.set(OTPKEY, OTP, {
    expiration: { type: "EX", value: 5 * 60 },
  });

  const userRegistrationKey = `user-registration:${payload.email}`;
  const userPayload = {
    name: payload.name,
    email: payload.email,
    password: hashPassword,
    image_url: payload.image_url,
    phone_number: payload.phone_number,
  };
  await redisClient.set(userRegistrationKey, JSON.stringify(userPayload), {
    expiration: { type: "EX", value: 5 * 60 },
  });

  const tamplate = path.join(
    process.cwd(),
    "/src/templates/auth/register-templates.ejs",
  );
  const html = await ejs.renderFile(tamplate, {
    name: payload.name,
    OTP,
    expireMinutes: 5,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: payload.email,
    subject: "verify your email - project management system.",
    html,
  });
  return { message: "OTP sent to your email for verification" };
};
const VerifyEmail = async (payload: verifyPayload) => {
  const { email, otp } = payload;
  const OTPKEY = `user-registration-otp:${email}`;
  const storedOTP = await redisClient.get(OTPKEY);
  if (!storedOTP) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP not found or expired");
  }
  if (storedOTP !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP does not match!");
  }
  const userRegistrationKey = `user-registration:${payload.email}`;
  const storeRegistrationData = await redisClient.get(userRegistrationKey);
  if (!storeRegistrationData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Registration data not found or expired",
    );
  }
  const parseUserData = JSON.parse(storeRegistrationData);

  const result = await prisma.user.create({
    data: {
      name: parseUserData.name,
      email: parseUserData.email,
      password: parseUserData.password,
      image_url: parseUserData.image_url,
      phone_number: parseUserData.phone_number,
    },
    omit: {
      password: true,
    },
  });

  const template = path.join(
    process.cwd(),
    "/src/templates/auth/verify-email-templates.ejs",
  );
  const html = await ejs.renderFile(template, {
    name: result.name,
    email: result.email,
    year: new Date().getFullYear(),
  });
  await transporter.sendMail({
    from: config.email_sender,
    to: result.email,
    subject: "Welcome to project Management.",
    html,
  });
  await redisClient.del(OTPKEY);
  await redisClient.del(userRegistrationKey);
  const jwtPayload = {
    userId: result.id,
    name: result.name,
    email: result.email,
    role: result.role,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expire_in,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expire_in,
  );
  return { accessToken, refreshToken, user: result };
};

const LoginUser = async (payload: loginPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  const isMatch = await bcrypt.compare(
    payload.password,
    user?.password as string,
  );
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }
  const template = path.join(
    process.cwd(),
    "/src/templates/auth/login-success-templates.ejs",
  );
  const successHtml = await ejs.renderFile(template, {
    name: user.name,
    email: user.email,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: "Welcome to Project Management.",
    html: successHtml,
  });
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expire_in,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expire_in,
  );
  const { password: userPassword, ...userWithoutPassword } = user;
  return { accessToken, refreshToken, user: userWithoutPassword };
};

export const authService = {
  RegisterUser,
  LoginUser,
  VerifyEmail,
};
