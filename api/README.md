# API Layer

The API layer owns external HTTP contracts, authentication, authorization, validation, rate limiting, and integration boundaries.

## Rules

- Version public APIs.
- Validate request and response schemas.
- Require authorization tests for new protected endpoints.
- Record correlation IDs across service boundaries.
- Never expose secrets in responses or logs.
