# WhiteRock AssetFlow

Enterprise Asset & Resource Management application with a React + Vite frontend and an Express + JSON database backend.

## 🚀 Getting Started

You can manage, install dependencies for, and run both the frontend and backend applications directly from the root directory.

### 1. Install All Dependencies
To install the node modules for the root directory, frontend, and backend all in one command, run:
```bash
npm run install:all
```

### 2. Start both Frontend and Backend
To start both servers concurrently with a single command, run:
```bash
npm run dev
# or
npm start
```

This will spin up:
- **Backend API Server**: running on [http://localhost:5000](http://localhost:5000)
- **Frontend Vite Client**: running on [http://localhost:5173](http://localhost:5173)

The terminal output will be clean, color-coded, and prefixed with `[backend]` and `[frontend]`.

---

## 🎨 Tailwind CSS Integration

Tailwind CSS (v3) is configured inside the `frontend` workspace. You can write any standard Tailwind utility classes directly in your JSX files.

### Configuration Highlights:
1. **Configured Files**:
   - Configuration is defined in `frontend/tailwind.config.js` and `frontend/postcss.config.js`.
   - Content paths include `index.html` and any files in `src/**/*.{js,ts,jsx,tsx}`.

2. **Unified Theme Variables**:
   - Tailwind's configuration has been extended to map directly to the CSS custom variables defined in `frontend/src/index.css` (e.g. `--bg-primary`, `--accent-primary`).
   - This lets you use standard Tailwind utility classes that dynamically match your defined theme, such as:
     - `bg-bgPrimary` (corresponds to `--bg-primary`)
     - `text-textSecondary` (corresponds to `--text-secondary`)
     - `text-accentPrimary` (corresponds to `--accent-primary`)
     - `border-borderColor` (corresponds to `--border-color`)
     - `font-sans` (corresponds to `--font-sans`)

3. **Standard CSS Ordering**:
   - The `@import` statement for Google Fonts (`Outfit`) is placed at the absolute top of `frontend/src/index.css` before any `@tailwind` directives. This ensures strict CSS standards compliance and avoids parsing/loading warnings during compilation.

---

## 📂 Project Structure

```text
├── backend/            # Express.js API Server
│   ├── server.js       # Main server file & routes (Port 5000)
│   ├── db.json         # Local JSON Database
│   └── package.json    # Backend configuration
├── frontend/           # React + Vite client-side app
│   ├── src/
│   │   ├── main.jsx    # Client entry point
│   │   ├── App.jsx     # Main React Application
│   │   └── index.css   # Main stylesheet (includes Tailwind directives)
│   ├── index.html      # Vite entry HTML template
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json    # Frontend configuration
├── package.json        # Root workspace configuration
└── README.md           # Getting started guide
```
