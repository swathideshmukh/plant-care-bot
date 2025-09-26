const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.AI_API_KEY;

const SYSTEM_PROMPT = "You are a gardening expert. Only answer plant care questions. If asked about anything else, respond with 'Information not available.'";

router.post("/", async (req, res) => {
  try {
    const userInput = req.body.message;

    const payload = {
      model: "llama3.2-vision:latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      temperature: 0.7
    };

    const response = await axios.post("https://chat.ivislabs.in/api/chat/completions", payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const content = response.data.choices?.[0]?.message?.content || "No response";
    const cleanContent = content.replace(/<.*?>/g, "").trim();

    res.json({ reply: cleanContent });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "AI API failed" });
  }
});

module.exports = router;
