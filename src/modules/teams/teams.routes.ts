import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { checkOrgAccess } from "../../middleware/checkOrgAccess";
import { requireOrgRole } from "../../middleware/org-role";
import { teamController } from "./teams.controller";

const router = Router();

router.post(
  "/:organizationId",
  auth(),
  checkOrgAccess(),
  requireOrgRole("ORGANIZATION_OWNER", "ADMIN", "MANAGER"),
  teamController.CreateTeam,
);

router.get(
  "/:organizationId/get",
  auth(),
  checkOrgAccess(),
  teamController.getTeam,
);
export const teamRoutes = router;
