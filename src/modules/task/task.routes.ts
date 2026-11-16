import { Router } from "express";
import { taskController } from "./task.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();
router.post("/:projectId/task-add", auth(), taskController.createTask);
router.get("/:projectId/task-get", auth(), taskController.getTask);
router.patch("/:taskId/task-update", auth(), taskController.updateTask);
router.delete("/:taskId/task-del", auth(), taskController.DeleteTask);
export const taskRoutes = router;
