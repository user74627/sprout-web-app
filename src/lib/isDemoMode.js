/**
 * Demo mode: no Firebase. All data in localStorage (per browser / per device).
 * GitHub Pages builds set VITE_DEMO_MODE=true so the public link is always demo-only.
 */
export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === 'true' ||
  (!import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_DEMO_MODE !== 'false')
