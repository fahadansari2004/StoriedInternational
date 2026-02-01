# Hostinger Upload Guide – Storied International

Upload the following files and folders to your Hostinger **public_html** (or your domain’s web root).

## Folder structure to upload

```
public_html/
├── index.html          ← Main site (homepage)
├── admin.html          ← Admin panel (content & gallery)
├── thank-you.html      ← Thank-you page after contact form
├── css/
│   └── style.css
├── js/
│   ├── admin.js
│   ├── chatbot.js
│   ├── content.js
│   ├── gallery.js
│   ├── reviews.js
│   ├── script.js
│   └── security.js
└── img/
    ├── logo.png        ← Storied International logo (required)
    └── storied.jpeg    ← Optional / gallery
```

## What to upload

| Item        | Upload? | Notes                                      |
|------------|--------|---------------------------------------------|
| index.html | Yes    | Main page                                  |
| admin.html | Yes    | Admin login & content management           |
| thank-you.html | Yes | Shown after contact form submit        |
| css/       | Yes    | All files inside                           |
| js/        | Yes    | All 7 files listed above                   |
| img/       | Yes    | Must include **logo.png** (main logo)       |

## What to skip (do not upload)

- `.vscode/` – editor config
- `node_modules/` – if present
- `package.json`, `start-server.bat` – local dev only
- `README.md`, `SETUP-EMAIL.md`, `HOSTINGER-UPLOAD.md` – optional (docs only)
- `mcps/`, `agent-transcripts/`, `assets/` – Cursor/local only

## Steps in Hostinger

1. Log in to **hPanel** → **File Manager**.
2. Go to **public_html** (or your domain’s root).
3. Upload the **contents** of this project:
   - Drag and drop the listed folders (`css`, `js`, `img`) and files (`index.html`, `admin.html`, `thank-you.html`) into `public_html`.
4. Confirm **img/logo.png** is present (main logo).
5. Open `https://yourdomain.com` – you should see Storied International with the logo and white navbar.

## Paths

All links use **relative paths** (e.g. `css/style.css`, `img/logo.png`), so the site will work in `public_html` without changes.

## After upload

- Set admin password in **Admin** panel (first time you open `admin.html` and log in).
- Update contact form: in `index.html` edit the form `action` and `_next` URL if you use FormSubmit or another service.
- Optional: add `.htaccess` in `public_html` for redirects or HTTPS; the site works without it.
