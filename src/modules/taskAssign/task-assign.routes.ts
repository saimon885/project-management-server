import { Router } from "express";
import { taskAssignController } from "./task-assign.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();
router.post("/:taskId/assign-task", auth(), taskAssignController.AssignTask);
router.patch(
  "/:taskId/reassign-task",
  auth(),
  taskAssignController.ReassignTask,
);
router.get(
  "/:taskId/assign-history",
  auth(),
  taskAssignController.assignHistory,
);

export const taskAssignRoutes = router;
