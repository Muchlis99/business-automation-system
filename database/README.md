# Database

PostgreSQL is the primary transactional data store.

## Principles

- Migrations are version-controlled and executed outside n8n.
- Schema changes are reviewed through CI.
- Destructive migrations require explicit approval and backup evidence.
- Audit history is append-oriented and protected from application mutation.
- Query plans, indexes, N+1 patterns, row-level security, and migration safety are part of database QA.
