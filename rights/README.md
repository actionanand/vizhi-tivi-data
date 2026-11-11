# Rights reviews and takedowns

No paid, DRM-protected, geo-bypassed, or unauthorized feeds may be published.
Revocations are kept permanently as an audit trail, even after removing a
channel or stream from current publication.

On an actionable takedown/rights complaint:
1. Add an `active` entry to `rights/revocations.json` targeting the `channel`,
   `stream`, or exact URL `host`; include date, reason, and evidence URL.
2. Commit/push to `master`: the publisher filters that target out immediately.
3. Daily scheduled publishing checks repeat the revocation filter and can
   republish a corrected site if previous publication diverges.
4. Do not treat unavailability as an automatic copyright revocation.
5. To clear a block, change its status to `cleared` only after documented review.

Example entries appear in docs/rights-policy.md. A scheduled job cannot
independently learn of every new copyright notice without a trusted input
source. Human-reviewed revocation entries are the authoritative input.
