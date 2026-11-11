# Source and public data format

Source files (only reviewed channels/streams should enter these files):

- `data/channels.json`: `schemaVersion:1`, `channels` array.
- `data/streams.json`: `schemaVersion:1`, `streams` array.
- `data/numbering.json`: stable active map and retired audit history.
- `data/locales/{en,ta,sa}.json`: three complete, key-matched UI locales.
- `rights/revocations.json`: maintained legal exclusions.

Illustrative source channel (NOT bundled as an actual licensed channel):

```json
{
  "id": "example-tamil-channel",
  "number": 1,
  "name": "Example Tamil Channel",
  "languages": ["tam"],
  "country": "IN",
  "category": "news",
  "status": "active",
  "website": "https://example.org/",
  "sourceUrls": ["https://example.org/channel-info"],
  "logoUrl": null
}
```

Illustrative stream with **fictional** URL and rights evidence:

```json
{
  "id": "example-tamil-channel-hls",
  "channelId": "example-tamil-channel",
  "url": "https://example.org/live.m3u8",
  "format": "hls",
  "rightsStatus": "approved",
  "rightsEvidenceUrl": "https://example.org/terms-for-embedding",
  "verificationStatus": "verified",
  "experimental": false,
  "lastVerifiedAt": "2026-11-11"
}
```

**These examples are fake. Do not publish them or use them as evidence of rights.**
The site generator will exclude a channel from public output unless it has at
least one approved and not-revoked stream. A verified technical stream does
not by itself establish distribution permission.

Public v1 output is generated, not manually maintained:

- `manifest.json`
- `catalog/v1/catalogue.json`
- `catalog/v1/streams.json`
- `catalog/v1/locales/{en,ta,sa}.json`
- `index.html` and `.nojekyll`

This contract may evolve additively within v1, but breaking changes should
use a new `/catalog/v2` prefix to protect older Android and Angular clients.
