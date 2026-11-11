# GitHub setup and scheduled operations

1. Create a new **public, empty** GitHub repository `actionanand/vizhi-tivi-data`.
   Do not initialize it with GitHub's default README or license; both are in ZIP.
2. Unzip and upload all files, including the hidden `.github/` directory, to
   branch `master`. Prefer cloning and pushing so file paths stay intact.
3. In repository Settings → Actions → General, confirm that Actions is enabled
   and `GITHUB_TOKEN` may write contents where repository policy permits.
4. The first `Vizhi TiVi Data - Publish approved catalogue` run generates
   `gh-pages` containing **only** published website files.
5. In repository Settings → Pages, set **Deploy from a branch** → `gh-pages`
   → `/(root)` and Save. Then rerun the publish workflow if necessary.
6. Check `https://actionanand.github.io/vizhi-tivi-data/manifest.json`.
7. No custom secrets are required for the standard public GitHub-only setup.

## Workflows

- `validate.yml`: validation/tests on PRs and pushes to `master`; no deploy.
- `publish.yml`: pushes to `master`, daily 03:41 UTC, manual; validates,
  computes deterministic public digest, publishes changed output to `gh-pages`,
  explicitly requests a Pages build when configured, and creates a GitHub
  Release **only on meaningful published-catalogue changes**. The first
  empty catalogue initializes Pages but does not create an empty release.
- `weekly-scan.yml`: every Sunday 04:23 UTC, checks source/stream URL reachability,
  uploads a review-only health report for 7 days. No rights auto-approval.

All prior GitHub Releases remain available; workflows never delete releases.
Health checks do not silently alter rights, channel numbers, or verification
status, and health-only reports do not create new catalogue releases.
GitHub's built-in Actions notifications are sufficient; no SMTP or email
secrets are required.

The publication job intentionally copies only `dist/site` to `gh-pages` so
README/source files are not shown in the deployed root. `GITHUB_TOKEN` commits
to `gh-pages` do not normally start a new Pages build, so the workflow calls
the Pages builds API when the source is `gh-pages`. That API requires Pages
access; a warning tells you to enable Pages if it has not been configured.

## Retention and policy

- Historical GitHub Releases are **never automatically deleted**.
- Temporary weekly scan artifacts are kept 7 days.
- A rights notice must be entered in `rights/revocations.json`; any resulting
  public stream removal is a meaningful catalogue change.
- Daily jobs check the current maintained revocation ledger; they cannot
  independently discover every copyright claim from the open Internet.
- Preserve one immutable published digest per meaningful GitHub Release.
