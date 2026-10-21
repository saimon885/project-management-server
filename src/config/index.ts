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
  google_client_id: process.env.GOOGLE_CLIENT_ID!,

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS)!,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN!,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN!,

  redis_username: process.env.REDIS_USERNAME!,
  redis_password: process.env.REDIS_PASSWORD!,
  redis_host: process.env.REDIS_HOST!,
  redis_port: process.env.REDIS_PORT!,

  smtp_username: process.env.SMTP_USERNAME!,
  email_sender: process.env.EMAIL_SENDER!,
  smtp_password: process.env.SMTP_PASSWORD!,

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  cloudinary_cloud_api_key: process.env.CLOUDINARY_CLOUD_API_KEY!,
  cloudinary_cloud_api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET!,
};
