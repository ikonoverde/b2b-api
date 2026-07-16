---
name: verify
description: Build/launch/drive recipe for verifying frontend and admin changes in this Laravel + Inertia + React app at runtime.
---

# Verifying changes at runtime

## Servers
- Laravel serves at `APP_URL` from `.env` (usually `http://localhost:8000`); it is typically already running.
- Vite dev server: if `public/hot` exists, confirm it is alive with `curl $(cat public/hot)/@vite/client` (200 = live, serves source directly — no rebuild needed). If dead or absent, run `npm run build` first.

## Driving the GUI
- Pest browser testing is NOT installed; Chrome extension may not be connected. Use Playwright directly — it is a project dependency with browsers cached in `~/.cache/ms-playwright`.
- Write a `.mjs` script in the scratchpad and import with the absolute path (ESM resolves from the script's location, not cwd):
  `import { chromium } from '/home/eric/projects/b2b/pro.ikonoverde.com/node_modules/playwright/index.mjs';`

## Admin login gotchas
- Admin routes return **404 for guests** (admin is hidden), so `goto /admin/dashboard` unauthenticated shows the `Error` page — go to `/admin/login` first.
- Credentials: `LOCAL_USER` / `LOCAL_PASS` from `.env`. If login says "The provided credentials are incorrect", the DB hash has drifted from `.env` — realign with tinker:
  `$u = App\Models\User::where('email', env('LOCAL_USER'))->first(); $u->password = Hash::make(env('LOCAL_PASS')); $u->save();`
- After submitting login, wait for a URL matching `/admin` but not `login` (the login page itself is under `/admin`), then wait for a page selector. Inertia navigations are XHR + pushState — `waitForLoadState('networkidle')` resolves too early; wait on `waitForURL` for the target path instead.

## Useful selectors
- shadcn admin sidebar: `[data-slot="sidebar"]`, nav links `[data-sidebar="menu-button"]`, active link `[data-sidebar="menu-button"][data-active="true"]`, badge `[data-sidebar="menu-badge"]`, mobile trigger `[data-sidebar="trigger"]`.
- Ctrl+B toggles sidebar collapse; mobile (<768px) renders the sidebar in a Sheet.
