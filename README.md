# BNAK public site — Hugo + Tailwind CSS v4

The public-facing BNAK site is rendered with Hugo templates and content. The Replit React application remains reference-only; no React or Vite runtime is used by this site.

## Requirements and commands

Use Hugo **Extended v0.124 or newer** and Node.js. In this directory:

```powershell
npm install
npm run start
```

For a production build:

```powershell
npm run build
```

The Tailwind CLI processes `assets/css/main.css` into a generated stylesheet before Hugo starts; the development command watches for CSS changes. Production builds minify and fingerprint the stylesheet. `npm install` installs only `tailwindcss` and `@tailwindcss/cli`.

## Editing

- `content/_index.md`: homepage section copy and hero images.
- `content/*.md`: public informational page titles and descriptions.
- `data/*.yaml`: navigation, contacts, membership categories, sectors, projects, quote attribution, and repeated lists.
- `layouts/index.html`: homepage section composition.
- `layouts/partials/sections/`: independently maintained page sections.
- `layouts/partials/components/`: repeated cards and headings.
- `layouts/partials/image.html`: responsive WebP image processing, dimensions, and alt-text validation.
- `assets/css/main.css`: Tailwind v4 theme tokens and site styling.
- `assets/js/site.js`: mobile navigation, scroll header, hero rotation, marquee accessibility via CSS, and touch-friendly ribbon scrolling.
- `config.toml`: existing `baseURL`, site metadata, CTA, Tailwind build stats, and template cache busting.

The homepage includes the hero and stats, brand marquee, business sectors, informational pathways, membership categories, investment information, Kenyan voices, verified project descriptions and farming imagery, partner information, contact details, and invitation. About, Programs, and Membership are static informational pages. Payments, registration/KYC, account areas, forms, APIs, and admin tools are not part of the published layouts.

The Replit export in `../new/` is read-only reference material.
