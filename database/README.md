# Database

PostgreSQL is the primary transactional data store.

## Principles

- Migrations are version-controlled and executed outside n8n.
- Schema changes are reviewed through CI.
- Destructive migrations require explicit approval and backup evidence.
- Audit history is append-oriented and protected from application mutation.
- Query plans, indexes, N+1 patterns, row-level security, and migration safety are part of database QA.

## WF-01 Intake

`migrations/001_wf_01_intake.sql` creates the durable intake table and unique `request_id` constraint used for replay detection. Apply it with `npm run migrate` from `api/wf-01-intake` after setting `DATABASE_URL`; the migration is run by the service deployment process, never by n8n.
