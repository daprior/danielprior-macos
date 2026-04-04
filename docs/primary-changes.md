# Primary Changes: Constants Refactoring, Linting & Code Quality

This document summarizes the primary architectural and codebase quality improvements made to ensure a stable, error-free environment.

## 🎯 Motivation
- Enforce strict code quality: Achieve **0 errors / 0 warnings** using `npm run lint`.
- Resolve critical ESLint flags related to React anti-patterns (e.g., synchronous state updates in effects).
- Improve web accessibility (a11y) and Next.js performance optimizations.

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

## 🚀 Next Steps
- Implement centralized state management (Zustand) for the Window Manager engine to handle complex interactions efficiently.