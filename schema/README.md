# JSON Schema contracts

- `catalogue-v1.schema.json` describes the published `catalog/v1/catalogue.json`.
- `streams-v1.schema.json` describes the published `catalog/v1/streams.json`.

Validation in `scripts/validate.mjs` additionally enforces domain-specific
rules (immutable numbering, legal approval, HTTPS, locale parity, rights
revocations). JSON Schema validation alone does not replace these checks.

Future incompatible changes must create `catalog/v2` alongside v1, without
silently changing the v1 data contract.
