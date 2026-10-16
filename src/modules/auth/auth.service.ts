import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { registerPayload } from "./auth.interface";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../utility/jwt";
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
  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashPassword,
      image_url: payload.image_url,
      phone_number: payload.phone_number,
    },
  });
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
const LoginUser = () => {};
const VerifyEmail = () => {};

export const authService = {
  RegisterUser,
  LoginUser,
  VerifyEmail,
};
