# Beyond10

> Beyond MPC and BiPC. Discover what India and the world actually offer after Class 10.

Beyond10 is a free, mobile-first career discovery platform for Class IX–X students in India. Built with Astro for zero-JS-by-default performance, deployable to any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages).

## Stack

- **Framework:** [Astro](https://astro.build) — ships near-zero JavaScript, content-collection oriented
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) — JIT, no config bloat
- **Data:** Static JSON in `src/data/` — every entry carries a `source` field
- **Hosting:** Static output, deploys anywhere

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # preview the production build
```

## Project structure

```
beyond10/
├── src/
│   ├── data/           # source-of-truth JSON (careers, exams, scholarships, ...)
│   ├── layouts/        # base HTML shell
│   ├── components/     # reusable Astro components
│   ├── pages/          # routes
│   └── styles/         # global CSS
├── public/             # static assets (favicon, manifest, icons)
└── astro.config.mjs
```

## Data sources

Every fact in `src/data/` has a `source` field pointing to the authoritative origin:

- **Exams:** NTA, CLAT Consortium, ICAI, ICSI, NID, NIFT, UPSC, AP SCHE
- **Salaries:** India Skills Report 2026, Naukri, LinkedIn India, Levels.fyi, AmbitionBox
- **Colleges:** NIRF 2025 (`nirfindia.org`)
- **Scholarships:** Jnanabhumi AP, scholarships.gov.in (NSP), Buddy4Study, AICTE
- **Employability:** India Skills Report 2026 (Wheebox + CII)

## Deploy

The build emits a static site. Drop `./dist` on:

- **Cloudflare Pages** — `npm run build`, output `dist/`
- **Vercel / Netlify** — auto-detected
- **GitHub Pages** — push `dist/` to `gh-pages`

## License

Content compiled for educational use. See `src/data/*.json` for per-entry sources.
