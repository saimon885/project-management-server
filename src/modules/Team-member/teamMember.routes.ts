import { Router } from "express";
import { teamMemberController } from "./teamMember.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();
router.post("/:teamId/team", auth(), teamMemberController.inviteTeam);
router.get(
  "/:teamId/team-member",
  auth(),
  teamMemberController.getAllTeamMember,
);
export const teamMemberRoutes = router;
