import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { sprintController } from "./sprints.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { sprintValidation } from "./sprints.validation";

const router = Router();

router.post(
	"/:projectId/sprint-add",
	auth(),
	validationRequest(sprintValidation.zSprintSchema),
	sprintController.createSprint,
);
router.get("/:projectId/sprint-get", auth(), sprintController.getSprint);
router.patch(
	"/:sprintId/sprint-update",
	auth(),
	validationRequest(sprintValidation.zSprintSchema),
	sprintController.updateSprint,
);
export const sprintRoutes = router;
