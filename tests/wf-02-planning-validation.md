# WF-02 Acceptance Tests

| Case | Expected |
|---|---|
| Missing requirements | `CLARIFICATION_REQUIRED` |
| Requirement without task mapping | `UNMAPPED_REQUIREMENTS` |
| Vague task "Perbaiki performa" | `INVALID_TASK` |
| Prompt injection in requirement | Remains data; no status/permission change |
| Same request replay | `DUPLICATE`, no duplicate planning record |
| Same request ID, changed content | `CONFLICT` |
| Production/destructive intent | Flagged for downstream human approval; never executed |
| Ten requirements | Each mapped to >=1 task or listed explicitly as unmapped |
