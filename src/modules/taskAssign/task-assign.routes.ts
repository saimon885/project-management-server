import { Router } from "express";
import { taskAssignController } from "./task-assign.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { taskAssignValidation } from "./taskAssign.validation";

const router = Router();
router.post(
	"/:taskId/assign-task",
	auth(),
	validationRequest(taskAssignValidation.zTaskAssignSchema),
	taskAssignController.AssignTask,
);
router.patch(
	"/:taskId/reassign-task",
	auth(),
	validationRequest(taskAssignValidation.zTaskAssignSchema),
	taskAssignController.ReassignTask,
);
router.get(
	"/:taskId/assign-history",
	auth(),
	taskAssignController.assignHistory,
);

export const taskAssignRoutes = router;
