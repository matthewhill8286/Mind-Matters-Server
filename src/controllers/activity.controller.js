import { prisma } from "../lib/prisma";
import { getUserId } from "../middlewares/auth.middleware";
export class ActivityController {
    // Mood
    static async getMoods(req, res) {
        const userId = getUserId(req);
        const moods = await prisma.mood.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(moods.map(m => ({ id: m.id, createdAt: m.createdAt, ...m.data })));
    }
    static async createMood(req, res) {
        const userId = getUserId(req);
        const mood = await prisma.mood.create({
            data: { userId, data: req.body }
        });
        res.json({ id: mood.id, createdAt: mood.createdAt, ...(mood.data ?? {}) });
    }
    static async deleteMood(req, res) {
        const userId = getUserId(req);
        try {
            const { id } = req.params;
            await prisma.mood.delete({
                where: { id: id, userId }
            });
            res.sendStatus(204);
        }
        catch (e) {
            res.sendStatus(404);
        }
    }
    // Journal
    static async getJournals(req, res) {
        const userId = getUserId(req);
        const journals = await prisma.journal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(journals.map(j => ({ id: j.id, createdAt: j.createdAt, updatedAt: j.updatedAt, ...j.data })));
    }
    static async createJournal(req, res) {
        const userId = getUserId(req);
        const journal = await prisma.journal.create({
            data: { userId, data: req.body }
        });
        res.json({ id: journal.id, createdAt: journal.createdAt, updatedAt: journal.updatedAt, ...journal.data });
    }
    static async updateJournal(req, res) {
        const userId = getUserId(req);
        try {
            const { id } = req.params;
            const journal = await prisma.journal.update({
                where: { id: id, userId },
                data: { data: req.body }
            });
            res.json({ id: journal.id, createdAt: journal.createdAt, updatedAt: journal.updatedAt, ...journal.data });
        }
        catch (e) {
            res.status(404).json({ error: "Journal entry not found" });
        }
    }
    static async deleteJournal(req, res) {
        const userId = getUserId(req);
        try {
            const { id } = req.params;
            await prisma.journal.delete({
                where: { id: id, userId }
            });
            res.sendStatus(204);
        }
        catch (e) {
            res.sendStatus(404);
        }
    }
    // Stress Management
    static async getStressKit(req, res) {
        const userId = getUserId(req);
        const kit = await prisma.stressKit.findUnique({ where: { userId } });
        const defaultKit = { triggers: [], helpfulActions: [], people: [] };
        res.json(kit?.data || defaultKit);
    }
    static async updateStressKit(req, res) {
        const userId = getUserId(req);
        const kit = await prisma.stressKit.upsert({
            where: { userId },
            update: { data: req.body },
            create: { userId, data: req.body }
        });
        res.json(kit.data);
    }
    static async getStressHistory(req, res) {
        const userId = getUserId(req);
        const history = await prisma.stressHistory.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(history.map(h => ({ ...h.data, date: h.date })));
    }
    static async createStressHistory(req, res) {
        const userId = getUserId(req);
        const entry = await prisma.stressHistory.create({
            data: { userId, data: req.body }
        });
        res.json({ ...entry.data, date: entry.date });
    }
    // Mindfulness
    static async getMindfulness(req, res) {
        const userId = getUserId(req);
        const mindfulness = await prisma.mindfulness.findMany({
            where: { userId },
            orderBy: { dateISO: 'desc' }
        });
        res.json(mindfulness.map(m => ({ id: m.id, dateISO: m.dateISO, ...m.data })));
    }
    static async createMindfulness(req, res) {
        const userId = getUserId(req);
        const entry = await prisma.mindfulness.create({
            data: { userId, data: req.body }
        });
        res.json({ id: entry.id, dateISO: entry.dateISO, ...entry.data });
    }
    // Sleep
    static async getSleep(req, res) {
        const userId = getUserId(req);
        const sleep = await prisma.sleep.findMany({
            where: { userId },
            orderBy: { createdAtISO: 'desc' }
        });
        res.json(sleep.map(s => ({ id: s.id, createdAtISO: s.createdAtISO, ...s.data })));
    }
    static async createSleep(req, res) {
        const userId = getUserId(req);
        const entry = await prisma.sleep.create({
            data: { userId, data: req.body }
        });
        res.json({ id: entry.id, createdAtISO: entry.createdAtISO, ...entry.data });
    }
    static async deleteSleep(req, res) {
        const userId = getUserId(req);
        try {
            const { id } = req.params;
            await prisma.sleep.delete({
                where: { id: id, userId }
            });
            res.sendStatus(204);
        }
        catch (e) {
            res.sendStatus(404);
        }
    }
}
