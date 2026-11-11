# Streaming rights, provenance and takedowns

**Free-to-watch is not the same as freely redistributable.** A channel being
visible on YouTube, a broadcaster's website, or a third-party IPTV directory
does not automatically permit rehosting, deep-linking, embedding or redistributing
its stream. The public Vizhi TiVi API lists direct stream URLs only after an
explicit, documented rights review consistent with the intended use.

`data/streams.json` permits only `rightsStatus: "approved"` with an HTTPS
`rightsEvidenceUrl` that supports the intended linking/embedding/distribution.
This is a review record, **not** automatic proof of legal permission. A reviewer
must also confirm license terms, geo restrictions, any DRM requirements, and
whether the stream may legally be linked by the client app.

`verificationStatus: "verified"` is for streams actually decoded/played by a
human or trustworthy integration test. `verificationStatus: "trial"` plus
`experimental: true` permits a legal but technically unverified trial; it is
still subject to the same rights approval requirement.

No DRM circumvention, geoblock bypass, credential-bearing URLs, secret tokens,
paid-channel feeds, scraping of protected players, or copying broadcaster logos
without permission. Streams should be publicly accessible HTTPS URLs with no
embedded credentials. Research-only candidate identities remain in `research/`.

## Revocation file

`rights/revocations.json` is permanent history. Example **not included as an
active rule**:

```json
{
  "id": "notice-2026-001",
  "targetType": "channel",
  "target": "example-broadcaster-channel",
  "status": "active",
  "date": "2026-11-11",
  "reason": "Documented rights holder takedown request",
  "evidenceUrl": "https://example.org/rights-notice"
}
```

The evidence URL above is a formatting illustration, **not** actual permission
or an active notice.

Targets may be a channel ID, stream ID, or *exact* HTTPS hostname, not wildcards.
Active channel/stream/host revocations exclude matching streams at build time;
channels with zero remaining eligible streams disappear from the public catalogue.
The revocation record stays in Git history even after the stream is removed.
Only change `status` to `cleared` following documented rights-holder review.

Push a validated revocation to `master` for immediate publication. A scheduled
daily run rechecks rights exclusions and republishes if public content differs.
A scheduled job cannot invent or infer new copyright claims; review and
maintain the revocation ledger when a legitimate notice arrives.
