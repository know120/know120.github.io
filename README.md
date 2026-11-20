# Portfolio

This project was generated with Vite

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:5173/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

To add

## Build

To add

## Design system — Aurora Studio

The shared design system lives in `src/index.css`. It is a dark-first editorial
system: an ink canvas with a fine grid, acid-lime signal accents, crisp panels
with a corner mark, mono micro-labels, and elevated keycap buttons. A paper/ink
light-theme token override is available on `body.light-theme`.

- **Tokens** — `--bg-*`, `--text-*`, `--accent-*` (lime / violet / teal),
  `--glass-*` surface aliases, and `--keycap-shadow`.
- **Palette remap** — `@theme` redefines Tailwind's `slate`, `indigo`, `violet`,
  and `cyan` scales, so standalone tool screens inherit the new look even when
  they use raw utility classes.
- **Surfaces** — `.glass-panel` (sharp panel with a lime corner mark),
  `.glass-nav`, `.glass-chip`, `.glass-input`.
- **Type** — `.eyebrow`, `.section-index`, `.section-title`, `.editorial-rule`,
  and `.heading-gradient`; `SectionHeading` composes them into section headers.
- **Actions** — `.btn-primary`, `.btn-secondary`, `.icon-button`. Buttons use a
  static `-3px` lift and the same keycap shadow in every state — no hover or
  press movement.
- **Ambient layers** — `.app-shell` and `.liquid-canvas` / `.liquid-blob` render
  soft color fields behind the content.

Use `.glass-interactive` on cards that should lift on hover. Motion falls back
gracefully for `prefers-reduced-motion` and `prefers-reduced-transparency`.

## Running unit tests

To add
