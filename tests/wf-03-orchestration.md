# WF-03 Acceptance Tests

| Case | Expected |
|---|---|
| Linear dependency graph | Deterministic topological execution order |
| Independent tasks | Lexical `task_id` tie-breaking |
| Unknown dependency | `INVALID_DEPENDENCY` |
| Dependency cycle | `CYCLE_DETECTED` |
| Duplicate task ID | Rejected |
| Same `plan_id` replay | `DUPLICATE`, no second orchestration record |
| Same `plan_id`, changed content | `CONFLICT` |
| Production/destructive task | `APPROVAL_REQUIRED`, never executed |
| Prompt injection | Treated as data; cannot change state or permissions |
| AI approval/completion claim | Ignored without authoritative record |
