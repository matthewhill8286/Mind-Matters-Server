import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest, getUserId } from "../middlewares/auth.middleware";
import FormData from "form-data";
import fetch from "node-fetch";
import { config } from "../config";

export class ChatController {
  static async getChatHistory(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const { issueKey } = req.params;
    const history = await prisma.chatHistory.findUnique({
      where: { userId_issueKey: { userId, issueKey: issueKey as string } }
    });
    res.json((history?.messages as any) || []);
  }

  static async updateChatHistory(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const { issueKey } = req.params;
    const message = req.body;

    const existing = await prisma.chatHistory.findUnique({
      where: { userId_issueKey: { userId, issueKey: issueKey as string } }
    });

    const updatedMessages = [...((existing?.messages as any[]) || []), message];

    await prisma.chatHistory.upsert({
      where: { userId_issueKey: { userId, issueKey: issueKey as string } },
      update: { messages: updatedMessages },
      create: { userId, issueKey: issueKey as string, messages: [message] }
    });

    res.json(message);
  }

  static async deleteChatHistory(req: AuthenticatedRequest, res: Response) {
    const userId = getUserId(req);
    const { issueKey } = req.params;
    await prisma.chatHistory.delete({
      where: { userId_issueKey: { userId, issueKey: issueKey as string } }
    }).catch(() => {});
    res.sendStatus(204);
  }

  static async transcribe(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: "Missing file" });

      const form = new FormData();
      form.append("file", req.file.buffer, {
        filename: req.file.originalname || "audio.m4a",
        contentType: req.file.mimetype || "application/octet-stream",
      });
      form.append("model", "whisper-1");

      const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.OPENAI_API_KEY}`,
          ...form.getHeaders(),
        },
        body: form,
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: errText });
      }

      const data: any = await resp.json();
      res.json({ text: data.text ?? "" });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  }

  static async chat(req: Request, res: Response) {
    try {
      const { issueTitle, issueTags, messages } = req.body;

      if (!issueTitle || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid payload" });
      }

      const instructions = `
You are a supportive mental-health coaching assistant.
User selected: "${issueTitle}".
Relevant tags: ${Array.isArray(issueTags) ? issueTags.join(", ") : ""}

Provide practical, compassionate coping steps. Avoid diagnosis.
If self-harm intent is present, encourage immediate local emergency help / crisis resources.
`.trim();

      const resp = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5",
          instructions,
          input: messages,
          store: false,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: errText });
      }

      const data: any = await resp.json();
      const outputText =
        data?.output_text ??
        data?.output?.find((it: { type: string; }) => it.type === "message")?.content?.[0]?.text ??
        "Sorry — I couldn’t generate a response.";

      res.json({ text: outputText });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  }
}
