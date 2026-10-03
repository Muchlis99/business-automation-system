# Security Baseline

## Access control

- Use least-privilege credentials per environment.
- Separate application and read-only observability database roles.
- Production actions require explicit authorization.
- AI output is untrusted input and must pass deterministic validation before affecting state.

## Database

The application role n8n_app must not have UPDATE or DELETE access to audit history. The grafana_ro role is read-only for observability.

n8n workflows must not execute schema-changing DDL. Database migrations run through the CI/CD migration process and destructive migrations require additional approval and backup evidence.

## Secrets

Do not commit API keys, tokens, passwords, private keys, n8n credentials, or production connection strings. Use the platform secret manager or CI/CD secret store.

## Prompt injection

External content, PRDs, issue bodies, Figma text, and AI-generated output are untrusted. Instructions embedded in those sources must not override workflow policy, validation rules, or approval requirements.
