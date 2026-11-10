import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";

interface IInviteTeamPayload {
  userId: string;
  role?: "TEAM_LEAD" | "MEMBER";
}

const inviteTeam = async (
  payload: IInviteTeamPayload,
  teamId: string,
  teamOwnerId: string,
) => {
  const { userId, role = "MEMBER" } = payload;

  // 1. Check Team
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found!");
  }

  // 2. Check Organization Membership
  const organizationMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: team.organizationId,
        userId,
      },
    },
  });

  if (!organizationMember) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This user is not a member of this organization!",
    );
  }

  // 3. Check Team Member
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (existingMember) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This user is already a member of this team!",
    );
  }

  // 4. Check Inviter Permission
  const inviter = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId: teamOwnerId,
      },
    },
  });

  const organizationRole = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: team.organizationId,
        userId: teamOwnerId,
      },
    },
  });

  const canInvite =
    ["ORGANIZATION_OWNER", "ADMIN", "MANAGER"].includes(
      organizationRole?.role ?? "",
    ) || inviter?.role === "TEAM_LEAD";

  if (!canInvite) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to add members to this team!",
    );
  }

  // 5. Create Team Member
  const result = await prisma.teamMember.create({
    data: {
      teamId,
      userId,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};
const teamMember = async (teamId: string) => {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found!");
  }

  const result = await prisma.teamMember.findMany({
    where: {
      teamId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const teamMemberService = {
  inviteTeam,
  teamMember,
};
