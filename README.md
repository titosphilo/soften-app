# Soften — Relationship Coaching App

Soften is an AI-powered relationship coaching tool, guided by **Philo** — a warm, wise AI coach grounded in Jungian psychology and Emotionally Focused Therapy (EFT).

## Features

- **Solo Sessions** — Private one-on-one conversations with Philo for individual reflection
- **Couples Sessions (The Temenos)** — A shared sacred space where two partners work together, with Philo as guardian
- **Message Screening** — AI-powered safety screening in couples mode detects contempt, abuse, and threats
- **Crisis Support** — Automatic helpline display when conversations escalate to dangerous levels

## Setup

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env and add your Anthropic API key

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key (required). Get one at [console.anthropic.com](https://console.anthropic.com/) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |

## Architecture

```
src/
  App.jsx                  # Screen state machine (landing -> home -> solo/couples)
  main.jsx                 # React entry point
  index.css                # Global styles and design tokens
  lib/
    api.js                 # Anthropic API client (sendMessage, screenMessage)
    philo.js               # System prompts for Philo (solo + couples)
  components/
    Landing.jsx            # Terms acceptance screen
    Home.jsx               # Session type selector
    SoloChat.jsx           # Solo conversation interface
    CouplesSetup.jsx       # Partner name entry
    TemenosInvitation.jsx  # Couples invitation ritual
    TemenosThreshold.jsx   # "Both present" arrival gate
    TemenosSession.jsx     # Couples conversation with screening
    Mandala.jsx            # SVG mandala decoration
```

## Safety & Screening

In couples mode, every message is screened before delivery:
- **Level 0** — Safe (delivered normally)
- **Level 1** — Harsh (gentle pause, option to send anyway)
- **Level 2** — Contempt (interception, rewrite suggested)
- **Level 3** — Abuse (session paused)
- **Level 4** — Threats (session stopped, helplines shown)

If screening fails (network error, API issue), messages are **not delivered** — the system fails closed for safety.

## Deployment

An nginx configuration is provided at `soften-nginx.conf` with HTTPS, security headers, and gzip. Update the domain name and SSL certificate paths for your environment.

## Important Disclaimers

- Soften is **not** a substitute for professional therapy or crisis support
- The AI screening system may produce false positives or false negatives
- If you are in danger, contact emergency services (999) immediately
