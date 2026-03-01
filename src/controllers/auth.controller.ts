import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const existing = await prisma.user?.findUnique?.({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: "Email already in use" });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user?.create?.({
        data: { email, password: hash, name: name ?? null },
      });

      if (!user) {
        return res.status(503).json({
          error: "Prisma Client not generated yet. Please run migrations and generation.",
        });
      }

      const token = signToken(user.id);
      res.status(201).json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  }

  static async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await prisma.user?.findUnique?.({ where: { email } });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });

      const token = signToken(user.id);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  }
}
