import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.A4F_API_KEY,
  baseURL: process.env.A4F_BASE_URL || "https://api.a4f.co/v1",
});

// Basic in-memory rate limiter (resets with each function reload)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 requests/minute per IP
const requestLog = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  // --- RATE LIMITING ---
  const now = Date.now();
  const userRequests = requestLog.get(ip) || [];
  const recentRequests = userRequests.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please wait a minute." });
  }
  recentRequests.push(now);
  requestLog.set(ip, recentRequests);

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    // --- NON-STREAMING COMPLETION ---
    const completion = await client.chat.completions.create({
      model: process.env.A4F_MODEL || "provider-1/chatgpt-4o-latest",
      messages,
      stream: false, // 🚫 removed streaming
    });

    const fullReply = completion.choices?.[0]?.message?.content || "No response.";

    // --- DISCORD LOGGING ---
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (webhook && fullReply.trim()) {
      const userMsg = messages[messages.length - 1].content;
      const embeds = [];

      const MAX_LENGTH = 1900;
      const timestamp = new Date().toISOString();

      if (fullReply.length <= MAX_LENGTH) {
        // Single embed
        embeds.push({
          title: "🤖 AI Response",
          description: fullReply,
          color: 0x5865f2,
          footer: {
            text: `🕒 ${new Date().toLocaleString()}`
          },
          timestamp,
        });
      } else {
        // Split into multiple embeds (safe)
        for (let i = 0; i < fullReply.length; i += MAX_LENGTH) {
          embeds.push({
            title: i === 0 ? "🤖 AI Response" : "Continued...",
            description: fullReply.slice(i, i + MAX_LENGTH),
            color: 0x5865f2,
            footer: {
              text: `🕒 ${new Date().toLocaleString()}`
            },
            timestamp,
          });
        }
      }

      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "💬 New Chat Session",
                color: 0x00b0f4,
                fields: [
                  { name: "🧍User", value: userMsg.slice(0, 1000) },
                  { name: "🤖 AI", value: "Response below 👇" },
                ],
                footer: {
                  text: `🕒 ${new Date().toLocaleString()}`
                },
                timestamp,
              },
              ...embeds,
            ],
          }),
        });
      } catch (e) {
        console.error("Discord webhook failed:", e.message);
      }
    }

    // ✅ Return clean JSON response
    return res.status(200).json({ reply: fullReply });
  } catch (err) {
    console.error("AI error:", err.message);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "AI service error",
        details: err.message || "Unknown error occurred.",
      });
    }
  }
}
