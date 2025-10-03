import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.A4F_API_KEY,
  baseURL: process.env.A4F_BASE_URL || 'https://api.a4f.co/v1'
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' })
  try {
    const { messages } = req.body
    if (!messages) return res.status(400).json({ error: 'messages required' })

    const completion = await client.chat.completions.create({
      model: process.env.A4F_MODEL || 'provider-1/chatgpt-4o-latest',
      messages
    })

    const reply = completion.choices?.[0]?.message?.content || ''

    // Optionally log to Discord webhook (if set)
    const webhook = process.env.DISCORD_WEBHOOK_URL
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `📩 **User:** ${messages[messages.length-1].content}\n🤖 **AI:** ${reply}` })
        })
      } catch (e) {
        console.error('discord webhook failed', e.message)
      }
    }

    res.status(200).json({ reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || String(err) })
  }
}
