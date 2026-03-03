import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest, getUserId } from "../middlewares/auth.middleware";

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const profile = await prisma.profile.findUnique({ where: { userId } });
    res.json((profile?.data as any) || {});
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { data: req.body },
      create: { userId, data: req.body },
    });
    res.json(profile.data);
  }

  static async getAssessment(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const assessment = await prisma.assessment.findUnique({ where: { userId } });
    res.json((assessment?.data as any) || {});
  }

  static async updateAssessment(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    await prisma.assessment.upsert({
      where: { userId },
      update: { data: req.body },
      create: { userId, data: req.body },
    });
    res.json({ success: true });
  }
}
