import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { commentsController } from "./comments.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { commentsValidation } from "./comments.validation";

const router = Router();
router.post(
	"/:taskId/add",
	auth(),
	validationRequest(commentsValidation.zCommentSchema),
	commentsController.addComment,
);
router.get("/:taskId/get", auth(), commentsController.getComment);
router.patch(
	"/:commentId/update",
	auth(),
	validationRequest(commentsValidation.zCommentSchema),
	commentsController.updateComment,
);
router.delete("/:commentId/del", auth(), commentsController.deleteComment);
export const commentsRoutes = router;
