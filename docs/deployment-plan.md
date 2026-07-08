# Deployment Plan

Sprout should have separate deployment tracks so the demo remains easy to share while production can use Firebase safely.

## Track 1: Public Demo Web

Host:
- GitHub Pages

Mode:
- `VITE_DEMO_MODE=true`
- No Firebase secrets
- Browser localStorage only

Purpose:
- Show friends and early testers.
- No account setup.
- No backend costs.

Workflow:
- `.github/workflows/deploy.yml`
- Runs on push to `main`.
- Builds Vite and uploads `dist`.

## Track 2: Production Web

Recommended host:
- Firebase Hosting if Firebase is the main backend.
- Vercel is also fine, but Firebase Hosting keeps auth/backend in one project.

Mode:
- `VITE_DEMO_MODE=false`
- Firebase environment variables present.
- Callable functions for rewards/purchases.

Deployment steps:

```bash
npm run build
firebase deploy --only hosting
```

## Track 3: Firebase Backend

Deploy independently from the demo:

```bash
npm run firebase:deploy:rules
npm run firebase:deploy:functions
```

Before production:
- Create `.firebaserc` from `.firebaserc.example`.
- Seed `shopItems`.
- Run emulator tests.

## Track 4: Mobile App

Use Expo EAS:

```bash
cd apps/mobile
npx eas init
npx eas build --profile preview --platform ios
npx eas build --profile preview --platform android
```

Release tracks:
- Preview builds for friends/TestFlight/internal testing.
- Production builds after Firebase backend and notifications are stable.

## Environment Matrix

| Target | Demo Mode | Backend | Storage |
| --- | --- | --- | --- |
| GitHub Pages demo | true | none | localStorage |
| Local Firebase web | false | Firebase emulators or real project | Firestore |
| Production web | false | Firebase | Firestore |
| Mobile demo | true | none | AsyncStorage |
| Mobile production | false | Firebase | Firestore |

