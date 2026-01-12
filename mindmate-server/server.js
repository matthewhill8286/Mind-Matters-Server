import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import FormData from "form-data";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/transcribe", upload.single("file"), async (req, res) => {
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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(resp.status).json({ error: errText });
    }

    const data = await resp.json();
    res.json({ text: data.text ?? "" });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post("/chat", async (req, res) => {
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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

    const data = await resp.json();
    const outputText =
      data.output_text ??
      data.output?.find((it) => it.type === "message")?.content?.[0]?.text ??
      "Sorry — I couldn’t generate a response.";

    res.json({ text: outputText });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(process.env.PORT || 8787, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT || 8787}`);
});
