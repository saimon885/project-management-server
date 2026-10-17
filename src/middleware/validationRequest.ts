import z from "zod";
import { catchAsync } from "../utility/catchAsync";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const validationRequest = (zodSchema: z.ZodObject) => {
  return catchAsync((req: Request, res: Response, next: NextFunction) => {
    const payload = req.body ?? {};
    const result = zodSchema.safeParse(payload);
    if (!result.success) {
      (httpStatus.BAD_REQUEST, result.error.issues[0].message);
    }
    req.body = result.data;
    next();
  });
};
