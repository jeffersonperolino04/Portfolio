# Jefferson Perolino — Portfolio

A professional single-page portfolio website for Jefferson Perolino, a Virtual Assistant specializing in financial management and professional writing.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string (API server only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, framer-motion, lucide-react
- Forms: react-hook-form + zod
- API: Express 5 (backend, currently unused by portfolio)
- DB: PostgreSQL + Drizzle ORM (unused by portfolio)

## Where things live

- `artifacts/portfolio/src/pages/Home.tsx` — entire portfolio page
- `artifacts/portfolio/src/index.css` — theme palette (HSL CSS vars)
- `artifacts/portfolio/src/App.tsx` — wouter router
- `lib/api-spec/openapi.yaml` — OpenAPI contract (health check only)

## Architecture decisions

- Portfolio is purely frontend (no backend) — all sections are static React components
- Contact form simulates submission with setTimeout + toast (no backend integration)
- Profile photo uses a styled "JP" initials avatar (no image file needed)
- Framer-motion handles scroll-triggered fade-in animations
- IntersectionObserver drives active nav link highlighting as user scrolls

## Product

Single-page portfolio with: Hero (typewriter effect, availability badge), About, Services (4 offerings), Skills & Tools (chip tags), Work Samples (4 cards), Testimonials (3 reviews), and a Contact form with validation.

## User preferences

- Wants a professional, non-generic look
- No formal design background — trusts the agent's design judgment
- Photo not yet added (using JP initials avatar as placeholder)

## Gotchas

- Google Fonts @import must be the VERY FIRST line of index.css (before @import "tailwindcss")
- All CSS vars in index.css must be set to real HSL values — never leave `red` placeholders

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `react-vite` skill for frontend build conventions
