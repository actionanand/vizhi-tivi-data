# Channel numbering and identity

Stable, unique channel IDs (`id`) are distinct from channel display names.

- Tamil (`languages` includes ISO 639-3 `tam`): **1 through 250**.
- All other languages: **251 onward**.
- Never move or renumber an active channel merely because lists reorder.
- A channel number can be reused only after explicit permanent retirement.
- Retired IDs cannot be silently resurrected with different numbers.
- If all 250 Tamil slots are occupied, allocation fails rather than changing
  an existing channel. Editorial review is required.

The source of truth is `data/numbering.json` (`active` and append-only `retired`).
`data/channels.json` must match the ledger exactly. Add channel metadata with
`number: null`, then run `npm run numbers:assign`. Verify and review the diff.

To retire:
1. Remove channel from `data/channels.json` and its streams from `data/streams.json`.
2. Run `npm run numbers:retire -- channel-id "Permanently retired by broadcaster"`.
3. `npm run numbers:assign` may reuse the newly vacated number for a different ID.
4. Run `npm run check` and inspect the diff before committing.

Imported M3U/M3U8 files and URLs are **user-private client data**. Imported
Tamil channels may be assigned unused local Tamil slots on the device, but
that must never change the official shared numbering ledger or uploaded
public catalogue. Keep imports in a separate Imported TV / My IPTV tab.
