import { Router } from "express";
import { authController } from "./auth.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { authValidation } from "./auth.validation";

const router = Router();
router.post(
  "/register",
  validationRequest(authValidation.zodRegisterSchema),
  authController.RegisterUser,
);
router.post(
  "/verify-email",
  validationRequest(authValidation.zodVerifySchema),
  authController.VerifyEmail,
);
router.post(
  "/login",
  validationRequest(authValidation.zodLoginSchema),
  authController.LoginUser,
);
// router.post("/logout");
// router.post("/google");
// router.post("/forgot-password");
// router.post("/reset-password");
export const authRoutes = router;
