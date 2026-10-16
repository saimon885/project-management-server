import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  app_url: process.env.APP_URL,
  databaseUrl: process.env.DATABASE_URL,

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS)!,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN!,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN!,
};
