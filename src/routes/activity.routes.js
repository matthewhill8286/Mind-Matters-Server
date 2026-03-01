import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
const router = Router();
// Mood
router.get("/mood", ActivityController.getMoods);
router.post("/mood", ActivityController.createMood);
router.delete("/mood/:id", ActivityController.deleteMood);
// Journal
router.get("/journal", ActivityController.getJournals);
router.post("/journal", ActivityController.createJournal);
router.put("/journal/:id", ActivityController.updateJournal);
router.delete("/journal/:id", ActivityController.deleteJournal);
// Stress Management
router.get("/stress/kit", ActivityController.getStressKit);
router.put("/stress/kit", ActivityController.updateStressKit);
router.get("/stress/history", ActivityController.getStressHistory);
router.post("/stress/history", ActivityController.createStressHistory);
// Mindfulness
router.get("/mindfulness", ActivityController.getMindfulness);
router.post("/mindfulness", ActivityController.createMindfulness);
// Sleep
router.get("/sleep", ActivityController.getSleep);
router.post("/sleep", ActivityController.createSleep);
router.delete("/sleep/:id", ActivityController.deleteSleep);
export default router;
