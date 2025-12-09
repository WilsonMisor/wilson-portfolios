# Data Engineering Portfolio

Static, multi-page portfolio for Wilson Udomisor showcasing data engineering case studies. Built with plain HTML, CSS, and JavaScript; project data is driven from `data/projects.json`.

## Run locally
1. Open a terminal in the de/ directory.
2. Start a simple server so `fetch` can read JSON:
   - PowerShell: `python -m http.server 8000`
   - Command Prompt: `python -m http.server 8000`
3. Visit `http://localhost:8000/index.html`.

You can also open `index.html` directly, but browsers may block JSON fetches; use the local server for full functionality.

## Dynamic editing on GitHub Pages
- This site is static; no server uploads. All edits are client-side and stored in `localStorage`.
- Toggle Edit Mode via the footer `Edit` button (label switches to `Done`) or `Ctrl + Shift + E`.
- In Edit Mode you can:
  - Replace images via file picker or URL (saved locally as data URLs or paths).
  - Edit links (GitHub, Drive, Canva, resume, WhatsApp, Email, LinkedIn).
  - Edit short text snippets where outlined.
- Admin page: open `admin.html` to edit config (links, text, image paths) and project overrides. Export/Import buttons let you move overrides as JSON between browsers.
- Display priority: localStorage overrides → `data/site-config.json` defaults → hardcoded text.
- To publish permanent changes: place files in `assets/img/user/` and `assets/docs/`, update `data/site-config.json` and/or `data/projects.json`, then commit and push.

## Permanent assets
- Place images in `assets/img/user/` (headshot, hero photos, project shots, diagrams).
- Place documents in `assets/docs/` (resume, case studies). Default resume path: `assets/docs/resume.pdf`.
- Optional link placeholders can live in `assets/links/` if needed.

## Update projects
Edit `data/projects.json`. Each object follows the schema provided in the file, including:
- `id` (used for the single page slug `project-<id>.html`)
- metadata: `title`, `tagline`, `problem`, `impact`, `category`, `roleType`, `roleDetail`, `timeline`, `tools`
- links: `github`, `drive`, `canva`
- booleans: `featured` to control home-page highlights
- arrays: `whatIBuilt`, `challenges`, `outcomeDetails`, `artifacts`

Saving the JSON updates Home and Projects automatically via JavaScript.

## Add a new single project page
1. Copy `project-template.html` to `project-<id>.html` (match `<id>` to the JSON entry).
2. Update:
   - `data-project-id` attributes
   - title, problem, impact, tools, timeline text
   - links (GitHub, Drive, Canva)
   - artifacts (image `src` or link URLs)
3. Optional: replace placeholders with real screenshots or diagrams in `assets/img/`.
4. Ensure the new page is linked in `data/projects.json` with the same `id`.

## Notes
- Styling lives in `assets/css/style.css`; scripts in `assets/js/main.js`.
- All navigation links are relative and work when served locally.
