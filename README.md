# CFA Level I Curriculum Navigator

This repository curates the 2025 Level I curriculum into a structured, interactive study experience. The original CFA Institute text files (`cfa-program2025L1V*.txt`) are summarized into data sets that power topic-specific modules and cross-topic review utilities.

## Getting Started

> **Note:** Direct package installation from the public npm registry may be restricted in some environments. If `npm install` fails, configure your npm proxy/registry settings or install the listed dependencies manually.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the development server:
   ```bash
   npm run dev
   ```
   Vite serves the curriculum navigator at the printed local URL. The app dynamically loads topic data and interactive modules.
3. Build a production bundle:
   ```bash
   npm run build
   ```
   Compiled assets are written to `web/dist/`.
4. Preview the production bundle locally:
   ```bash
   npm run preview
   ```

## Navigating the Curriculum

The web experience mirrors the Level I topic weights. Use the left navigation rail to switch between modules:

- **Ethical and Professional Standards**
- **Quantitative Methods**
- **Economics**
- **Financial Statement Analysis**
- **Corporate Issuers**
- **Equity Investments**
- **Fixed Income**
- **Derivatives**
- **Alternative Investments**
- **Portfolio Management and Wealth Planning**
- **Cross-Topic Review** (mixed quizzes, global formula sheet, and spaced-repetition queue)

Each topic view includes:

- Learning objective summaries sourced from the corresponding CFA volume.
- Curated formula decks with usage context.
- Exam strategy notes.
- Interactive flashcards, calculators, and timelines tailored to the topic.

## Cross-Topic Features

The **Cross-Topic Review** area consolidates resources to reinforce retention across study sessions:

- **Mixed Quiz:** Pulls flashcards from every topic and presents randomized multiple-choice prompts.
- **Global Formula Sheet:** Aggregates every formula in one searchable view for cram sessions.
- **Spaced-Repetition Queue:** Tracks flashcard review intervals in local storage and promotes cards that are due for review.

## Source Data

The original CFA Program text files remain in the repository root. Each `web/src/data/*.ts` module documents the source volume used for its summaries, enabling transparent traceability back to the official materials.
