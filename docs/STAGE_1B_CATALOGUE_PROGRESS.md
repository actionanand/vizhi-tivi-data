# Stage 1B — real catalogue research progress

Review date: 2026-11-13. Data branch: `feature/stage-1b-catalogue-research`, based on `662e34c976b2cfeb7fc14478dea132d74d23916a`. This is local, uncommitted work. No Pages publish, release, push or data upload was performed.

## Baseline and measurable results

The source catalogue, stream catalogue, active-number ledger and revocation ledger initially contained zero entries. The generated local publication remains **0 channels and 0 streams**. No channel numbers were assigned and no identity or retirement history was changed. Research is not published.

| Measure | Result |
|---|---:|
| Candidate channels researched in this pass | 5 |
| Tamil / other-language candidates | 4 / 1 |
| Candidates with an accessible official broadcaster or government source | 4 |
| Candidate HLS endpoints returning HTTPS 200 and `#EXTM3U` | 5 |
| Streams verified by decoding or actual playback | 0 |
| Approved for publication | 0 |
| Pending rights/technical review | 5 |
| Rejected | 0 |
| New approved local channels / streams | 0 / 0 |
| Distinct candidate stream URLs | 5 |

The News18 Tamil Nadu official website was identified, but automated source review was blocked by robots; its broadcaster identity was not independently verified in this pass. A reachable playlist is not evidence that its video segments work, that it remains live, or that Vizhi TiVi may use it. No playlist is promoted as an official stream.

## Reviewed candidates

The structured research-only inventory `research/stage-1b-stream-review.json` records the exact candidate HTTPS URL, language, country, category, source, observed result, rights status and next action for each row. IDs there are proposed research identifiers, not allocated official identities.

