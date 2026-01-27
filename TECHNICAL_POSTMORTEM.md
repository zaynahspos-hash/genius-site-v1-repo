# 🛠️ Technical Incident Report: The "White Screen of Death"

## 1. What was the Issue?
The application refused to load, displaying a blank white screen immediately upon opening.
**Symptoms:**
- The browser console showed errors like `Uncaught TypeError: Failed to resolve module specifier "express"` or `Module "fs" not found`.
- The React application (`<div id="root">`) was never populated.

## 2. Where did it come from? (The Root Cause)
The issue was located in **`index.html`**, specifically within a `<script type="importmap">` block.

**The Malicious Code:**
```html
<script type="importmap">
{
  "imports": {
    "express": "https://esm.sh/express@...",
    "mongoose": "https://esm.sh/mongoose@...",
    "fs": "https://esm.sh/fs@...",
    ...
  }
}
```

### Why is this a problem?
1.  **Server vs. Client:** Libraries like `express` (web server framework), `mongoose` (database ORM), and `fs` (File System access) are built for **Node.js**. They require operating system-level access that web browsers **security block**.
2.  **Browser Execution:** When the browser reads `index.html`, it tries to prepare these libraries. As soon as it encounters a requirement for a Node.js API (like `require('fs')` or `process`), it throws a fatal error and aborts all script execution.

## 3. Where did it originate?
This usually happens due to one of three reasons:
1.  **AI/LLM Hallucination:** Sometimes AI generators try to "fix" missing dependencies by adding an import map for *everything* in `package.json`, failing to distinguish between frontend (React) and backend (Express) dependencies.
2.  **Copy-Paste Error:** Copying backend configuration code into a frontend HTML file.
3.  **Misunderstanding of ESM:** Assuming that because a CDN (like esm.sh) serves a package, it must be browser-compatible. While esm.sh transpiles code, it cannot polyfill OS-level features like the file system.

## 4. How was it fixed?
**Action:** We deleted the entire `<script type="importmap">...</script>` block from `index.html`.

**Why this works:**
- We are using **Vite** as our build tool.
- Vite automatically bundles the correct frontend code (React, Lucide, etc.) from `package.json` into a format the browser understands.
- By removing the import map, we stopped the browser from trying to load the incompatible backend libraries.

## 5. How to prevent this next time? (Best Practices)

### A. Separation of Concerns
- **Backend Code:** Keep all server code (Express, Mongoose, Models) in the `backend/` folder.
- **Frontend Code:** Keep all React code in components or `src/`.
- **Never Import Backend in Frontend:** Never write `import User from '../backend/models/User'` inside a React component (`.tsx`). The frontend should only communicate with the backend via HTTP requests (fetch/axios).

### B. Dependency Management
- In `package.json`, typically you separate dependencies. However, in a simple mono-repo like this, they are mixed.
- **Rule of Thumb:** If a library deals with databases (MongoDB, SQL), Files (fs, path), or Server Ports, it **cannot** go into `index.html` or React components.

### C. Build Tools
- Trust **Vite**. You rarely need to manually add `<script>` tags for libraries in `index.html`. If you install it via `npm install`, import it in your `.tsx` file, and Vite will handle the rest.

## 6. Where else can this happen?
This error is common in:
1.  **Next.js / SSR Apps:** Importing server modules (like database connections) into "Client Components" (`"use client"`).
2.  **Webpack Configurations:** configuring "externals" incorrectly.
3.  **CDN Usage:** Manually adding script tags for libraries that don't have UMD/Browser builds.

---
**Status:** ✅ Fixed
**Severity:** Critical (Prevented App Launch)
**Resolution:** Removed server-side references from client-side entry point.
