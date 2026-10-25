import { Router } from "express";
import { invitationController } from "./invitation.controller";
import { auth } from "../../middleware/checkAuth";
import { checkOrgAccess } from "../../middleware/checkOrgAccess";

const router = Router();

router.post(
  "/invite/:orgId",
  auth(),
  checkOrgAccess(),
  invitationController.InviteUser,
);
router.post(
  "/accept-invite/:token",
  auth(),
//   checkOrgAccess(),
  invitationController.acceptedInvite,
);

export const invitationRoutes = router;
