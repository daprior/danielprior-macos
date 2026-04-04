# Primary Changes: Constants Refactoring, Code Quality, and State Management

This document summarizes the primary architectural and codebase quality improvements made to ensure a stable, error-free environment.

## 🎯 Motivation
- Enforce strict code quality: Achieve **0 errors / 0 warnings** using `npm run lint`.
- Resolve critical ESLint flags related to React anti-patterns (e.g., synchronous state updates in effects).
- Improve web accessibility (a11y) and Next.js performance optimizations.
- Reduce prop drilling and consolidate shared UI/system state into a single source of truth.
- Persist key UI state (windows, settings, notes, media preferences) across reloads.

## 🛠️ Tooling & Infrastructure
- **Dependencies Added:** `eslint-plugin-prettier`, `eslint-config-prettier`.
- **Purpose:** Enforces Prettier formatting directly through ESLint, preventing style conflicts.
- **Scripts Updated:** - `"lint": "eslint ."` (Uses ESLint directly for Next.js flat-config compatibility).
  - Use `npm run lint -- --fix` for auto-formatting.

## 🏗️ Architectural Refactors (Best Practices Applied)

### 1. React Lifecycle & State Management
- **Eliminated `setState` inside `useEffect`:** Refactored components to use lazy state initialization `useState(() => getInitialValue())` (crucial for safe `localStorage` reads).
- **Derived State:** Replaced unnecessary state variables with memoized values using `useMemo`.
- **Event-Driven Updates:** Moved state updates from effect dependencies to direct user-event handlers.

### 2. React Refs Integrity
- Prevented reading or writing `ref.current` during the render phase to comply with React's pure component rules.

### 3. Accessibility (a11y) & Semantic HTML
- Converted non-interactive elements (like `div` or `span` with `onClick`) into semantic `<button>` elements to ensure keyboard navigation support.

### 4. Next.js Optimizations
- Migrated legacy `<img>` tags to `next/image` (`<Image />`) to leverage automatic image optimization, improving LCP (Largest Contentful Paint).

### 5. TypeScript Strictness
- Prevented TS literal-type inference issues from config constants by explicitly typing state hooks (e.g., `useState<number>(CONFIG.defaultValue)`).
- Fixed variable shadowing (e.g., renaming `window` props to avoid conflicts with the global DOM `window` object).

## 📁 Project Structure & Centralized Constants

Created a centralized **`constants/`** directory to manage app configuration, UI settings, and mock data. This provides a single source of truth across the project.

Key files added:
- `constants/apps-registry.ts`
- `constants/ui-config.ts`
- `constants/window-config.ts`
- `constants/storage-keys.ts`
- `constants/toast-config.ts`
- `constants/music-data.ts`
- `constants/weather-data.ts`

## 🧠 State Management Migration (Zustand)

### Goals
- Centralize shared state (system flow, desktop/windows, settings) and reduce prop drilling.
- Keep app behavior/UX the same while improving maintainability.
- Persist the state that users expect to “survive” a reload.

### Stores Added

#### 1) System state machine
- File: `store/useSystemStore.ts`
- Responsibility: Boot/Login/Desktop/Sleep/Shutdown/Restart flow.
- Notes: Not persisted on purpose (boot/login sequences should start clean on refresh).

#### 2) Settings (persisted)
- File: `store/useSettingsStore.ts`
- Responsibility: `screenBrightness`, `wifiEnabled`, `bluetoothEnabled`, `volume`.
- Persistence: Uses `zustand/middleware` `persist` with `createJSONStorage`.
- Backward compatibility: Continues to read/write legacy `localStorage` keys for brightness and Wi‑Fi.

#### 3) Desktop & Window Manager (persisted)
- File: `store/useDesktopStore.ts`
- Responsibility:
  - `openWindows` (list of open app windows)
  - `activeWindowId`
  - overlay toggles: `showLaunchpad`, `showControlCenter`, `showSpotlight`
  - window geometry setters: `setWindowPosition`, `setWindowSize`
- Persistence: Persists open windows + overlays so the desktop can restore after reload.

#### 4) Notes (persisted)
- File: `store/useNotesStore.ts`
- Responsibility: Notes list + selected note + editing.
- Persistence: Notes content and selection are persisted.

#### 5) Media (persisted preferences)
- File: `store/useMediaStore.ts`
- Responsibility: Music/Spotify player preferences.
- Persistence strategy:
  - Persisted: track index, volume, mute.
  - Not persisted: `isPlaying` (avoids autoplay problems and browser restrictions on refresh).

### SSR-safe Storage
- File: `store/noop-storage.ts`
- Why: Prevents SSR/runtime errors by providing a no-op storage implementation when `window` is unavailable.

### Storage Keys
- File: `constants/storage-keys.ts`
- Added persisted-store keys: `desktopState`, `settingsState`, `notesState`, `mediaState`.

## 🎨 Theme Management (next-themes)

### What Changed
- Theme source-of-truth moved to `next-themes` (class-based, Tailwind compatible).
- File: `app/providers.tsx`
  - Wraps the app in the ThemeProvider.
  - Includes a small migration that maps the legacy `isDarkMode` value into `next-themes` the first time.
- File: `hooks/use-is-dark-mode.ts`
  - Now derives `isDarkMode` directly from `useTheme()` (no mounted state, no effect-driven state updates).

## 🪟 Window Geometry Persistence

### Why
Persisting window position/size improves the “desktop OS” feel and removes duplicated geometry logic.

### Implementation
- File: `components/window.tsx`
- Approach:
  - Base geometry comes from the store (persisted).
  - During drag/resize, a local “draft” position/size is used for smooth interaction.
  - On mouseup, draft geometry is committed to the store (`setWindowPosition`, `setWindowSize`).

## 🔌 App Refactors to Use Stores (Prop Drilling Reduction)

### Core Screens
- File: `app/page.tsx`
  - Reads `systemState` from the system store.
  - Reads brightness from the settings store.
  - Screens no longer require state props.

### Desktop Shell
- File: `components/desktop.tsx`
  - Reads windows/overlays directly from the desktop store.

### Menubar & Control Center
- File: `components/menubar.tsx`
  - Uses the settings store for Wi‑Fi.
  - Uses the system store for sleep/restart/shutdown/logout.
- File: `components/control-center.tsx`
  - Uses the settings store for Wi‑Fi/Bluetooth/Brightness/Volume.
  - Uses `next-themes` to toggle dark/light.

### Safari Wi‑Fi Sync
- File: `components/apps/safari.tsx`
  - Wi‑Fi status is read from the settings store (no localStorage polling).

### Music & Spotify Migration
- Files: `components/apps/music.tsx`, `components/apps/spotify.tsx`
  - Player state moved to `useMediaStore`.
  - Audio playback side-effects remain inside components (keeps store pure and avoids autoplay issues).
- Data moved to constants:
  - File: `constants/music-data.ts` now exports `SPOTIFY_PLAYLIST`.

## ✅ Validation
- `npm run lint` passes with 0 warnings.
- `npm run build` succeeds.

## 🚀 Next Steps
- Optional: migrate any remaining per-app UI state to stores where it provides real value.
- Optional: add lightweight unit tests for store actions (especially desktop/window geometry updates).