# Contributing

## Branching

All changes must be developed away from `main`.

Recommended branch names:

- `feature/<short-name>`
- `fix/<short-name>`
- `refactor/<short-name>`
- `chore/<short-name>`
- `hotfix/<short-name>`

## Change flow

1. Start from the latest `main`.
2. Create a focused branch.
3. Make small, logically grouped commits.
4. Push the branch to GitHub.
5. Open a Pull Request into `main`.
6. Let GitHub Actions run the required checks.
7. Review the diff, CI result, security implications, and acceptance criteria.
8. Merge only after the required human review.
9. Delete the feature branch after merge when it is no longer needed.

## Commit conventions

Use Conventional Commits:

- `feat:` new capability
- `fix:` bug fix
- `refactor:` code restructuring without behavior change
- `docs:` documentation only
- `test:` tests
- `chore:` maintenance
- `ci:` CI/CD changes
- `security:` security-related changes

Keep each commit coherent and reversible.

## Safety rules

- Never commit credentials, tokens, private keys, or production secrets.
- n8n remains an orchestrator; build, test, security scanning, and deployment run in CI/cloud.
- AI output is advisory and untrusted.
- Production deployment and destructive operations require explicit human approval.
- Do not bypass failed CI or security gates without a documented, authorized exception.

## Pull Request expectations

A PR should explain:

- What changed.
- Why it changed.
- How it was tested.
- Which workflows, APIs, database objects, or infrastructure are affected.
- Security and data-impact considerations.
- Any migration or rollback considerations.
- Evidence for acceptance criteria.

Keep PRs focused so review remains deterministic.
