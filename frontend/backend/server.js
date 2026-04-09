import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/explain", async (req, res) => {
  const { topic, level, mood, simplify, example, mode } = req.body;

  try {
    let prompt = `
Explain "${topic}" for a ${level} student who feels ${mood}.

Rules:
- Keep it short and clear
- Use simple language
- Use 1 real-world example
- Avoid complex jargon
- If mood is "tired", keep it VERY concise
- If mood is "confused", break it step-by-step
- If mood is "curious", add a deeper insight

End with:
"Quick recap:" in one sentence.
`;

    if (mode === "eli5") {
      prompt = `
Explain "${topic}" like I am 5 years old.
Use very simple words, analogies, and fun examples.
Keep it extremely easy to understand.
`;
    } else if (simplify) {
      prompt = `
Explain "${topic}" in an even simpler way.
Use very basic language and short sentences.
`;
    }

    if (example) {
      prompt = `
Explain "${topic}" using a real-life example.
Keep it simple and relatable.
`;
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({
      output: response.data.choices[0].message.content,
    });

  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