| Candidate | Official or government evidence | Candidate source and result | Rights gap / next action |
|---|---|---|---|
| DD Tamil (Tamil, general) | [Prasar Bharati channel directory](https://prasarbharati.gov.in/en/dd-channels/) identifies DD Tamil. | Third-party PiShow HLS, identified in a [public playlist](https://gist.github.com/ZeiTeria/68851fb02bbb95525d89ff0ff0afceae): HTTPS 200, `#EXTM3U`. | Confirm endpoint provenance and obtain Prasar Bharati and provider permission for the exact app use. |
| News18 Tamil Nadu (Tamil, news) | [Official website](https://tamil.news18.com/) identified; automated review blocked by robots. | Third-party [playlist lead](https://github.com/ajimal173/iptv/blob/main/Rasi-Tv), Akamai HLS: HTTPS 200, `#EXTM3U`. | Independently confirm ownership and request direct-stream use permission from the broadcaster and provider. |
| News Tamil 24x7 (Tamil, news) | [SPlus Media](https://www.splusmedia.in/about.php) identifies the channel. | [iptv-org discovery](https://github.com/iptv-org/iptv/blob/master/streams/in.m3u), Tango TV HLS: HTTPS 200, `#EXTM3U`. | Obtain explicit direct-stream use permission from SPlus and the provider. |
| SVBC 2 Tamil (Tamil, devotional) | [SVBC official site](https://www.svbcttd.org/) lists the Tamil live channel. | [iptv-org discovery](https://github.com/iptv-org/iptv/blob/master/streams/in.m3u), mslivestream HLS: HTTPS 200, `#EXTM3U`. | Confirm stream provenance with SVBC and obtain permission for third-party clients. |
| Sansad TV 1 (Hindi, public service) | [NIC government live webcast](https://webcast.gov.in/lstvlive/) identifies the channel; [NIC player page](https://webcast.gov.in/jwplayer/video.html?autostart=true&hlsurl=%2F%2Fplayhls.media.nic.in%2Fhls%2Flive%2Flstv%2Flstv.m3u8) names the endpoint. | Government-hosted HLS: HTTPS 200, `#EXTM3U`. | Request explicit third-party direct-stream permission; government-hosted public viewing alone is not the required evidence. |

All five HTTPS requests used certificate verification, HTTPS-only redirects, finite timeouts and a 200 KB response limit. These are bounded manifest checks, not segment or player tests. No DRM, authentication or geographical restriction was bypassed. The check was not a security review of every URL or operator.

## Rights, blocklist and numbering

The repository's active revocation ledger is empty. A 2026-11-13 check of the [iptv-org blocklist](https://github.com/iptv-org/database/blob/master/data/blocklist.csv) found no exact matches for `DDTamil.in`, `News18TamilNadu.in`, `NewsTamil24x7.in`, `SVBC2.in` and `SansadTV1.in`. This does not establish rights, cover aliases or substitute for renewed checks before publication. No rights holder has granted the required explicit permission in the evidence reviewed. Pending candidates remain outside `data/channels.json`, `data/streams.json` and the numbering ledger. On approval, assign Tamil numbers 1–250 and other-language numbers 251 onward using existing tools; never reserve or recycle numbers merely for research.

## Automation, validation and compatibility

Existing source validation, duplicate and number checks, rights exclusions, daily digest-gated publication, weekly review-only scans, artifact retention and historical releases were inspected and preserved. GitHub Actions execution was not triggered. The data repository's `npm ci` passed with no external package dependencies. `npm run check` passed: **28 tests**, source/rights/locale validation, generated build, policy audit and reproducible publication verification (8 JSON files, site and `.nojekyll`). The generated manifest digest is `64fcd16817abc546d7d244c47cbe1b3afb82d9105b47f6ab117370b500feedf4`.

Two Windows portability failures were observed and corrected: the test compared a native path to a forward-slash suffix, and the build CLI compared a Windows path against a URL pathname. `test/build.test.mjs` now checks a native suffix and executes the build CLI inside a disposable copied fixture. The complete check passed after both corrections.

All eight generated JSON files match the application repository's empty-publication contract fixture by parsed JSON content. The app's targeted Angular published-catalogue test passed **20 tests**, including acceptance of that fixture and digest. Previous Android mobile/TV contract tests cover that fixture; no new nonempty production catalogue exists to test. Android was not rebuilt in this data-only pass.

Research inventory checks found five unique proposed IDs, five distinct HTTPS endpoints and pending rights on every record. `git diff --check` is recorded after the final changes. No video playback, physical-device test, broadcaster permission request or live deployment was performed.

## Changed files

- `research/stage-1b-stream-review.json` — new structured research-only inventory; existing `research/channel-candidates.json` preserved.
- `scripts/build.mjs` — platform-safe CLI entry detection.
- `test/build.test.mjs` — portable path assertion and actual CLI regression.
- `docs/STAGE_1B_CATALOGUE_PROGRESS.md` — this report.

The existing seven research candidates remain untouched; DD Tamil overlaps this pass. The five rows above represent this pass, not five approved additions or the full historical research list.

## Next steps

1. Contact each rights holder and CDN/provider for written permission covering exact direct URLs, app use, territories and reuse; retain reviewable evidence.
2. Confirm channel ownership and stream provenance, recheck upstream blocklists and the local revocation ledger, and assess geofencing and browser CORS without bypassing restrictions.
3. With permission, test permitted playback and audio/subtitles on actual clients; record verification dates. For any legally approved but technically unverified trial, follow the existing experimental-stream rules.
4. Only after rights review, allocate stable numbers through the existing ledger, add approved source records, run `npm run check`, and validate the nonempty publication in both client adapters before seeking independent review.

## Expansion follow-up — 2026-11-13

This follow-up adds **40 research leads** to the five above, for 45 distinct candidates: 7 Tamil and 38 other or not yet language-classified. The additional leads are three Tamil local channels (SDR TV, ABI TV, ABI Music), three SVBC services (Telugu, Kannada and Hindi), Sansad TV 2, and 33 Doordarshan services listed by [Prasar Bharati](https://prasarbharati.gov.in/en/dd-channels/). They include Malayalam, Telugu, Kannada, Hindi, English, Urdu, Marathi, Gujarati, Odia, Bengali, Assamese, Punjabi and Kashmiri leads; seven regional services have no language assigned pending confirmation. Language assignments are preliminary research metadata, not a statement that every programme is in that language. DD National, DD News, DD India, DD Malayalam and DD Saptagiri also appear in the older candidate file; these are the same channel leads, not additional channels. DD Sports was not added: sports rights are often event-specific and no suitable permission was established.

[ABI Media Network](https://www.abigroup.co.in/businesses/abi-media-network) identifies its three Tamil channels and a contact, but no direct streams were established. [SVBC](https://www.svbcttd.org/) identifies four language services. [Sansad TV](https://sansadtv.nic.in/live-tv) identifies its two services. Six new candidate HLS URLs (DD National, DD News, DD Chandana and three SVBC services) were found in the [iptv-org India list](https://github.com/iptv-org/iptv/blob/master/streams/in.m3u). That directory does not establish endpoint provenance or rights. The remaining new leads have no identified direct endpoint. No candidate is rejected as a channel; no candidate is approved. Paid Sun TV and Sun Music feeds were excluded from this free catalogue: the broadcaster's [IPTV price schedule](https://www.sunnetwork.in/footerpdf/tvch/2026/RIO_IPTV-TVCH-W.E.F_1st_MAY_2026.pdf) lists pay-channel pricing, and it grants no Vizhi TiVi permission.

The JSON contains a separate unsent, channel-specific permission draft for each candidate, including the endpoint when known. Contact sources are recorded; News18 Tamil Nadu and News Tamil 24x7 still need verified suitable addressees. [Doordarshan's directory](https://prasarbharati.gov.in/en/doordarshan/) lists a platform distribution contact; [Prasar Bharati's tender listing](https://prasarbharati.gov.in/en/tenders/page/18/?tab=tender_notices) also describes a WAVES international distribution partner process, which is a lead rather than permission for direct feeds. No request was sent, and no written rights grant, licence covering these exact streams and clients, or qualifying documented integration was found. The permission drafts ask about exact endpoint, Android and web use, territory, programme and CDN rights, duration, conditions and revocation. Permissions for one platform or free public viewing cannot be generalized to another.

**Technical limitation:** local DNS resolution of `raw.githubusercontent.com` failed and neither FFmpeg nor ffprobe nor VLC was found on PATH. The six new endpoint leads were not contacted, their manifests or media segments were not checked, and no decoding was performed. The five earlier HTTP 200 manifest observations above are the preserved baseline, not a fresh recheck or proof of playable segments. No DRM, authentication or geographical restriction was bypassed. Across the 45 records there are 11 distinct candidate URLs, five baseline manifest observations, zero decoded streams, zero rights approvals, and zero additions to the local catalogue. Language and stream identity, current terms, provider authorization, segment integrity and actual playback remain open before any promotion. Research IDs and numbers in third-party source names are not official catalogue allocations.

**Validation in this follow-up:** `npm ci` could not run because `npm` is unavailable on PATH. Node v24.22.1 was available, so the component commands of `npm run check` were run directly: source validation passed, all 28 tests passed, build and rights policy audit passed, and reproducible publication verification passed for eight JSON files, site index and `.nojekyll`; digest remains `64fcd16817abc546d7d244c47cbe1b3afb82d9105b47f6ab117370b500feedf4`. This covers existing duplicate and numbering tests, rights checks and publication SHA-256 verification. A separate inventory check found 45 unique IDs and 11 unique non-null URLs. `git diff --check` passed for tracked changes (Git does not check untracked files). Consumer contract tests were not rerun in this follow-up; the unchanged empty publication and prior results are described above. The required exact `npm ci && npm run check` remains outstanding in an environment with npm, as do the blocked stream checks.

## Readiness follow-up — 2026-11-13

The 66 records below are research leads, not a complete census or evidence that all services remain on air or are free online. They include all 35 services in the [Doordarshan directory](https://prasarbharati.gov.in/en/dd-channels/) (including DD Sports, which the earlier follow-up intentionally omitted), with HD/SD variants treated as one service. DD Tamil is the current official name; Podhigai and Pothigai are aliases, not separate IDs. The official directory describes the 2024 name change. DAN TV and DAN Tamil Oli are listed separately by the broadcaster, but their distinct current operation needs confirmation. Government and broadcaster pages identify 64 candidates; News18 Tamil Nadu requires independent official identity confirmation and Kalvi Tholaikkatchi relies on a historical distributor announcement. Official identification is not current-operation verification. The DAN cable services and all other leads require confirmation that suitable free online access exists.

Language counts (primary research label, not exclusive programme language): tam: 27; hin: 17; eng: 1; urd: 1; mal: 1; tel: 3; kan: 2; mar: 1; guj: 1; ori: 1; ben: 1; asm: 1; pan: 1; kas: 1; unclassified: 7. Distinct IDs: 66; distinct non-null endpoints: 11. Research-only identities never receive catalogue numbers.

| Channel | Language | Identity source | Stream lead |
|---|---|---|---|
| DD Tamil | tam | [source](https://prasarbharati.gov.in/en/dd-channels/) | HLS candidate; DNS blocked |
| News18 Tamil Nadu | tam | [source](https://tamil.news18.com/) | HLS candidate; DNS blocked |
| News Tamil 24x7 | tam | [source](https://www.splusmedia.in/about.php) | HLS candidate; DNS blocked |
| SVBC 2 Tamil | tam | [source](https://www.svbcttd.org/) | HLS candidate; DNS blocked |
| Sansad TV 1 | hin | [source](https://webcast.gov.in/lstvlive/) | HLS candidate; DNS blocked |
| DD National | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | HLS candidate; DNS blocked |
| DD News | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | HLS candidate; DNS blocked |
| DD India | eng | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Bharati | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Urdu | urd | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Kisan | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Malayalam | mal | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Saptagiri | tel | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Chandana | kan | [source](https://prasarbharati.gov.in/en/dd-channels/) | HLS candidate; DNS blocked |
| DD Yadagiri | tel | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Sahyadri | mar | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Girnar | guj | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Oriya | ori | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Bangla | ben | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Assam | asm | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Punjabi | pan | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Rajasthan | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Bihar | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Jharkhand | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Madhya Pradesh | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Uttar Pradesh | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Chhattisgarh | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Uttarakhand | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Himachal Pradesh | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Kashir | kas | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Tripura | unclassified | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Arunprabha | unclassified | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Manipur | unclassified | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Goa | unclassified | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Haryana | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Meghalaya | unclassified | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Mizoram | unclassified | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| DD Nagaland | unclassified | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| SDR TV | tam | [source](https://www.abigroup.co.in/businesses/abi-media-network) | not identified |
| ABI TV | tam | [source](https://www.abigroup.co.in/businesses/abi-media-network) | not identified |
| ABI Music | tam | [source](https://www.abigroup.co.in/businesses/abi-media-network) | not identified |
| SVBC Telugu | tel | [source](https://www.svbcttd.org/) | HLS candidate; DNS blocked |
| SVBC 3 Kannada | kan | [source](https://www.svbcttd.org/) | HLS candidate; DNS blocked |
| SVBC 4 Hindi | hin | [source](https://www.svbcttd.org/) | HLS candidate; DNS blocked |
| Sansad TV 2 | hin | [source](https://sansadtv.nic.in/live-tv) | not identified |
| DD Sports | hin | [source](https://prasarbharati.gov.in/en/dd-channels/) | not identified |
| Sai TV | tam | [source](https://saitv.org/about-us/) | not identified |
| Madha TV | tam | [source](https://madhatv.in/Contact) | not identified |
| Mahimai TV | tam | [source](https://mahimaitv.com/contactus.php) | not identified |
| Joshua TV | tam | [source](https://joshuatv.co.in/) | not identified |
| Thanthi TV | tam | [source](https://www.thanthitv.com/about-us) | not identified |
| Puthiyathalaimurai TV | tam | [source](https://www.puthiyathalaimurai.com/contact-us) | not identified |
| Puthu Yugum TV | tam | [source](https://www.puthiyathalaimurai.com/contact-us) | not identified |
| Kalvi Tholaikkatchi | tam | [source](https://www.dishd2h.com/media/1823/dishtv-d2h-start-kalvi-tholaikkatchi-an-educational-channel.pdf) | not identified |
| DAN TV | tam | [source](https://www.dantv.lk/channels.php) | not identified |
| DAN Tamil Oli | tam | [source](https://www.dantv.lk/channels.php) | not identified |
| DAN Music | tam | [source](https://www.dantv.lk/channels.php) | not identified |
| DAN Comedy | tam | [source](https://www.dantv.lk/channels.php) | not identified |
| DAN News | tam | [source](https://www.dantv.lk/programs.php) | not identified |
| Ohm TV | tam | [source](https://www.dantv.lk/programs.php) | not identified |
| Holy Mary | tam | [source](https://www.dantv.lk/programs.php) | not identified |
| Pirai TV | tam | [source](https://www.dantv.lk/programs.php) | not identified |
| Kalvi TV 1 | tam | [source](https://www.dantv.lk/channels.php) | not identified |
| Kalvi TV 2 | tam | [source](https://www.dantv.lk/channels.php) | not identified |
| Kalvi TV 3 | tam | [source](https://www.dantv.lk/channels.php) | not identified |
| Kalvi TV 4 | tam | [source](https://www.dantv.lk/channels.php) | not identified |

All 11 HTTPS endpoints were attempted once locally on 2026-11-13. Each returned Node `ENOTFOUND`; Windows `Resolve-DnsName` reported access denied. The web retrieval tool also could not access the 11 URLs. These failures do not establish endpoint unavailability, geography, authentication, redirects or TLS state. No manifest, variant, media segment, codec, resolution or decode was observable during this follow-up. The five earlier HTTP 200 observations remain historical and cannot be counted as fresh availability. No restrictions were bypassed. No FFmpeg, ffprobe or VLC was found on PATH or in the inspected installed tool locations. Each URL has a dated structured attempt in the inventory.

Rights review: [Prasar Bharati website terms](https://prasarbharati.gov.in/en/disclaimer/) limit its website materials to personal or educational use and restrict reproduction and distribution; these website terms do not authorize Vizhi TiVi direct stream playback. Its [WAVES service](https://prasarbharati.gov.in/en/waves/) confirms an official distribution platform but grants no third-party client rights. [SVBC](https://www.svbcttd.org/) and [Madha TV](https://madhatv.in/LiveTV) offer official viewing, but no permission was found for listing and playing their direct streams in all requested clients. No candidate has positive rights evidence for the required complete scope; all 66 remain pending, with zero additions.

Ten priority drafts, each in its channel record, cover separate broadcaster organizations. Their contacts are broadcaster-listed general or distribution contacts, not verified licensing officers; ask to be routed to the actual authorized rights holder. No messages have been sent. Where an endpoint is known, its operator is identified as a separate authorization question; where absent, the drafts request an authorized endpoint and provider identity.

| Priority | Channel / organization | Official contact source |
|---:|---|---|
| 1 | DD Tamil — Prasar Bharati / Doordarshan | [contact](https://prasarbharati.gov.in/en/doordarshan/) — manoj.gupta@prasarbharati.gov.in |
| 2 | SVBC 2 Tamil — Sri Venkateswara Bhakti Channel / Tirumala Tirupati Devasthanams | [contact](https://www.svbcttd.org/) — svbcfeedback.ttd@tirumala.org |
| 3 | News Tamil 24x7 — SPlus Media Limited | [contact](https://www.splusmedia.in/about.php) — enquiry@splusmedia.in |
| 4 | SDR TV — ABI Media Network; grant authority to confirm | [contact](https://www.abigroup.co.in/businesses/abi-media-network) — sdponseelan@abigroup.co.in |
| 5 | Sai TV — Sai Baba Network Private Limited | [contact](https://saitv.org/about-us/) — saibabhanetwork@gmail.com |
| 6 | Madha TV — Madha TV / Santhome Communication Centre; grant authority to confirm | [contact](https://madhatv.in/Contact) — info@madhatv.in |
| 7 | Mahimai TV — Mahimai TV; legal rights holder to confirm | [contact](https://mahimaitv.com/contactus.php) — office@mahimaitv.com |
| 8 | Puthiyathalaimurai TV — New Generation Media Corporation Private Limited | [contact](https://www.puthiyathalaimurai.com/contact-us) — feedback@puthiyathalaimurai.tv |
| 9 | DAN Music — ASK Media Pvt Ltd; service and rights to confirm | [contact](https://www.dantv.lk/about-us.php) — info@dantv.lk |
| 10 | Joshua TV — Joshua TV; legal rights holder to confirm | [contact](https://joshuatv.co.in/) — Telephone: +91 94861 13630 (request written rights contact) |

Environment and validation: `.nvmrc` requests Node 24.16.0; available Node 24.22.1 satisfies the package minimum. npm was not on PATH, but the existing adjacent project tool launcher and package were located and added to PATH for this run. `npm ci && npm run check` passed: 28 tests, rights and numbering checks, deterministic build and reproducible SHA-256 publication verification. Digest: `64fcd16817abc546d7d244c47cbe1b3afb82d9105b47f6ab117370b500feedf4`. The Angular suite was not rerun: the user prohibited changes to the client repository, and an isolated client test setup was not prepared; the earlier 20-test result above is historical. No client files were changed.
