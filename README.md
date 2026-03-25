# Bennie's Currency Tracker

A React + Vite currency tracker for a customizable list of players.

## Features

- Add, edit, and remove players
- New players start with `10` currency
- Whole-number currency values only
- Positive values in green, zero in gray, negative values in red
- Dark mode enabled by default with a toggle
- Local persistence with `localStorage`
- Import/export support for `data.json`

## Development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
pnpm preview
```

`pnpm build` outputs the static site to `dist/`.
`pnpm preview` serves that build locally over HTTP.

## GitHub Pages deployment

This repository includes `.github/workflows/deploy-pages.yml`.

On every push to `main`, GitHub Actions will:

1. install dependencies
2. build the site
3. upload `dist/`
4. deploy it to GitHub Pages

In the repository settings, ensure **Pages** is configured to use **GitHub Actions** as the source.
