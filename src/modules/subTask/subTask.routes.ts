import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { subTaskController } from "./subTask.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { taskValidation } from "../task/task.validation";

const router = Router();
router.post(
	"/:taskId/add",
	auth(),
	validationRequest(taskValidation.zTaskSchema),
	subTaskController.createSubTask,
);
router.get("/:taskId/get", auth(), subTaskController.getSubTask);
router.patch(
	"/:subTaskId/update",
	auth(),
	validationRequest(taskValidation.zTaskSchema),
	subTaskController.updateSubTask,
);
router.delete("/:subTaskId/del", auth(), subTaskController.DeleteSubTask);
export const subTaskRoutes = router;
