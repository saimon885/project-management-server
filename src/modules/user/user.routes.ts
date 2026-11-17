import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { userController } from "./user.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { validationRequest } from "../../middleware/validationRequest";
import { userValidation } from "./user.validation";

const router = Router();
router.get("/me", auth(), userController.getMyProfile);
router.get("/all-users", auth(UserRole.ADMIN), userController.getAllUsers);
router.patch(
	"/update-profile",
	auth(),
	upload.single("profileImage"),
	validationRequest(userValidation.zupdateUserSchema),
	userController.updateMyProfile,
);

export const userRoutes = router;
