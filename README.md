# Sprout

A productivity app where a digital pet grows healthier as you complete tasks. Earn coins, spend them in the shop, and watch your pet move through 4 moods: thriving, content, droopy, sad.

## Quick start (Demo)

The public site works without any setup. Open: https://user74627.github.io/sprout-web-app/

- Click **Start Demo** to jump in
- Data saves in your browser's `localStorage`
- No account required, no Firebase credentials

## Local development (Production mode)

```bash
# 1. Create a Firebase project
# 2. Enable Authentication (Email/Password) and Cloud Firestore
# 3. Copy .env.example to .env and fill in values

npm install
npm run dev
```

## Environment variables

```bash
# .env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Mobile app (Expo)

```bash
cd apps/mobile
npm install
npx expo start
```

- Uses NativoWind for styling (Tailwind-like)
- Demo mode stores data in AsyncStorage
- Shared core logic from `src/core`

## Firebase backend setup

The backend requires these Firebase products enabled:

- Authentication (Email/Password)
- Cloud Firestore (in `src/core` folder, rules in `firebase/firestore.rules`)
- Cloud Functions (for reward-safe task completion and purchases)

### Deploy Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

### Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
fb deploy --only firestore:indexes
```

## Project structure

```
sprout-web-app/
src/
  core/              # Shared game logic (rewards, pet state, tasks)
  hooks/             # React hooks (useAuth, usePet, useTasks, useShop)
  pages/             # Screens (Home, Tasks, Shop, Settings)
  components/        # UI kit, Pet, Navbar
functions/           # Cloud Functions (completeTask, purchaseItem, applyPetDecay)
firebase/            # Firestore rules, indexes, shop seeds
apps/mobile/         # Expo React Native app
```

## Secrets for production Pages deploy

In GitHub → Settings → Secrets and variables → Actions, add:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## License

MIT