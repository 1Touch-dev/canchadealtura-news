# News Portal PT-BR v1

Production golden shell for Brazil CMS website builder. Next.js 15.2.4 + React 18 + Tailwind 3 with `src/app` structure.

## Quick start

```bash
npm install
npm run dev
```

## Layouts

Switch homepage layout via `src/lib/site-config.ts`:

- `broadcast-grid` — dense live news (Proceso Digital default)
- `premium-magazine` — spacious editorial
- `modular-news-portal` — dashboard-style regional portal

Design tokens in `generated/design-tokens.css` are overwritten by the assembler. Change tokens to see all three fixtures diverge visually.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage (layout switch) |
| `/news` | Latest articles |
| `/categories` | Category index |
| `/categoria/[slug]` | Category feed |
| `/artigo/[slug]` | Article detail |
| `/busca?q=` | Search |
| `/about`, `/contact` | Static pages |

## CMS

`src/lib/cms-client.ts` returns dummy PT-BR data. Assembler replaces with live CMS integration.
