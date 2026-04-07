require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildPrompt(topic, level, mood, simplify = false) {
  const moodInstructions = {
    Tired:
      "The student is tired, so keep the explanation very short, use simple bullet points, and avoid overwhelming them with information.",
    Confused:
      "The student is confused, so break the explanation into very clear steps, use analogies, and reassure them it's okay to take it slowly.",
    Curious:
      "The student is curious and eager to learn, so include an interesting fact or a brief 'why this matters' note to keep them engaged.",
  };

  const levelInstructions = {
    Beginner:
      "Explain as if to someone who has never heard of this topic before. Use simple words and relatable everyday examples.",
    Intermediate:
      "The student has some background knowledge. You can use some field-specific terms but still keep it clear and concise.",
  };

  const simplifyNote = simplify
    ? "The previous explanation was too complex. Please simplify it even further — use shorter sentences, simpler words, and fewer concepts."
    : "";

  return `You are StudyNanbar, a friendly AI study assistant.

Your task: Explain the topic "${topic}" to a student.
Student level: ${level} — ${levelInstructions[level] || "Keep it clear."}
Student mood: ${mood} — ${moodInstructions[mood] || "Keep it friendly."}
${simplifyNote}

Guidelines:
- Keep the response under 150 words.
- Use plain, student-friendly language.
- Structure your answer clearly (short paragraphs or bullet points as appropriate).
- Do NOT include any markdown headers or horizontal rules.
- End with one short encouraging sentence.`;
}

app.post("/api/explain", async (req, res) => {
  const { topic, level, mood } = req.body;

  const missing = ["topic", "level", "mood"].filter((f) => !req.body[f]);
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required field(s): ${missing.join(", ")}.` });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Server configuration error: API key not set." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = buildPrompt(topic, level, mood, false);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ explanation: text });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Failed to generate explanation. Please try again." });
  }
});

app.post("/api/simplify", async (req, res) => {
  const { topic, level, mood } = req.body;

  const missing = ["topic", "level", "mood"].filter((f) => !req.body[f]);
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required field(s): ${missing.join(", ")}.` });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Server configuration error: API key not set." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = buildPrompt(topic, level, mood, true);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ explanation: text });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Failed to simplify explanation. Please try again." });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`StudyNanbar backend running on port ${PORT}`);
});
