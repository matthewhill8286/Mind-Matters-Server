import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import activityRoutes from "./activity.routes";
import chatRoutes from "./chat.routes";
import stripeRoutes from "./stripe.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();
// Public routes
router.use("/auth", authRoutes);
// Protected routes (using authMiddleware for everything else)
router.use(authMiddleware);
router.use(profileRoutes);
router.use(activityRoutes);
router.use(chatRoutes);
router.use(stripeRoutes);
export default router;
