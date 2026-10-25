import { Router } from "express";
import { organizationController } from "./organization.controller";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post(
  "/",
  auth(),
  upload.single("logoUrl"),
  organizationController.createOrganization,
);

router.get("/org", auth(), organizationController.getOrganization);

export const organizationRoutes = router;
