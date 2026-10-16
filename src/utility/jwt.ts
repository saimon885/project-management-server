import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

export const jwtUtils = {
  createToken,
};
