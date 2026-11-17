import { Router } from "express";
import { projectController } from "./projects.controller";
import { auth } from "../../middleware/checkAuth";
import { checkOrgAccess } from "../../middleware/checkOrgAccess";
import { requireOrgRole } from "../../middleware/org-role";
import { validationRequest } from "../../middleware/validationRequest";
import { projectValidation } from "./project.validation";

const router = Router();
router.post(
	"/:organizationId/projects",
	auth(),
	checkOrgAccess(),
	requireOrgRole("ORGANIZATION_OWNER"),
	validationRequest(projectValidation.zProjectSchema),
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
