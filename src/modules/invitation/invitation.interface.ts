import type { UserRole } from "../../../generated/prisma/enums";

export interface IinviteUserPayload {
	email: string;
	role: UserRole;
}
