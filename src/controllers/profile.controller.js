import { prisma } from "../lib/prisma";
import { getUserId } from "../middlewares/auth.middleware";
export class ProfileController {
    static async getProfile(req, res) {
        const userId = getUserId(req);
        const profile = await prisma.profile.findUnique({ where: { userId } });
        res.json(profile?.data || {});
    }
    static async updateProfile(req, res) {
        const userId = getUserId(req);
        const profile = await prisma.profile.upsert({
            where: { userId },
            update: { data: req.body },
            create: { userId, data: req.body },
        });
        res.json(profile.data);
    }
    static async getAssessment(req, res) {
        const userId = getUserId(req);
        const assessment = await prisma.assessment.findUnique({ where: { userId } });
        res.json(assessment?.data || {});
    }
    static async updateAssessment(req, res) {
        const userId = getUserId(req);
        await prisma.assessment.upsert({
            where: { userId },
            update: { data: req.body },
            create: { userId, data: req.body },
        });
        res.json({ success: true });
    }
}
