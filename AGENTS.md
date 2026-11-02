# Repository Guidelines

# Project workflow

This project does not use Git Flow.

## Project Structure & Module Organization

NutriOS is a Russian-language nutrition-planning concept landing page built with React 19, Vite, and JavaScript. `src/main.jsx` mounts the application; `src/App.jsx` contains page sections and shared demo state. Keep copy, configuration, and deterministic menu data in `src/data.js`, global styles in `src/style.css`, and reusable UI components in `src/components/ui/`. Static assets belong in `public/`. `SPEC.md` describes product scope; `docs/effects/` contains effect references, not installed framework requirements. `dist/` is generated output.

## Build, Test, and Development Commands

Run commands from the project root:

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server; use its reported URL.
- `npm run lint`: run ESLint, including React Hooks and refresh rules.
- `npm run build`: create the production bundle in `dist/`.
- `npm run preview`: serve the built bundle locally for inspection.

## Local Vite Server Troubleshooting

On 2026-11-02, a sandbox-launched Vite process reported ready and held `127.0.0.1:5174`, but HTTP requests timed out. Restarting the same Vite outside the sandbox on the same port restored HTTP 200 and browser access. The specific underlying sandbox restriction was not identified; do not assume every timeout has this cause.

- Do not treat the ready message or a listening port as proof that the site works. Verify an HTTP response containing the project page and open it in the browser.
- If this symptom recurs, compare a bounded local HTTP request with browser access. A socket access-denied error inside the sandbox is not proof that the server is down; use the supported approval mechanism for the necessary outside-sandbox diagnostic.
- If the server holds the port but does not answer, stop only the task-owned server process. Restart Vite from this project root outside the sandbox through the supported approval mechanism: `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort`. Resolve the Node executable through the environment-tools skill; keep the process in a persistent execution session.
- Recheck HTTP 200, the project page content, and browser access on the reported URL before claiming recovery. Stop any temporary comparison server. Do not change application code, firewall settings, or bind to `0.0.0.0` merely to address this symptom.

## Coding Style & Naming Conventions

Use functional React components, Hooks, ES module imports, two-space indentation, and single-quoted JavaScript strings. Match surrounding semicolon usage; no formatter is configured. Use PascalCase component names, camelCase variables, `use`-prefixed custom Hooks, and descriptive kebab-case CSS classes. Reuse CSS custom properties for colors and typography. Preserve Russian interface copy, accessible labels, keyboard behavior, and reduced-motion support.

## Testing Guidelines

No automated test framework, `npm test` script, or coverage threshold is configured. For code changes, run lint and build, then check the browser console and desktop/mobile layouts. Verify day selection, day/week switching, Monday lunch replacement, reset behavior, FAQ expansion, and mobile navigation, including Escape and focus return. Confirm the hero demo and larger preview stay synchronized. Document manual checks and any unverified behavior.

## Commit & Pull Request Guidelines

This checkout has no Git metadata, so existing commit conventions and branch workflow cannot be verified. Before code or branch changes, establish the workflow with the maintainer. When version control is available, use concise imperative commit subjects describing one focused change. Pull requests should explain the problem and result, link an issue when applicable, list validation performed, and include screenshots for visible changes. Obtain explicit approval before merging or deploying.

## Product Scope & Configuration

Keep demonstrations local and deterministic. Do not introduce AI API calls, simulated signup/payment success, personal-data collection, or medical promises. Change product mode and primary action through `src/data.js` only when the corresponding destination actually works. Never commit secrets, dependencies, or generated bundles.
