import { Router } from "express";
import { bkashPaymentController } from "./bkashPayment.controller";
import { auth } from "../../middleware/checkAuth";
import { checkOrgAccess } from "../../middleware/checkOrgAccess";
import { requireOrgRole } from "../../middleware/org-role";

const router = Router();
router.post(
  "/:organizationId/payment",
  auth(),
  checkOrgAccess(),
  requireOrgRole("ORGANIZATION_OWNER"),
  bkashPaymentController.CreateBkashPayment,
);

router.get(
  "/my-payment-history",
  auth(),
  bkashPaymentController.getMyPaymentHistory,
);
router.get(
  "/organization/payment/callback",
  bkashPaymentController.getbkashPaymentCallback,
);
export const bkashPaymentRoutes = router;
