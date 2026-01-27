
# 🐛 Debugging Report: White Screen of Death (WSOD)

## 1. The Issue (Symptom)
**Observation:**
When launching the application via `npm run dev` or opening the preview, the browser displayed a completely blank white screen.

**Console Errors (Likely):**
- `Uncaught TypeError: Failed to resolve module specifier "express"`
- `Uncaught Error: Module name "mongoose" has not been loaded yet for context`
- `Uncaught Error: Hooks can only be called inside of the body of a function component` (Duplicate React issue)

---

## 2. The Location (Where)
The issue was primarily located in **`index.html`**, with contributing configuration errors in **`vite.config.ts`**.

---

## 3. Root Cause Analysis (Why & How)

### A. Backend Libraries in Browser Context (Critical)
The `index.html` file contained an `<script type="importmap">` block that looked like this:

```json
{
  "imports": {
    "express": "https://esm.sh/express@^5.2.1",
    "mongoose": "https://esm.sh/mongoose@^9.1.5",
    "fs": "https://esm.sh/fs@^0.0.1-security",
    ...
  }
}
```

**Why this caused a crash:**
1.  **Node.js vs. Browser:** Libraries like `express`, `mongoose`, and `fs` (File System) are designed strictly for **Node.js** (Server-side). They rely on low-level system APIs that browsers do not have for security reasons.
2.  **Execution Failure:** When the browser tried to parse these scripts, it immediately failed because it cannot execute Node.js code. This stopped the entire React application from mounting.

### B. Dependency Conflict (Duplicate React)
The `importmap` also included `react` and `react-dom` from a CDN, while `package.json` installed `react` locally via Vite.

**Why this caused a crash:**
Vite bundled one version of React, and the HTML loaded another from the CDN. Having **two instances of React** active at the same time breaks the "Hooks" system, causing the app to crash silently or with obscure errors.

### C. Incorrect Path Aliases
In `vite.config.ts`, the configuration was:
`alias: { '@': path.resolve(__dirname, './src') }`

**The Problem:** Your project structure is **flat** (files are in the root), but the config was looking for a `src/` folder that didn't exist. This caused imports like `import App from '@/App'` to fail.

---

## 4. The Fix (Resolution)

### Step 1: Cleaned `index.html`
We removed the `importmap` entirely.
*   **Result:** The browser no longer tries to load Backend libraries or duplicate React versions. It now relies solely on the bundle created by Vite.

### Step 2: Corrected `vite.config.ts`
We updated the alias to point to the root directory:
```typescript
alias: {
  '@': path.resolve(__dirname, './'), // Changed from './src' to './'
},
```
*   **Result:** Imports using `@` now correctly find files in the root directory.

### Step 3: Updated `services/authService.ts`
We removed code that might have accidentally tried to import backend logic and replaced it with standard HTTP `fetch` calls.
*   **Result:** The frontend acts purely as a client, asking the backend for data via API, rather than trying to run database code directly.

---

## 5. Summary
The "White Screen" was caused by **mixing Server-Side (Node.js) code into the Client-Side (Browser) environment** via the HTML file. By cleaning the HTML and letting the build tool (Vite) handle dependencies, the environment is now stable.
