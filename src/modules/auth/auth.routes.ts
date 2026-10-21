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
  "/google-login",
  validationRequest(authValidation.zodGoogleLoginSchema),
  authController.googleLogin,
);
router.post(
  "/login",
  validationRequest(authValidation.zodLoginSchema),
  authController.LoginUser,
);
router.post("/logOut", authController.LogOut);
router.post(
  "/forgot-password",
  validationRequest(authValidation.zodForgotSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validationRequest(authValidation.zodResetSchema),
  authController.resetPassword,
);
export const authRoutes = router;
