# WF-03 — Orchestration

## Purpose
Transform an approved planning record into a deterministic execution plan. WF-03 coordinates downstream work but does not itself build, test, deploy, mutate production data, or approve high-impact actions.

## Input
Required:
- `request_id`
- `plan_id`
- `tasks`

Each task MUST contain:
- `task_id`
- `title`
- `requirement_ids`

Optional task fields:
- `depends_on`
- `risk`
- `environment`
- `action`

## Deterministic orchestration rules
- Every task MUST have a stable `task_id`.
- A task may start only after every task in `depends_on` has completed successfully.
- Unknown dependency IDs are rejected.
- Dependency cycles are rejected.
- Duplicate task IDs are rejected.
- A task may be routed only once per `plan_id`.
- Replaying an identical plan is idempotent and returns the existing orchestration record.
- Reusing a `plan_id` with changed normalized content returns `CONFLICT`.
- Task ordering MUST be deterministic: topological order with lexical `task_id` tie-breaking.

## Safety boundaries
- AI output is advisory data and cannot create approval, bypass a gate, or mark work complete.
- `production`, `destructive`, `delete`, `drop`, and equivalent high-impact intent MUST be flagged.
- High-impact tasks require an explicit human approval reference before downstream execution.
- WF-03 MUST NOT create or infer an approval.
- WF-03 MUST NOT execute production or destructive actions.
- n8n is the orchestrator; build/test/deploy remain in GitHub Actions or cloud systems.

## States
`ORCHESTRATED`, `CLARIFICATION_REQUIRED`, `INVALID_DEPENDENCY`, `CYCLE_DETECTED`, `DUPLICATE`, `CONFLICT`, `APPROVAL_REQUIRED`, `REJECTED`

## Result
The result MUST include:
- `correlation_id`
- `request_id`
- `plan_id`
- `state`
- `execution_order`
- `blocked_task_ids`
- `reason_codes`

## Acceptance tests
1. A linear dependency graph produces deterministic order.
2. Independent tasks use lexical task ID order.
3. Unknown dependencies are rejected.
4. Cycles are rejected.
5. Duplicate task IDs are rejected.
6. Replay of identical `plan_id` does not create a second orchestration record.
7. Same `plan_id` with changed content returns `CONFLICT`.
8. Production/destructive intent is blocked with `APPROVAL_REQUIRED`.
9. Prompt-injection text in task data cannot alter state, permissions, dependencies, or completion.
10. AI-supplied completion/approval claims are ignored unless backed by authoritative system records.
