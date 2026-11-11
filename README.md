# Vizhi TiVi Data

**உலகம் உங்கள் விழிகளில்!** · **The world before your eyes.** · **विश्वं तव नयनयोः पुरतः**

Versioned **free/legal Live TV catalogue** for [Vizhi TiVi](https://github.com/actionanand/vizhi-tivi): Android Mobile, Android TV / Google TV, and Angular Web.

> The initial public catalogue is deliberately **empty**. The included Doordarshan
> entries are metadata **research candidates only**, sourced from Prasar Bharati.
> A publicly listed TV channel is not automatically licensed for direct IPTV
> stream redistribution. Stream URLs become playable only after legal and
> technical verification. No invented or unauthorized streams are included.

## Repository layout

```text
vizhi-tivi-data/
├── data/
│   ├── channels.json               # reviewed channels
│   ├── streams.json                # rights-approved streams
│   ├── numbering.json              # stable active IDs and retired numbers
│   └── locales/{en,ta,sa}.json     # localized UI labels
├── research/                       # official source and candidate review, NOT published
├── rights/revocations.json         # copyright/takedown audit ledger
├── assets/logos/                   # licensed artwork only
├── schema/                         # JSON Schema v1 contracts
├── scripts/                        # validation, numbering, build, scan
├── test/                           # automated contract/policy tests
├── docs/                           # client integration and GitHub operations
└── .github/workflows/              # validation, daily publishing, weekly review
```

## Quick start

Use Node.js 24 (see `.nvmrc`). No external npm dependencies are required.

```bash
npm ci
npm run check
npm run scan:weekly       # optional; performs network requests to approved sources
```

`npm run check` validates numbers/rights/locales, runs unit tests, builds
reproducible public JSON, checks the revocation blocklist, and verifies the
published directory. The output is `dist/site/` (Git-ignored).

## Create the GitHub repository

Create an **empty public** repository named `actionanand/vizhi-tivi-data` on
GitHub. Unzip this archive into a folder named `vizhi-tivi-data`, including
hidden `.github/` files. From that folder:

```bash
git init -b master
git add .
git commit -m "chore: initialize Vizhi TiVi data catalogue"
git remote add origin https://github.com/actionanand/vizhi-tivi-data.git
git push -u origin master
```

GitHub Actions will create `gh-pages` from reviewed build output on the first
publish run. In GitHub **Settings → Pages**, select **Deploy from a branch →
gh-pages → /(root)**. The initial empty API deploys without creating a GitHub
Release. Later meaningful catalogue updates get immutable tagged Releases.

Expected Pages URLs:

- `https://actionanand.github.io/vizhi-tivi-data/manifest.json`
- `https://actionanand.github.io/vizhi-tivi-data/catalog/v1/catalogue.json`
- `https://actionanand.github.io/vizhi-tivi-data/catalog/v1/streams.json`

## Editorial and client rules

- Tamil numbers: **1–250**. All other languages start at **251**.
- Preserve existing IDs and assignments. Reuse vacated numbers only on explicit
  permanent removal; never renumber surviving channels.
- Official catalogue and user-imported **Imported TV / My IPTV** must remain
  separate. Users' uploaded M3U playlists remain private, not in this repo.
- Three initial UI locales: `en`, `ta`, `sa`. Channel-language metadata is
  independent of UI language.
- Streams must be HTTPS, have documented permitted usage, and be either
  verified or visibly marked experimental after rights approval.
- Daily publisher checks rights revocations; weekly scan reports are review-only.
- GitHub Releases occur **only on meaningful published catalogue changes**.
- Previous Releases are retained; temporary scan artifacts expire after 7 days.
- GitHub's existing Actions notifications can report success/failure; no
  separate email system is necessary.

See [docs/operations.md](docs/operations.md),
[docs/rights-policy.md](docs/rights-policy.md),
[docs/numbering.md](docs/numbering.md), and
[docs/client-integration.md](docs/client-integration.md).

**Licensing:** This repository's own software scripts use MIT. That does not
license third-party TV programming, logos, channel brands, or stream links.
