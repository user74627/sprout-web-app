# Sprout Mobile App Architecture

The mobile app should use Expo React Native first. That gives fast iteration, iOS/Android support, and a clean path to EAS builds.

## Goals

- Same gameplay rules as web.
- Same Firebase backend as production web.
- Separate demo storage using AsyncStorage.
- Native notifications for due tasks and pet reminders.

## Proposed Structure

```text
apps/mobile/
  app.json
  package.json
  src/
    App.jsx
    navigation/
      RootNavigator.jsx
    screens/
      HomeScreen.jsx
      TasksScreen.jsx
      ShopScreen.jsx
      ProgressScreen.jsx
      SettingsScreen.jsx
    services/
      asyncStorageDemoService.js
      firebaseMobileService.js
    components/
      PetView.jsx
      TaskCard.jsx
      ShopItemCard.jsx
```

## Navigation

Use React Navigation:

- Bottom tabs: Home, Tasks, Shop, Progress.
- Settings/Profile accessible from Progress.
- Auth stack shown only in production mode when signed out.

## Storage

Demo mode:

- AsyncStorage key: `sprout-mobile-demo-v1`.
- Same state shape as web demo.
- Same reward functions from shared core.

Production mode:

- Firebase Auth for account state.
- Firestore listeners for tasks, pet, shop/inventory.
- Callable functions for completion and purchases.

## Notifications

Start local:

- Schedule daily reminder if no task has been completed.
- Schedule due-task reminders.

Then production:

- Store FCM token under `users/{uid}/devices/{deviceId}`.
- Cloud Functions schedule reminders for server-tracked tasks.

## Build Path

1. `npx create-expo-app apps/mobile`
2. Install React Navigation, Firebase, AsyncStorage, Expo Notifications.
3. Copy/adapt core rules.
4. Build internal preview with EAS.
5. Add push notifications.
6. Submit to App Store / Play Store only after Firebase backend is stable.

