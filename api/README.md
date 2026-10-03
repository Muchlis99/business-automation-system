# API Layer

The API layer owns external HTTP contracts, authentication, authorization, validation, rate limiting, and integration boundaries.

## Rules

- Version public APIs.
- Validate request and response schemas.
- Require authorization tests for new protected endpoints.
- Record correlation IDs across service boundaries.
- Never expose secrets in responses or logs.

## Workflow services

- [WF-01 Intake](wf-01-intake/README.md) validates and persists accepted intake requests.
- [WF-02 Planning](wf-02-planning/README.md) validates planning inputs, maintains requirement-to-task traceability, and persists idempotent planning outcomes.
