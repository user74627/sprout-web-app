/** Demo mode: no Firebase; data lives in localStorage (great for showcases). */
export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === 'true' ||
  !import.meta.env.VITE_FIREBASE_API_KEY
