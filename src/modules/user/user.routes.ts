import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { userController } from "./user.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";

const router = Router();
router.get("/me", auth(), userController.getMyProfile);
router.get("/all-users", auth(UserRole.ADMIN), userController.getAllUsers);
router.patch(
  "/update-profile",
  auth(),
  upload.single("profileImage"),
  userController.updateMyProfile,
);

export const userRoutes = router;
