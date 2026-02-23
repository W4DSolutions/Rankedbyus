# 🚀 RankedByUs Spec Kit & Standard Operating Procedure

## 🚨 MANDATORY VERIFICATION PROCESS 🚨

**To ensure Vercel deployments NEVER fail, any AI agent or developer MUST run the following exact process after adding or modifying any code in the project:**

### Step 1: Lint the Codebase
```bash
npm run lint
```
**Goal:** Guarantee there are no syntax errors, `setState` inside `useEffect` problems, missing dependencies, or unused imports/variables. Do **not** proceed if errors exist. Fix them first.

### Step 2: Build the Production Application
```bash
npm run build
```
**Goal:** Next.js uses Turbopack to pre-compile 84+ static pages. If you introduced a hydration mismatch (e.g., using `Math.random()` on the server or `new Date()` without `useEffect`), or a TypeScript typing error (`any` where an interface was expected), the build will fail. Ensure it prints `✓ Compiled successfully`.

### Step 3: Stage, Commit, and Push
```bash
git add .
git commit -m "feat/fix/chore: [detailed description]"
git push origin main
```
**Goal:** Since Vercel is hooked up to the repository at `W4DSolutions/Rankedbyus`, pushing to the `main` branch automatically triggers a zero-downtime deployment. Because you completed Step 1 and Step 2, the live website will successfully compile.

---

## 🎨 Design System & Code Rules
- **Aesthetic:** We rely entirely on a premium, glassmorphism-heavy design (`bg-white/90 backdrop-blur-xl dark:bg-slate-950/90`).
- **Icons:** We only use `lucide-react`. Do not try to import other icon libraries.
- **Components:** Server Components by default. Include `'use client';` strictly at the very top of the file when interactivity (`useState`, `useEffect`, `localStorage`, `onClick`) is necessary.
- **State Management:** When dealing with cookies or `localStorage`, handle hydration carefully. Ensure initial state matches the server (`null` or empty string) until `useEffect` runs on the client. Alternately use `useSyncExternalStore`.
