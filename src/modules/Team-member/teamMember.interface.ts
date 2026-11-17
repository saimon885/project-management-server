export interface IInviteTeamPayload {
	userId: string;
	role?: "TEAM_LEAD" | "MEMBER";
}
