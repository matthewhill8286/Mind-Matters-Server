import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
const router = Router();
router.get("/profile", ProfileController.getProfile);
router.post("/profile", ProfileController.updateProfile);
router.put("/profile", ProfileController.updateProfile);
router.get("/assessment", ProfileController.getAssessment);
router.post("/assessment", ProfileController.updateAssessment);
export default router;
