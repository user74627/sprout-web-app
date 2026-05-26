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

This repo is configured with GitHub Pages via a workflow in `.github/workflows/deploy.yml`.
The app is built for GitHub Pages using a `BASE_URL` during the build.

