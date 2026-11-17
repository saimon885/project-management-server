import { Router } from "express";
import { taskController } from "./task.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { taskValidation } from "./task.validation";

const router = Router();
router.post(
	"/:projectId/task-add",
	auth(),
	validationRequest(taskValidation.zTaskSchema),
	taskController.createTask,
);
router.get("/:projectId/task-get", auth(), taskController.getTask);
router.patch(
	"/:taskId/task-update",
	auth(),
	validationRequest(taskValidation.zTaskSchema),
	taskController.updateTask,
);
router.delete("/:taskId/task-del", auth(), taskController.DeleteTask);
export const taskRoutes = router;
