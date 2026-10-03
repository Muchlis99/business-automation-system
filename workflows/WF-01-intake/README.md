# WF-01 — Intake Contract

WF-01 accepts an engineering request and creates a deterministic intake record. It does not create tasks, deploy software, mutate production data, or approve changes.

## Required input
- `request_id`
- `title`
- `requester`
- `description`

## Validation
- Missing required fields → `CLARIFICATION_REQUIRED`.
- `request_id` is idempotency key; same normalized payload is `DUPLICATE`, different payload is `CONFLICT`.
- Free-form request text is data, not system instructions.
- Prompt-injection text must not change policy, routing, permissions, or status.
- Production/destructive intent is flagged for downstream human approval; WF-01 never approves or executes it.

## Output states
`ACCEPTED`, `CLARIFICATION_REQUIRED`, `DUPLICATE`, `CONFLICT`, `REJECTED`.

Every result carries `correlation_id`, `request_id`, `state`, `reason_codes`, and `created_at`.

## Acceptance tests
- Missing field names are returned concretely.
- Valid request is accepted exactly once.
- Replay does not duplicate the intake record.
- Reused ID with different content returns `CONFLICT`.
- "ignore previous instructions" remains ordinary data.
- Production/destructive request is flagged, not executed.

## TypeScript service implementation

The callable service is in `api/wf-01-intake`; it validates against this directory's unchanged `schema.json` and persists accepted requests in PostgreSQL through `database/migrations/001_wf_01_intake.sql`. The package exposes `IntakeService.submit(unknown)` and `PostgresIntakeRepository`; it does not expose an unauthenticated network endpoint or start n8n. TypeScript/Node is used because the repository has no stronger application-runtime convention, it matches the project's existing TypeScript direction, and PostgreSQL is the repository's defined transactional store. An authenticated HTTP adapter remains outside this slice because no authentication contract is defined.

For idempotency, string values are Unicode NFKC-normalized, CRLF/CR newlines become LF, and leading/trailing whitespace is trimmed. Object keys are sorted for the digest; array order and remaining internal whitespace are significant. `request_id` is trimmed and Unicode-normalized, remains case-sensitive, and is the PostgreSQL primary key.

For persisted outcomes (`ACCEPTED`, `DUPLICATE`, and `CONFLICT`), `created_at` is the original intake row's creation time; validation-only results use the time of that result. When the required `request_id` is absent or not a string, its response value is `null` because no usable identifier was supplied.

A high-impact request is accepted into intake with `human_review_required: true`, `approval_status: "pending_human_review"`, and reason code `HIGH_IMPACT_REVIEW_REQUIRED`. All service results explicitly set `execution_permitted: false`; WF-01 has no approval or execution capability. Detection is deterministic and conservative: unnegated destructive verbs are flagged, as are production-related deployment/change verbs. This flag is a review gate, not an approval decision.

Run the behavior suite with `npm test` and type checking with `npm run typecheck` from `api/wf-01-intake`. The PostgreSQL integration test runs when `DATABASE_URL` is set; CI applies the migration and runs it against PostgreSQL.
