# Vizhi TiVi Data repository instructions for coding agents

- This repository publishes **reviewed, legally eligible Live TV data only**.
- No movies/series/VOD, DRM circumvention, geoblock bypass, paid feeds, or
  user-private imported playlists in the official public catalogue.
- Tamil channels occupy numbers 1–250; all others begin at 251.
- IDs and active channel numbers are immutable; reuse a number only after
  explicit permanent retirement; never resurrect a retired ID.
- Keep source review leads in research/; never auto-promote unapproved streams.
- Require explicit legal rights evidence for every published stream. Technical
  reachability or free playback is not evidence of distribution permission.
- Locales are exactly English (en), Tamil (ta), Sanskrit (sa) for initial UI.
- Official catalogue is consumed by Android Mobile, TV, and Angular Web clients.
- Treat GitHub Pages /catalog/v1 as a compatibility contract; use v2 for breaks.
- Publish only if the deterministic public content digest changes; keep all
  historical GitHub Releases; retain short-lived scan artifacts only.
- Weekly scanning is review-only. Daily rights checks enforce manually
  maintained revocations; no automatic legal inference.
- Do not copy any private M3U playlist, credential, signing key, or personal
  Dropbox backup into this public repository.
- Before completion run npm ci && npm run check and report actual results.
