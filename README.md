# CFA Study Companion Workspace

This repository pairs the 2025 CFA Level I curriculum outlines with an interactive single-page application that keeps each topic organised. The new `web/` workspace contains a Vite + React scaffold with TypeScript support and a dedicated Derivatives mastery lab that reuses the interactive widgets from the original HTML prototype.

## Directory Highlights

- `web/` – source for the study companion SPA, including build tooling and modularised topic content.
  - `src/App.tsx` – top-level tab navigation for all 10 CFA Level I topic areas plus progress and diagnostics views.
  - `modules/derivatives.tsx` – React implementation of the Derivatives Mastery Lab, featuring calculators, payoff visualiser, flashcards, and quiz.
- `cfa-program2025L1V*.txt` – reference text exports for each curriculum volume.
- `derivatives_module.html` – archived standalone prototype retained for historical context.

## Getting Started

```bash
cd web
npm install
npm run dev
```

The development server (powered by Vite) provides hot module replacement and can be reached at the URL printed in the terminal, typically `http://localhost:5173`.

## Production Build & Local Preview

Generate an optimised production bundle in `web/dist/`:

```bash
cd web
npm run build
```

To serve the built assets locally, either use Vite’s preview command or any static file server:

```bash
cd web
npm run preview  # serves dist/ over http://localhost:4173 by default
```

Alternatively, you can run a static server such as `npx http-server dist` from the `web/` directory.

## Next Steps

- Extend each topic tab with focused study planners, diagnostic charts, or reading trackers.
- Integrate spaced repetition data to populate the progress and diagnostics views with live metrics.
- Layer in authentication and persistence if you plan to track user-specific study analytics.
