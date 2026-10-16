import { Response } from "express";

type Tmeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};
type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  messege: string;
  data: T;
  meta?: Tmeta;
};
export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    messege: data.messege,
    data: data.data,
    meta: data.meta,
  });
};
