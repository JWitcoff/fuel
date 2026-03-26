# Fuel

A mobile-first nutrition tracker with AI-powered food identification. Built with Next.js, Upstash Redis, and Vercel.

## Features

- **Macro tracking** with visual ring charts (calories, protein, fat, carbs)
- **AI food identification** from photos (Gemini 2.5 Flash)
- **AI macro estimation** from text descriptions (Claude)
- **Meal presets** for quick logging of repeated meals
- **Custom meals** with manual or AI-estimated macros
- **Weight tracking** with 7-day rolling average
- **14-day protein heatmap**
- **Configurable targets** via settings page (no code changes needed)
- **REST API** for integration with chatbots, shortcuts, or other tools
- **Mobile-optimized** dark UI designed for iPhone

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/JWitcoff/fuel.git
cd fuel
npm install
```

### 2. Set up services

You'll need accounts (all have free tiers) for:

| Service | Purpose | Sign up |
|---------|---------|---------|
| [Vercel](https://vercel.com) | Hosting & deployment | vercel.com |
| [Upstash](https://upstash.com) | Redis database (KV storage) | upstash.com |
| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | Image storage | Via Vercel dashboard |
| [Google AI Studio](https://aistudio.google.com) | Gemini API (photo identification) | aistudio.google.com |
| [Anthropic](https://console.anthropic.com) | Claude API (text macro estimation) | console.anthropic.com |

### 3. Configure environment variables

Create a `.env.local` file or set these in your Vercel project settings:

```env
# Upstash Redis (from Upstash dashboard)
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your-upstash-token

# Vercel Blob (from Vercel dashboard > Storage)
BLOB_READ_WRITE_TOKEN=your-blob-token

# AI APIs
GEMINI_API_KEY=your-gemini-key
ANTHROPIC_API_KEY=your-anthropic-key

# API auth token (generate any random string, e.g.: openssl rand -hex 16)
FUEL_API_TOKEN=your-secret-token
```

### 4. Deploy

```bash
# Link to Vercel
vercel link

# Deploy to production
vercel --prod
```

### 5. Set your macro targets

Open your deployed app and tap the gear icon (top right) to go to Settings. Enter your daily targets:

- **Calories**: Your daily calorie goal
- **Protein/Fat/Carbs**: Your daily macro goals in grams

Not sure what to set? Multiply your target body weight (lbs) by 10-12 for a cut, 14-16 for maintenance. Set protein to ~1g per lb of target body weight.

## Customizing Presets

Meal presets are defined in `lib/constants.ts`. Edit the `PRESETS` array to add your own frequent meals:

```typescript
{ id: "my-meal", name: "My Meal", emoji: "🍽️", cal: 500, protein: 30, fat: 15, carbs: 45, desc: "Description" }
```

## API Reference

All POST/DELETE endpoints require an `Authorization: Bearer <FUEL_API_TOKEN>` header. GET endpoints for the dashboard (meals, settings) don't require auth.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | Today's meals, totals, remaining, weight |
| `GET` | `/api/meals?date=YYYY-MM-DD` | Meals for a specific date |
| `GET` | `/api/settings` | Current macro targets |
| `PUT` | `/api/settings` | Update macro targets |
| `POST` | `/api/log` | Log a meal |
| `DELETE` | `/api/log` | Delete a meal |
| `POST` | `/api/weight` | Log weight |
| `POST` | `/api/upload` | Upload a meal photo |
| `POST` | `/api/analyze` | AI identify food from photo URL |
| `POST` | `/api/estimate` | AI estimate macros from text |

### Log a meal

```bash
curl -X POST https://your-app.vercel.app/api/log \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Chicken bowl", "cal": 520, "protein": 40, "fat": 14, "carbs": 48, "date": "2026-03-26"}'
```

### Log a preset

```bash
curl -X POST https://your-app.vercel.app/api/log \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preset_id": "protein-shake", "date": "2026-03-26"}'
```

### AI estimate macros from text

```bash
curl -X POST https://your-app.vercel.app/api/estimate \
  -H "Content-Type: application/json" \
  -d '{"description": "chipotle chicken burrito bowl with rice and beans"}'
```

## Chatbot Integration

Fuel is designed to be controlled via text message through an AI assistant (e.g. OpenClaw, custom GPT, etc.). See `OPENCLAW_FUEL_SKILL.md` for a complete skill file that teaches an AI agent how to:

- Parse casual meal descriptions and log them
- Handle photo uploads with AI identification
- Check daily status and suggest meals
- Log weight entries

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Upstash Redis
- **Storage**: Vercel Blob
- **AI**: Google Gemini 2.5 Flash (vision), Anthropic Claude (text)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
