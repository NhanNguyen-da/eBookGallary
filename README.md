## Project Overview

"The Digital Library" — a premium eBook gallery built as a standalone Angular 21 application using zoneless change detection. It displays books organized by category with 3D card interactions, dark/light theming, and multiple layout modes.

## Commands

- `npm run dev` — Start dev server on port 3000 (`ng serve`)
- `npm run build` — Production build to `./dist/`
- `npm run preview` — Serve production build locally

No test runner or linter is configured.

## Architecture

**Bootstrap:** `index.tsx` bootstraps `AppComponent` with `provideZonelessChangeDetection()` (no Zone.js). The app uses Angular signals throughout instead of zone-based change detection.

**Key files:**
- `src/app.component.ts` — Root component containing the full page layout (hero, category sections, search overlay, side menu, book detail modal) as an inline template. Also defines `CarouselDirective` for auto-scrolling carousel sections.
- `src/components/book-card/book-card.component.ts` + `.html` — Reusable book card with 3D tilt on mouse move and auto-cycling through 6 visual states (cover, angled, spine, back, two interior pages) on hover.
- `src/services/book.service.ts` — Singleton service holding all book/category data as signals. Defines `Book` and `Category` interfaces. All data is hardcoded (no API calls).

**Patterns:**
- All components are `standalone: true`
- State management uses Angular signals (`signal`, `computed`, `effect`) — no RxJS for component state
- Styling uses Tailwind CSS via CDN (`index.html` script tag) with dark mode via `class` strategy on `<html>`
- Category layouts are determined by `Category.layout`: `'spotlight'`, `'grid'`, or `'carousel'`
- Path alias `@/*` maps to project root in `tsconfig.json`

## Tech Stack

- Angular 21 (zoneless, standalone components, signals)
- Tailwind CSS (CDN)
- TypeScript 5.8
- Vite-backed Angular build (`@angular/build:application`)