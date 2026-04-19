# Trison Pillay — Portfolio

Personal portfolio site — Test Analyst | Web Systems | QA Engineer.
Built with React + Vite. AI chat powered by the Anthropic API.

---

## Quick Start

```bash
npm install
cp .env.example .env   # add your Anthropic API key
npm run dev            # http://localhost:5173
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key (required for AI chat) |

## Build for Production

```bash
npm run build   # output → /dist
```

Deploy the `/dist` folder to Netlify, Vercel, cPanel, or any static host.

### Netlify (recommended)
1. Push to GitHub → connect repo in Netlify
2. Build command: `npm run build`, Publish dir: `dist`
3. Add `VITE_ANTHROPIC_API_KEY` in Site settings → Environment variables

### Vercel
```bash
npx vercel --prod
```
Add the env var in the Vercel dashboard.

## Project Structure

```
trison-portfolio/
├── index.html
├── vite.config.js
├── .env.example
├── src/
│   ├── main.jsx        # entry point
│   ├── index.css       # global reset
│   └── Portfolio.jsx   # main component
└── package.json
```

## Contact

Trison Pillay | trison7@gmail.com | 084 232 8084 | Durban, ZA
