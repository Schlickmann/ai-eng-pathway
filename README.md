# AI Engineering Pathway

A single-page, interactive study roadmap for becoming an AI engineer.

This project is a static HTML application that helps you track progress across 6 learning phases:

1. Foundations
2. Classical Machine Learning
3. Deep Learning
4. LLMs & Generative AI
5. AI Engineering & Agents
6. MLOps & Production

Each phase includes:

- Topic checkboxes
- Curated learning resources
- A hands-on project with milestones
- Progress visualization (phase rings, sidebar bars, and overall stats)

Progress is automatically saved in your browser using `localStorage`.

## Tech Stack

- HTML5
- CSS3 (`styles.css`)
- Vanilla JavaScript (`app.js`)
- Google Fonts (`Syne`, `JetBrains Mono`, `Inter`)

No build step, package manager, or backend is required.

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── sections/
│   ├── phase-1.html
│   ├── phase-2.html
│   ├── phase-3.html
│   ├── phase-4.html
│   ├── phase-5.html
│   └── phase-6.html
└── README.md
```

## Getting Started

### Run the refactored app (recommended)

The refactored version (`index.html`) loads section partials via `fetch`, so it needs an HTTP server.

#### Option A: Local static server

From the project directory:

```bash
python3 -m http.server 8000
```

Then open:

`http://localhost:8000/index.html`

#### Option B: Any static hosting (Vercel, Netlify, GitHub Pages, etc.)

Deploy this folder as a static site and use `index.html` as the entry point.

### No local server?

This refactored version uses partial HTML loading with `fetch`, so it must be served over HTTP.
If you want a `file://` workflow, you would need to bundle everything back into a single HTML file.

## How It Works

- **Progress tracking:** Topic and milestone checkboxes update progress in real time.
- **Phase completion:** Each phase shows its own percentage and ring.
- **Global completion:** Header stats show total completed topics and overall completion percentage.
- **Collapsible phases:** Click a phase header to collapse/expand content.
- **Project completion state:** Each phase has a "Mark Built" toggle.
- **Persistence:** All state is stored under `ai_pathway_v1` in `localStorage`.
- **Modular loading:** `app.js` loads phase content from `sections/phase-*.html` at runtime.
- **Reset:** "Reset" clears saved progress after confirmation.

## Deploy to Vercel

This project can be deployed to Vercel as a static site with no build step.

1. Push the project to GitHub (or GitLab/Bitbucket).
2. In Vercel, create a **New Project** and import the repository.
3. Keep defaults:
   - Framework Preset: `Other`
   - Build Command: _(empty)_
   - Output Directory: _(empty)_ or `.`
4. Deploy.
5. Open your Vercel URL (it should serve `index.html` at the root).

Notes:

- Keep the `sections/` folder in the deployed output, since `app.js` fetches `sections/phase-*.html`.
- If needed, set the project root in Vercel to this folder if the repo contains multiple projects.

## Customization

You can customize the roadmap by editing:

- **`sections/phase-*.html`:** Edit topics, resources, and project cards per phase.
- **`app.js`:** Update the `PHASES` array if you add/remove checkbox IDs.
- **Add or remove phases:** Add a new section file, wire sidebar entry in `index.html`, and update `PHASES`.
- **Edit resources/projects:** Replace links, descriptions, milestones, and tags in each phase block.
- **Change colors/theme:** Modify CSS variables in `styles.css` (`:root`).
- **Adjust storage key:** Change `STORAGE_KEY` in the script if you want a new saved-progress namespace.

## Accessibility & UX Notes

- Keyboard support for phase header toggling (`Enter` / `Space`)
- Focus-visible styles for controls and links
- Reduced-motion media query support
- Responsive behavior for tablet/mobile layouts

## Future Improvements

- Export/import progress as JSON
- Add timeline/calendar planning mode
- Add optional dark/light theme toggle
- Add search/filter for topics and resources
- Add tests or a small Playwright smoke test for regression checks

## License

[MIT](LICENSE)
