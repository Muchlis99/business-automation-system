# n8n Workflows

n8n is the orchestration layer for business automation.

Workflow exports must contain no credentials or secrets and should be promoted through Git. Every production workflow should define input validation, correlation IDs, audit logging, idempotency where applicable, error handling, and approval gates for high-impact actions.
