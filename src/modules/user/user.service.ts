import { UploadApiResponse } from "cloudinary";
import { prisma } from "../../lib/prisma";

import { AppError } from "../../utility/AppError";
import httpStatus from "http-status";
import { updateUserPayload } from "./user.interface";
import { cloudinary } from "../../lib/cloudinary";

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  return user;
};

const getAllUser = async () => {
  const user = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  return user;
};

const updateUserProfile = async (
  buffer: Buffer | undefined,
  payload: updateUserPayload,
  userId: string,
) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      imagePublishedID: true,
      image_url: true,
    },
  });

  if (!currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  let cloudinaryResult: UploadApiResponse | null = null;
  if (buffer) {
    cloudinaryResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) {
              return reject(
                new AppError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  `Cloudinary Upload Failed: ${error.message}`,
                ),
              );
            }

            if (!result) {
              return reject(
                new AppError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  "No result returned from Cloudinary upload",
                ),
              );
            }

            resolve(result);
          })
          .end(buffer);
      },
    );
  }
  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name ?? payload.name,
      phone_number: payload.phone_number ?? payload.phone_number,
      image_url: cloudinaryResult?.secure_url,
      imagePublishedID: cloudinaryResult?.public_id,
    },
    omit: {
      password: true,
    },
  });
  if (cloudinaryResult && currentUser?.imagePublishedID) {
    await cloudinary.uploader.destroy(currentUser.imagePublishedID);
  }
  return updateUser;
};

export const userService = {
  getMyProfile,
  getAllUser,
  updateUserProfile,
};
