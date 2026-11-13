import { Router } from "express";
import { projectController } from "./projects.controller";
import { auth } from "../../middleware/checkAuth";
import { checkOrgAccess } from "../../middleware/checkOrgAccess";
import { requireOrgRole } from "../../middleware/org-role";

const router = Router();
router.post(
  "/:organizationId/projects",
  auth(),
  checkOrgAccess(),
  requireOrgRole("ORGANIZATION_OWNER"),
  projectController.CreateProject,
);
router.get(
  "/:organizationId",
  auth(),
  checkOrgAccess(),
  projectController.getAllProject,
);
router.get(
  "/:projectId/project-details",
  auth(),
  projectController.getSingleProject,
);
export const projectRoutes = router;
