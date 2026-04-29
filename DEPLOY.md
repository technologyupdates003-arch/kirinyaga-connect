# Deploying KHCWW to DirectAdmin

This site is a static SPA. You build it locally, then upload the static files to your DirectAdmin `public_html` directory.

## 1. Edit content (optional)

All site content lives in **`src/content/site.json`**:
- Organisation contact details
- Stats shown on the homepage
- Events list (Events page + homepage updates)
- Team / office bearers (Team page)
- Gallery URL (link to your Pixieset gallery)

Edit that file with any text editor, then rebuild.

## 2. Build

Install dependencies once:

```bash
bun install
# or: npm install
```

Build the site:

```bash
bun run build
# or: npm run build
```

This creates a `dist/` folder. The static files you need are in **`dist/client/`** (the `dist/server/` folder can be ignored — DirectAdmin doesn't run Node).

## 3. Upload to DirectAdmin

1. Log into DirectAdmin.
2. Open **File Manager** and navigate to `public_html` (or your subdomain folder).
3. Delete any old files inside.
4. Upload **the contents of `dist/client/`** (not the folder itself) into `public_html/`.
   - `index.html`
   - `assets/` folder
   - `favicon.png`
   - `.htaccess`  ← important! enables clean URLs like `/about`, `/events`
5. Make sure `.htaccess` is visible (some File Managers hide dotfiles — toggle "show hidden files").

## 4. Done

Visit your domain — every page (`/`, `/about`, `/events`, `/team`, `/gallery`, `/contact`, `/membership`) should load and refresh correctly.

## Updating later

Re-edit `src/content/site.json` → run `bun run build` → re-upload `dist/client/` contents.
