# WF-02 Planning Service

This TypeScript service implements the input contract in `workflows/WF-02-planning-validation/schema.json` and the behavioral requirements in `tests/wf-02-planning-validation.md`.

## Behavior

- Normalizes strings using Unicode NFKC, canonical newlines, and surrounding-whitespace trimming. Object keys are canonicalized for hashing; array order is preserved.
- Missing required fields or blank requirement IDs/descriptions return `CLARIFICATION_REQUIRED`; schema-invalid input returns `REJECTED`.
- Validates task-to-requirement references and records every unmapped requirement explicitly.
- A generic action-plus-generic-target title such as `Perbaiki performa` is `INVALID_TASK`. A concrete scoped title may be verifiable without a numeric metric; linked acceptance criteria do not turn a generic task title into a valid one.
- Task order is preserved as authored. WF-02's published schema has no dependency/order fields, so this service does not invent or compute dependencies.
- High-impact or production intent is flagged for downstream human review. The service never approves or executes a task; `execution_permitted` is always `false`.
- PostgreSQL stores normalized records under a unique `request_id`, making identical replay and changed-content conflicts durable across service instances.

## Run

From this directory, install dependencies with `npm ci`, set `DATABASE_URL`, apply the migration with `npm run migrate`, then run `npm run typecheck` and `npm test`. The PostgreSQL integration test runs when `DATABASE_URL` is set; otherwise it is skipped, while the service behavior suite always runs against an in-memory repository.
