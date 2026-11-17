import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { subTaskController } from "./subTask.controller";

const router = Router();
router.post("/:taskId/add", auth(), subTaskController.createSubTask);
router.get("/:taskId/get", auth(), subTaskController.getSubTask);
router.patch("/:subTaskId/update", auth(), subTaskController.updateSubTask);
router.delete("/:subTaskId/del", auth(), subTaskController.DeleteSubTask);
export const subTaskRoutes = router;
