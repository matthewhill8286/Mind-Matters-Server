import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest, getUserId } from "../middlewares/auth.middleware";

export class ActivityController {
  // Mood
  static async getMoods(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const moods = await prisma.mood.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(moods.map(m => ({ id: m.id, createdAt: m.createdAt, ...(m.data as any) })));
  }

  static async createMood(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const mood = await prisma.mood.create({
      data: { userId, data: req.body }
    });
    res.json({ id: mood.id, createdAt: mood.createdAt, ...((mood.data as any) ?? {}) });
  }

  static async deleteMood(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    try {
      const { id } = req.params;
      await prisma.mood.delete({
        where: { id: id as string, userId }
      });
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(404);
    }
  }

  // Journal
  static async getJournals(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const journals = await prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(journals.map(j => ({ id: j.id, createdAt: j.createdAt, updatedAt: j.updatedAt, ...(j.data as any) })));
  }

  static async createJournal(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const journal = await prisma.journal.create({
      data: { userId, data: req.body }
    });
    res.json({ id: journal.id, createdAt: journal.createdAt, updatedAt: journal.updatedAt, ...(journal.data as any) });
  }

  static async updateJournal(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    try {
      const { id } = req.params;
      const journal = await prisma.journal.update({
        where: { id: id as string, userId },
        data: { data: req.body }
      });
      res.json({ id: journal.id, createdAt: journal.createdAt, updatedAt: journal.updatedAt, ...(journal.data as any) });
    } catch (e) {
      res.status(404).json({ error: "Journal entry not found" });
    }
  }

  static async deleteJournal(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    try {
      const { id } = req.params;
      await prisma.journal.delete({
        where: { id: id as string, userId }
      });
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(404);
    }
  }

  // Stress Management
  static async getStressKit(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const kit = await prisma.stressKit.findUnique({ where: { userId } });
    const defaultKit = { triggers: [], helpfulActions: [], people: [] };
    res.json((kit?.data as any) || defaultKit);
  }

  static async updateStressKit(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const kit = await prisma.stressKit.upsert({
      where: { userId },
      update: { data: req.body },
      create: { userId, data: req.body }
    });
    res.json(kit.data);
  }

  static async getStressHistory(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const history = await prisma.stressHistory.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    res.json(history.map(h => ({ ...(h.data as any), date: h.date })));
  }

  static async createStressHistory(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const entry = await prisma.stressHistory.create({
      data: { userId, data: req.body }
    });
    res.json({ ...(entry.data as any), date: entry.date });
  }

  // Mindfulness
  static async getMindfulness(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const mindfulness = await prisma.mindfulness.findMany({
      where: { userId },
      orderBy: { dateISO: 'desc' }
    });
    res.json(mindfulness.map(m => ({ id: m.id, dateISO: m.dateISO, ...(m.data as any) })));
  }

  static async createMindfulness(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const entry = await prisma.mindfulness.create({
      data: { userId, data: req.body }
    });
    res.json({ id: entry.id, dateISO: entry.dateISO, ...(entry.data as any) });
  }

  // Sleep
  static async getSleep(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const sleep = await prisma.sleep.findMany({
      where: { userId },
      orderBy: { createdAtISO: 'desc' }
    });
    res.json(sleep.map(s => ({ id: s.id, createdAtISO: s.createdAtISO, ...(s.data as any) })));
  }

  static async createSleep(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const entry = await prisma.sleep.create({
      data: { userId, data: req.body }
    });
    res.json({ id: entry.id, createdAtISO: entry.createdAtISO, ...(entry.data as any) });
  }

  static async deleteSleep(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    try {
      const { id } = req.params;
      await prisma.sleep.delete({
        where: { id: id as string, userId }
      });
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(404);
    }
  }
}
