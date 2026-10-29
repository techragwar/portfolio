# MDX articles (draft integration)

The Next.js app is in `contentful-portfolio/`. This feature introduces:

- `/articles`: searchable cards for **published** articles only.
- `/articles/[slug]`: server-rendered MDX article pages.
- `content/articles/*.mdx`: local editorial content with YAML metadata.
- An unpublished draft of **AI Can Write the Code. But Can It Cook?**

## Publishing rule

New articles default to `draft: true`. Only `draft: false` entries appear in search, static article paths, or page rendering. Editorial approval remains a manual decision.

## Local setup

From `contentful-portfolio/` run:

```sh
npm install
npm run lint
npm run build
```

**Integration blocker:** `package-lock.json` is not yet regenerated with the new `gray-matter`, `next-mdx-remote`, and `remark-gfm` dependencies. Regenerate and commit it using `npm install` **before merging**, particularly when using `npm ci` in CI or deployment. Build and lint checks have not been verified yet.

When publication is approved, edit the article metadata to `draft: false` and supply its correct publication date. Until then the article remains excluded from the public site.

The feature is independent of the existing Contentful client; there is no database or hosted search provider.
