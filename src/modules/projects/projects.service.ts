import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { createProjectPayload } from "./project.interface";

const CreateProject = async (
  payload: createProjectPayload,
  orgId: string,
  userId: string,
) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      members: {
        where: {
          userId: userId,
        },
      },
    },
  });

  if (!organization) {
    throw new AppError(404, "Organization not found");
  }

  if (organization.members.length === 0) {
    throw new AppError(403, "User is not a member of this organization");
  }

  const checkTeam = await prisma.team.findFirst({
    where: {
      id: payload.teamId,
      organizationId: orgId,
    },
  });

  if (!checkTeam) {
    throw new AppError(404, "Team not found in this organization");
  }

  const checkKey = await prisma.project.findFirst({
    where: {
      key: payload.key,
    },
  });

  if (checkKey) {
    throw new AppError(409, "Project key already exists");
  }

  const result = await prisma.project.create({
    data: {
      name: payload.name,
      key: payload.key,
      organizationId: orgId,
      teamId: payload.teamId,
      description: payload.description,
      createdById: userId,
    },
  });

  return result;
};

const getAllProject = async (orgId: string) => {
  const result = await prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
  });
  if (!result) {
    throw new AppError(404, "project not found!");
  }
  return result;
};

const getProjectDetails = async (projectId: string) => {
  const result = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!result) {
    throw new AppError(404, "project not found!");
  }
  return result;
};

export const projectService = {
  CreateProject,
  getAllProject,
  getProjectDetails,
};
