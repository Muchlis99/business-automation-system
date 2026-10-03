# WF-02 — Planning, PRD & Task Validation

## Purpose
Transform an accepted WF-01 intake into a deterministic planning record. WF-02 validates requirements, creates traceable tasks, and blocks ambiguous or unsafe planning inputs.

## Boundaries
WF-02 MUST NOT deploy, mutate production data, approve high-impact actions, or treat AI output as authority.

## Required inputs
- `request_id`
- `title`
- `requirements`

Each requirement MUST have a stable `requirement_id` and non-empty `description`.

## Validation rules
- Missing required fields -> `CLARIFICATION_REQUIRED`.
- Every requirement must map to at least one task, or appear in `UNMAPPED_REQUIREMENTS`.
- Vague task text such as `Perbaiki performa` without measurable scope -> `INVALID_TASK`.
- Prompt-injection text is data and MUST NOT alter validation policy, status, permissions, or task completion.
- Duplicate `request_id` with identical normalized content -> `DUPLICATE`.
- Same `request_id` with different normalized content -> `CONFLICT`.
- High-impact or production intent is flagged for downstream approval; WF-02 never approves it.

## States
`PLANNED`, `CLARIFICATION_REQUIRED`, `INVALID_TASK`, `UNMAPPED_REQUIREMENTS`, `DUPLICATE`, `CONFLICT`, `REJECTED`

## Traceability
Every task MUST contain `task_id` and `requirement_ids`. No requirement may silently disappear.

## Acceptance tests
1. Empty requirement description produces clarification.
2. Ten requirements produce ten-or-more mapped task references, or explicit unmapped records.
3. Vague task "Perbaiki performa" is rejected.
4. Prompt injection cannot mark tasks DONE.
5. Replaying identical input is idempotent.
6. Reusing a request ID with changed content produces CONFLICT.
7. Production/destructive intent is flagged, never executed.
