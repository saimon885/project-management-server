import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { sprintController } from "./sprints.controller";

const router = Router();

router.post("/:projectId/sprint-add", auth(), sprintController.createSprint);
router.get("/:projectId/sprint-get", auth(), sprintController.getSprint);
router.patch("/:sprintId/sprint-update", auth(), sprintController.updateSprint);
export const sprintRoutes = router;
