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
