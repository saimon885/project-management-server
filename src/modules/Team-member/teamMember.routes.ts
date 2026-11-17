import { Router } from "express";
import { teamMemberController } from "./teamMember.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { teamMemberValidation } from "./teamMember.validation";

const router = Router();
router.post(
	"/:teamId/team",
	auth(),
	validationRequest(teamMemberValidation.zTeamvalidationSchema),
	teamMemberController.inviteTeam,
);
router.get(
	"/:teamId/team-member",
	auth(),
	teamMemberController.getAllTeamMember,
);
export const teamMemberRoutes = router;
