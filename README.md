# BNak — Hugo + Tailwind CSS

The BNak MSME Platform design and public content have been migrated into native Hugo pages. No React or Vite runtime is required.

## Run

Install Hugo (0.124.1 or newer) and Node.js, then run:

```sh
npm ci
npm start
```

Open http://localhost:1313. Production: `npm run build`; output: `public/`.
Tailwind compiles before Hugo so Hugo can fingerprint the stylesheet. The development watcher updates the same asset.
Set `baseURL` in `config.toml` to the deployment URL before publishing, or pass Hugo's `--baseURL` option.

## Editing

- `content/`: page titles and routes.
- `layouts/partials/pages/`: migrated page content and Tailwind layouts.
- `data/bnak.json`: carousel stories and membership packages.
- `layouts/partials/journey/`: membership and support form layouts.
- `assets/js/site.js`: native browser interactions.
- `assets/css/main.css`: source typography, colors and custom styles.
- `static/images/`: all ten source photographs.

All eight active source tabs are separate Hugo routes. The original FIQA content and templates are preserved in `archive/fiqa/`, outside Hugo's published content. The source BNak project is untouched.

## Service connections

The source project has no membership registration, M-Pesa or donation processing backend. The migrated forms keep entries only in page memory and explicitly report that nothing was submitted or charged. Connect a secure backend before enabling real registrations or payments. Do not place payment credentials in browser code.

The source's illustrative testimonial labels are preserved. Event dates and partner claims are copied from the source and should be confirmed by the content owner before publication.
