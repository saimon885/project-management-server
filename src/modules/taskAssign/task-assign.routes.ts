import { Router } from "express";
import { taskAssignController } from "./task-assign.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();
router.post("/:taskId/assign-task", auth(), taskAssignController.AssignTask);
router.post(
  "/:taskId/reassign-task",
  auth(),
  taskAssignController.ReassignTask,
);
router.get(
  "/:taskId/assign-history",
  auth(),
  taskAssignController.assignHistory,
);
router.put(
  "/:taskId/update-assign-task",
  auth(),
  taskAssignController.updateAssignTask,
);

export const taskAssignRoutes = router;
