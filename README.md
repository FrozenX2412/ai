# ChatGPT Clone — Next.js + Tailwind (Ready for Vercel)

## Features
- Responsive UI (desktop + mobile)
- Dark / Light mode toggle (persists in localStorage)
- Search messages in chat
- User messages on right, AI messages on left
- Copy option on assistant responses
- Rich text + code block rendering using react-markdown + rehype-highlight
- Optional Discord webhook logging for Q&A
- Uses external AI provider via OpenAI-compatible SDK (set A4F env vars)

## Env required (Vercel):
- A4F_API_KEY  -> your provider key
- A4F_BASE_URL -> e.g. https://api.a4f.co/v1
- A4F_MODEL -> optional model id
- DISCORD_WEBHOOK_URL -> optional webhook for logs

## Install:
- npm install
- npm run dev

## Deploy:
- Push to GitHub and connect to Vercel. Add env vars in Vercel dashboard. Deploy.

## Notes:
- The frontend uses react-markdown + rehype-highlight to render rich responses and code blocks.
- Copy buttons present on assistant responses (click top-right on bubble).
- Mobile + desktop responsiveness via Tailwind.
- Theme toggle persists in localStorage.
