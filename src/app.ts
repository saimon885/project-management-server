import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/not-found";
import { auth } from "./middleware/checkAuth";
import { UserRole } from "../generated/prisma/enums";
export const app = express();

app.use(express.json());
app.use(cors({ origin: config.app_url, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", auth(), (req: Request, res: Response) => {
  res.send("welcome to project management!");
});

app.use("/api/v1/auth", authRoutes);

app.use(globalErrorHandler);
app.use(notFound);
