# Astoya SoulPath

A calm, minimalist astrology and palmistry guidance experience built with React, TypeScript, Vite, and Tailwind CSS. Features Firebase authentication for secure user access.

## Features
- Multi-step flow: landing, categories, birth details, palm upload, results
- Firebase Authentication (Email/Password and Google Sign-In)
- Protected routes requiring authentication
- Prompt builder and OpenAI service integration
- Calm, premium UI with soft cards, gradients, and motion
- Responsive layout for mobile and desktop

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication and activate Email/Password and Google sign-in methods
   - Get your Firebase config from Project Settings > General > Your apps > SDK setup and configuration

3. Create a `.env` file in the root directory with your Firebase and OpenAI credentials:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # OpenAI Configuration
   VITE_OPENAI_API_KEY=your_openai_key_here
   ```
   
   You can use `.env.example` as a reference.

4. Run the dev server:
   ```bash
   npm run dev
   ```

## Authentication
- Users must sign up or log in to access the guidance features
- Supports Email/Password and Google authentication
- Protected routes redirect unauthenticated users to the login page

## Notes
- Palm images are stored only in local state for preview.
- The prompt template lives in `src/utils/promptBuilder.ts` for easy tuning.
- The OpenAI request is centralized in `src/services/openaiService.ts`.
- Firebase configuration is in `src/config/firebase.ts`
- Authentication context is managed in `src/context/AuthContext.tsx`
