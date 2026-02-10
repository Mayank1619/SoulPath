# SoulPath

A calm, minimalist astrology and palmistry guidance experience built with React, TypeScript, Vite, and Tailwind CSS.

## Features
- Multi-step flow: landing, categories, birth details, palm upload, results
- Prompt builder and OpenAI service integration
- Calm, premium UI with soft cards, gradients, and motion
- Responsive layout for mobile and desktop

## Setup
1. Install dependencies:
   npm install
2. Add your OpenAI API key in an `.env` file:
   VITE_OPENAI_API_KEY=your_key_here
3. Run the dev server:
   npm run dev

## Notes
- Palm images are stored only in local state for preview.
- The prompt template lives in `src/utils/promptBuilder.ts` for easy tuning.
- The OpenAI request is centralized in `src/services/openaiService.ts`.
