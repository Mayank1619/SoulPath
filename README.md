# Astroya SoulPath

A calm, minimalist astrology and palmistry guidance experience built with React, TypeScript, Vite, and Tailwind CSS. Features Firebase authentication for secure user access.

## Features
- Multi-step flow: landing, categories, birth details, palm upload, results
- Firebase Authentication (Email/Password and Google Sign-In)
- Protected routes requiring authentication
- Prompt builder and OpenAI service integration
- Calm, premium UI with soft cards, gradients, and motion
- Responsive layout for mobile and desktop
- **Native iOS and Android apps** with Capacitor

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

## Mobile Development (iOS & Android)

This app is configured with **Capacitor** to build native iOS and Android apps from the same codebase.

### Quick Commands

```bash
# Sync web app to native platforms
npm run cap:sync

# Open in Android Studio
npm run cap:open:android

# Open in Xcode (macOS only)
npm run cap:open:ios

# Run on Android device/emulator
npm run cap:run:android

# Run on iOS device/simulator (macOS only)
npm run cap:run:ios
```

### iOS Development (macOS Required)

**Prerequisites:**
- macOS with Xcode 14+ installed
- CocoaPods: `sudo gem install cocoapods`

**Steps:**
1. Build and sync: `npm run cap:sync`
2. Navigate to iOS folder: `cd ios/App`
3. Install pods: `pod install`
4. Open in Xcode: `npm run cap:open:ios`
5. Select a simulator/device and click Run

**Note:** iOS development requires a Mac. On Windows, the ios folder is created but cannot be built.

### Android Development

**Prerequisites:**
- Android Studio installed
- Android SDK 26+ (configured in Android Studio)
- Java Development Kit (JDK) 17+

**Steps:**
1. Build and sync: `npm run cap:sync`
2. Open in Android Studio: `npm run cap:open:android`
3. Wait for Gradle sync to complete
4. Select a device/emulator and click Run

### Making Changes

After updating your React code:

```bash
# Rebuild and sync to native platforms
npm run cap:sync
```

This command:
1. Builds your web app (`npm run build`)
2. Copies the build to iOS and Android
3. Updates native dependencies

### Firebase Configuration for Mobile

When deploying to mobile, update your Firebase console:

1. **iOS:** Add your iOS bundle ID (`com.astroya.soulpath`) in Firebase Console > Project Settings > Add App > iOS
2. **Android:** Add your Android package name (`com.astroya.soulpath`) in Firebase Console > Project Settings > Add App > Android
3. Download and add platform-specific config files:
   - iOS: `GoogleService-Info.plist` → `ios/App/App/`
   - Android: `google-services.json` → `android/app/`

### App Store Deployment

**iOS (TestFlight/App Store):**
1. Configure signing in Xcode (requires Apple Developer account - $99/year)
2. Archive the app: Product > Archive
3. Upload to App Store Connect
4. Submit for review

**Android (Google Play):**
1. Generate a signing key: [Android docs](https://developer.android.com/studio/publish/app-signing)
2. Build release APK/AAB in Android Studio
3. Upload to Google Play Console
4. Submit for review (one-time $25 registration fee)

### Recommended: Automated Deployments

For seamless updates without app store reviews:

- **Capgo** (OTA updates): Live updates like Vercel for mobile
- **GitHub Actions**: Automate builds on every push
- **Fastlane**: Automate app store submissions

## Notes
- Palm images are stored only in local state for preview.
- The prompt template lives in `src/utils/promptBuilder.ts` for easy tuning.
- The OpenAI request is centralized in `src/services/openaiService.ts`.
- Firebase configuration is in `src/config/firebase.ts`
- Authentication context is managed in `src/context/AuthContext.tsx`
