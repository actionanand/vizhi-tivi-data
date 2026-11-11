# Client API v1 (Android, Android TV, Angular)

**Production URL after GitHub Pages is enabled:**

```text
https://actionanand.github.io/vizhi-tivi-data/manifest.json
https://actionanand.github.io/vizhi-tivi-data/catalog/v1/catalogue.json
https://actionanand.github.io/vizhi-tivi-data/catalog/v1/streams.json
https://actionanand.github.io/vizhi-tivi-data/catalog/v1/locales/en.json
https://actionanand.github.io/vizhi-tivi-data/catalog/v1/locales/ta.json
https://actionanand.github.io/vizhi-tivi-data/catalog/v1/locales/sa.json
```

Check manifest `schemaVersion == 1` before consuming the catalogue. Keep the
last-known-good cache if the download fails, the schema is incompatible, or
validation fails. Do not infer validity from HTTP 200 alone. The manifest
`contentSha256` is calculated deterministically over the catalogue, stream,
and locale JSON structures; it is a release change identifier, not an
individual file checksum. Prefer conditional refresh using digest equality.

Join `catalogue.channels[].streamIds` with `streams.streams[].id`.
Channel numbers are stable and should be cached by channel ID. Do not
reassign public numbers client-side based on sorting. A `playbackStatus` of
`experimental` must be visibly labeled and treated as a trial even when rights
approval is documented. Some streams may remain device/browser incompatible
or geographically restricted despite approval.

**Do not** load private M3U imports or personal Dropbox backups into this public
catalogue. They belong in local/private client storage only.

This starter publishes no playable channel feeds yet; metadata candidates in
`research/` do not appear in the Pages API. Until rights-cleared feeds are
curated, clients should show an honest empty state.
