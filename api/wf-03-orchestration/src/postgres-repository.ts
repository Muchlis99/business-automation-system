import type { Pool, QueryResultRow } from "pg";
import type {
  NewOrchestration,
  OrchestrationInput,
  OrchestrationRepository,
  PersistedOrchestration,
  PersistedOrchestrationState,
} from "./types.js";

interface OrchestrationRow extends QueryResultRow {
  request_id: string;
  plan_id: string;
  canonical_payload: OrchestrationInput;
  payload_hash: string;
  state: PersistedOrchestrationState;
  execution_order: string[];
  blocked_task_ids: string[];
  reason_codes: string[];
  created_at: Date | string;
}

function mapRow(row: OrchestrationRow): PersistedOrchestration {
  return {
    request_id: row.request_id,
    plan_id: row.plan_id,
    canonical_payload: row.canonical_payload,
    payload_hash: row.payload_hash.trim(),
    state: row.state,
    execution_order: row.execution_order,
    blocked_task_ids: row.blocked_task_ids,
    reason_codes: row.reason_codes,
    created_at: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString(),
  };
}

export class PostgresOrchestrationRepository implements OrchestrationRepository {
  constructor(private readonly pool: Pool) {}

  async insertOrGet(record: NewOrchestration): Promise<{
    kind: "inserted" | "existing";
    record: PersistedOrchestration;
  }> {
    const inserted = await this.pool.query<OrchestrationRow>(
      `INSERT INTO wf03_orchestrations (
         plan_id,
         request_id,
         canonical_payload,
         payload_hash,
         state,
         execution_order,
         blocked_task_ids,
         reason_codes
       )
       VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8)
       ON CONFLICT (plan_id) DO NOTHING
       RETURNING request_id, plan_id, canonical_payload, payload_hash, state,
                 execution_order, blocked_task_ids, reason_codes, created_at`,
      [
        record.plan_id,
        record.request_id,
        JSON.stringify(record.canonical_payload),
        record.payload_hash,
        record.state,
        record.execution_order,
        record.blocked_task_ids,
        record.reason_codes,
      ],
    );

    if (inserted.rows[0]) {
      return { kind: "inserted", record: mapRow(inserted.rows[0]) };
    }

    const existing = await this.pool.query<OrchestrationRow>(
      `SELECT request_id, plan_id, canonical_payload, payload_hash, state,
              execution_order, blocked_task_ids, reason_codes, created_at
       FROM wf03_orchestrations
       WHERE plan_id = $1`,
      [record.plan_id],
    );

    if (!existing.rows[0]) {
      throw new Error("WF-03 insert conflict occurred but the existing orchestration row was not found");
    }

    return { kind: "existing", record: mapRow(existing.rows[0]) };
  }
}
