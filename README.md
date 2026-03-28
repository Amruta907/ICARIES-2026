# ICARIES 2026 Website

This project is the React + Vite version of the ICARIES 2026 conference website.

## Requirements

Make sure these are installed before running the project:

- Node.js 18 or later
- npm

To verify:

```powershell
node -v
npm -v
```

## Project Setup

Open the project folder in a terminal:

```powershell
cd "c:\Users\amruta.DESKTOP-PO9S97D\OneDrive\Desktop\ICARIES-2026"
```

Install dependencies:

```powershell
npm.cmd install
```

Note:

- On some Windows systems, `npm install` may fail in PowerShell because script execution is restricted.
- If that happens, use `npm.cmd install` instead of `npm install`.

## Run the Development Server

Start the app:

```powershell
npm.cmd run dev
```

Vite will print a local URL in the terminal, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

## Build for Production

Create the production build:

```powershell
npm.cmd run build
```

The generated files will be placed in the `dist/` folder.

## Preview the Production Build

To preview the built site locally:

```powershell
npm.cmd run preview
```

## Main Project Structure

- `src/` React app source code
- `css/style.css` site styling
- `data/` JSON content files
- `assets/` images and static assets
- `index.html` Vite entry HTML
- `dist/` generated production build

## Common Issues

### 1. `npm` is blocked in PowerShell

Use:

```powershell
npm.cmd install
npm.cmd run dev
```

instead of:

```powershell
npm install
npm run dev
```

### 2. Port `5173` is already in use

Vite will usually offer another port automatically. Use the URL shown in the terminal.

### 3. `node_modules` is missing

Run:

```powershell
npm.cmd install
```

### 4. Changes are not showing

Try:

- Save the file
- Refresh the browser
- Restart the dev server

## Recommended Commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
```

## Notes for Contributors

- This project uses React with Vite.
- Content data is stored in JSON files inside `data/`.
- Styling is currently kept in `css/style.css`.
- If you pull new changes from Git, run `npm.cmd install` again if `package.json` or `package-lock.json` changed.
