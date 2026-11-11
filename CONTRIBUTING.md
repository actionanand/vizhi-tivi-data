# Contributing reviewed Live TV channels

Before adding a stream, record the official broadcaster/source site and review
the legal right to link/embed the feed inside Vizhi TiVi. Keep private
IPTV imports, credentials, personal data, and unreviewed third-party playlist
URLs out of this public repository.

1. Add reviewed metadata to `data/channels.json`.
2. Add a rights-approved HTTPS stream with evidence to `data/streams.json`.
3. Run `npm run numbers:assign` for new numbers, preserving existing ledger IDs.
4. Run `npm run check`, update appropriate tests, and inspect public output.
5. Open a PR to `master` with evidence, technical verification, and provenance.
6. Merging a reviewed PR to `master` triggers publication only if the public
   digest changes; no release is published for scripts/research-only changes.
7. Retain removal notices and rights revocations, never silently drop history.

Naming a broadcaster is not proof that its streams may be distributed.
