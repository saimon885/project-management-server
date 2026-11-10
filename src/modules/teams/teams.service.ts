import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import httpStatus from "http-status";
import { ICreateTeamPayload } from "./teams.interface";

const CreateTeam = async (
  payload: ICreateTeamPayload,
  orgId: string,
  createdBy: string,
) => {
  const { name, description } = payload;

  const existingTeam = await prisma.team.findUnique({
    where: {
      organizationId_name: {
        organizationId: orgId,
        name,
      },
    },
  });

  if (existingTeam) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A team with this name already exists in this organization!",
    );
  }

  const team = await prisma.team.create({
    data: {
      name,
      description,
      organizationId: orgId,
      createdById: createdBy,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          members: true,
          projects: true,
        },
      },
    },
  });

  return team;
};

const getAllTeam = async () => {
  const result = await prisma.team.findMany();
  return result;
};

export const teamService = {
  CreateTeam,
  getAllTeam,
};
