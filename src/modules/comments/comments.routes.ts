import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { commentsController } from "./comments.controller";

const router = Router();
router.post("/:taskId/add", auth(), commentsController.addComment);
router.get("/:taskId/get", auth(), commentsController.getComment);
router.patch("/:comId/update", auth(), commentsController.updateComment);
router.delete("/:comId/del", auth(), commentsController.deleteComment);
export const commentsRoutes = router;
