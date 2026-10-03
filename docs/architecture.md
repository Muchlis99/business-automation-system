# Architecture

## Principles

1. n8n is the orchestration layer, not the build/test/deploy engine.
2. GitHub Actions and cloud infrastructure execute deterministic CI/CD work.
3. AI provides recommendations; it does not autonomously approve high-impact actions.
4. Production deployments and destructive data operations require human approval.
5. Every workflow execution should be traceable with a correlation ID and audit record.

## Environments

- dev — development and integration testing
- staging — production-like validation
- prod — controlled production workloads

Each environment should use separate credentials, encryption keys, webhook URLs, and infrastructure resources.

## Runtime

Production n8n uses queue mode with a main process and workers. PostgreSQL is the system database and Redis provides queueing where required. Execution pruning is enabled to control operational storage.

## Data and audit

Core operational tables include audit_logs, approvals, approvers, dead_letter, prompt_registry, and guard_task_done. Additional domains include deployments, incidents, and security findings.

## Workflow contract

Workflows should initialize a correlation_id, validate inputs, perform deterministic checks, record audit events, and route failures to the global error handler. Secrets and credentials must never be committed to workflow exports.
