# Testing and CI Plan

## Current Checks Added

- `npm test` runs Vitest tests for shared core game rules.
- `npm run build` verifies the Vite demo build.
- `.github/workflows/ci.yml` runs tests and build on pushes/PRs.
- Function syntax is checked with `node --check`.

## Core Rule Tests

Covered in `src/core/__tests__/core.test.js`:

- Task reward lookup.
- Pet health state and decay.
- XP/level calculation.
- Task completion reward application.
- Duplicate task completion behavior.
- Shop purchase and equip toggles.

## Next Tests

- Component tests for Home dashboard, task filters, and shop categories.
- Emulator tests for Firestore security rules.
- Function transaction tests for `completeTask` and `purchaseItem`.
- E2E smoke tests for the GitHub Pages demo.

## CI Expansion

When Firebase is active:

- Add `firebase emulators:exec` rule tests.
- Add deployment gates so production Firebase deploys only happen from tagged releases.
- Add mobile CI for Expo lint/typecheck/build preview.

