// server.js
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/generateCourse", async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI course assistant who creates online course structures." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: "Invalid response from OpenAI API" });
    }

    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: "Failed to generate course." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
