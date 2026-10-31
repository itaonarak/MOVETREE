# MOVETREE — Frontend (Android)

React Native app built with **Expo** + **Expo Router** + **NativeWind** (Tailwind CSS for React Native).

## Run it on your computer

### 1. Install the tools (one time)

- **Node.js LTS** (v20 or newer) — https://nodejs.org
- **Git** — https://git-scm.com
- **VS Code** (recommended) — https://code.visualstudio.com
- On your Android phone: **Expo Go** from the Play Store (latest version)

Check they work (restart your terminal after installing):

```
node -v
npm -v
git --version
```

### 2. Get the code

```
git clone https://github.com/itaonarak/MOVETREE.git
cd MOVETREE/frontend
```

All commands below are run **inside the `frontend` folder**.

### 3. Install dependencies

```
npm install
```

This creates `node_modules/` (it is not in Git, so everyone has to run this once — and again whenever `package.json` changes after a `git pull`).

### 4. Start the app

```
npx expo start
```

Then pick one way to view it:

**Option A — your Android phone (recommended)**
1. Open **Expo Go** and scan the QR code shown in the terminal.
2. Phone and computer must be on the **same Wi-Fi**.
   If it can't connect (e.g. university Wi-Fi blocks it), stop the server and run `npx expo start --tunnel` instead.
3. Every time you save a file, the phone updates instantly.

**Option B — in the browser (quick preview)**
1. Run `npx expo start --web` (or press `w` in the Expo terminal).
2. Open http://localhost:8081. The app is limited to phone width, so it looks like a phone screen.
   In VS Code you can use `Ctrl+Shift+P` → **Simple Browser: Show** → `http://localhost:8081`.

**Option C — Android emulator**
1. Install **Android Studio**, open **Device Manager** and create a virtual device (e.g. Pixel / Medium Phone).
2. Start the emulator, then run `npx expo start --android` (or press `a` in the Expo terminal).

VS Code shortcuts for all of these are in **Terminal → Run Task…** (defined in `.vscode/tasks.json`).
The emulator tasks expect an AVD named `medium_phone` — rename yours or edit the task if it differs.

## Recommended VS Code extensions

Open the `frontend` folder in VS Code and click **Install** when it suggests the recommended extensions (listed in `.vscode/extensions.json`):

- **Expo Tools** — Expo config autocomplete & debugging
- **Tailwind CSS IntelliSense** — class name autocomplete + color previews
- **React Native Tools** — run/debug from VS Code
- **Android iOS Emulator** — start an Android emulator from VS Code
- **Prettier** — auto-format + sorts Tailwind classes

## Screens

| # | Screen        | File                         | Route            |
|---|---------------|------------------------------|------------------|
| 1 | Login         | `src/app/index.jsx`          | `/`              |
| 2 | Create account| `src/app/register.jsx`       | `/register`      |
| 3 | Assistance    | `src/app/assistance.jsx`     | `/assistance`    |
| 4 | Feed          | `src/app/feed.jsx`           | `/feed`          |
| 5 | Notifications | `src/app/notifications.jsx`  | `/notifications` |

Flow: Login → Feed (any username + password works for now). Login → "สร้างบัญชีผู้ใช้" → Create account → Feed.
Feed → bell icon → Notifications. The log-out icon on Notifications returns to Login.

## Project structure

```
frontend/
├── src/
│   ├── app/          # one file = one screen (Expo Router)
│   └── components/   # shared UI (AuthLayout, Screen, TextField, Button, PostCard, BottomNav, Logo)
├── assets/           # images, icons, app icon
├── plugins/          # custom Expo config plugins
├── app.json          # Expo app config (name, icons, Android package)
└── tailwind.config.js  # colors / fonts — change here to re-theme the whole app
```

Import from `src` with the `@/` alias, e.g. `import { Button } from "@/components/Button";`.

## Useful commands

```
npx expo start          # dev server (QR code for Expo Go)
npx expo start --web    # browser preview
npx expo start --tunnel # use when the phone can't reach your computer
npx expo start -c       # clear cache (use after editing tailwind.config.js / babel / metro)
npx expo install <pkg>  # add a package (picks the version that matches Expo)
```

## Troubleshooting

- **Styles/colors not updating** → `npx expo start -c`
- **"Project is incompatible with this version of Expo Go"** → update Expo Go from the Play Store.
- **Weird errors after `git pull`** → run `npm install` again, then `npx expo start -c`.
- **Port 8081 already in use** → close the other Expo terminal, or accept the offer to use another port.

## Next steps

- Hook `handleLogin` / `handleCreate` (marked `TODO`) up to the backend in `../backend`.
- Replace the sample data in `feed.jsx` / `notifications.jsx` with real API data.
- Add a new page: create `src/app/<name>.jsx`, add it to the `Stack` in `src/app/_layout.jsx`, and link to it with `router.push("/<name>")`.
