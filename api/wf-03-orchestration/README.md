# WF-03 Orchestration Service

This TypeScript service validates against the published `workflows/WF-03-orchestration/schema.json` contract and records a deterministic orchestration plan in PostgreSQL. It exposes `OrchestrationService.orchestrate(unknown)` and `PostgresOrchestrationRepository`; it does not add an HTTP endpoint, start n8n, run tasks, invoke business systems, or approve work.

## Contract boundary

The published contract has no upstream approval status/reference field or authoritative approval lookup. Per the agreed boundary for this slice, schema-valid input is treated as a planning record already approved by its trusted caller. The service does not add or infer approval evidence. Independently, high-impact tasks require human review and return `APPROVAL_REQUIRED`; this service has no approval-completion path.

The input schema remains unchanged and rejects unsupported fields, including caller-supplied approval or completion claims. Task titles and action text are untrusted data and cannot alter the policy, graph, state, or completion status.

## Deterministic behavior

- Strings are normalized with Unicode NFKC, canonical newlines, and surrounding-whitespace trimming; object keys are canonicalized while array order is preserved for plan hashing.
- Duplicate task IDs are rejected. Unknown dependency IDs and cycles return their contract states and no execution order.
- Valid graphs use topological ordering with lexical `task_id` tie-breaking.
- A high-impact task is detected using the established WF-01 conservative action-language rule, plus explicit `risk: high|critical` and `environment: prod` values. Destructive actions and production-related changes are gated. The gated task and any transitive dependents are included in `blocked_task_ids`; only the remaining safe topological order is returned.
- A `plan_id` is immutable: an identical normalized replay returns `DUPLICATE`; changed content returns `CONFLICT` and no execution order.
- `execution_order` is a plan only. The service never executes or marks a task complete.

## PostgreSQL

`database/migrations/003_wf_03_orchestration.sql` adds the append-only `wf03_orchestrations` table with a unique `plan_id`; service persistence uses `INSERT ... ON CONFLICT DO NOTHING` followed by a read, never update/delete. Apply the migration with `DATABASE_URL` set:

```sh
npm run migrate
```

Run unit and PostgreSQL integration tests and TypeScript checking with:

```sh
npm test
npm run typecheck
```

The PostgreSQL integration test runs when `DATABASE_URL` is set; CI applies the migration against PostgreSQL before running it.
