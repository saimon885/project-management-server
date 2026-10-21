import { UploadApiResponse } from "cloudinary";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { organizationPayload } from "./organization.interface";
import httpStatus from "http-status";
import { cloudinary } from "../../lib/cloudinary";

const CreateOrganization = async (
  payload: organizationPayload,
  buffer: Buffer | undefined,
  userId: string,
) => {
  const existingOrganization = await prisma.organization.findFirst({
    where: {
      OR: [{ name: payload.name }, { slug: payload.slug }],
    },
    select: {
      logoPublishedID: true,
    },
  });
  if (existingOrganization) {
    throw new AppError(httpStatus.CONFLICT, "organization already exist.");
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
                  "Failed to upload image to Cloudinary",
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

  const result = await prisma.organization.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      logoUrl: cloudinaryResult?.secure_url,
      logoPublishedID: cloudinaryResult?.public_id,
      members: {
        create: { role: UserRole.ORGANIZATION_OWNER, userId: userId },
      },
    },
    include: {
      members: true,
    },
  });
  return result;
};

export const organizationService = {
  CreateOrganization,
};
