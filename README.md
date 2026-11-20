# Portfolio

This project was generated with Vite

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:5173/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

To add

## Build

To add

## Design system — Liquid Glass

The shared design system lives in `src/index.css`. It is dark-first, with a
light-theme token override on `body.light-theme`, and exposes:

- **Material tokens** — `--glass-bg`, `--glass-border`, `--glass-blur`,
  `--glass-shadow`, `--glass-inner` and the liquid spectrum accents.
- **Surfaces** — `.glass-panel` (translucent, blurred, specular edge),
  `.glass-nav`, `.glass-chip`, `.glass-input`.
- **Actions** — `.btn-primary` (gradient glass with a moving sheen),
  `.btn-secondary`, `.icon-button`.
- **Ambient layers** — `.app-shell` and `.liquid-canvas` / `.liquid-blob`
  render the drifting color refractions behind the content.

Use `.glass-interactive` on cards that should lift and catch more light on
hover. Motion and transparency fall back gracefully for
`prefers-reduced-motion`, `prefers-reduced-transparency`, and browsers without
`backdrop-filter`.

## Running unit tests

To add
