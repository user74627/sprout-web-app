# Sprout (Working Title)

Sprout is a productivity app where a digital pet grows healthier as you complete tasks. Earn coins, spend them in the shop, and watch your pet move through 4 moods: thriving, content, droopy, sad.

## Local setup

1. Create a Firebase project.
2. Enable **Authentication (Email/Password)** and **Firestore**.
3. Copy `.env.example` to `.env` and fill in the Firebase values.
4. Run:

```bash
npm install
npm run dev
```

## Deploy

Live site: https://user74627.github.io/sprout-web-app/

This repo deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`.

For Firebase login to work in production, add these **Repository secrets** (Settings → Secrets and variables → Actions), matching `.env.example`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

In Firebase Console, add `user74627.github.io` to **Authorized domains** (Authentication → Settings).

