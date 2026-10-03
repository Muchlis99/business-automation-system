import type { Pool, QueryResultRow } from "pg";
import type {
  ApprovalStatus,
  IntakeRepository,
  NewIntake,
  PersistedIntake,
} from "./types.js";

interface IntakeRow extends QueryResultRow {
  request_id: string;
  canonical_payload: PersistedIntake["canonical_payload"];
  payload_hash: string;
  human_review_required: boolean;
  approval_status: ApprovalStatus;
  reason_codes: string[];
  created_at: Date | string;
}

function mapRow(row: IntakeRow): PersistedIntake {
  return {
    request_id: row.request_id,
    canonical_payload: row.canonical_payload,
    payload_hash: row.payload_hash.trim(),
    human_review_required: row.human_review_required,
    approval_status: row.approval_status,
    reason_codes: row.reason_codes,
    created_at: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString(),
  };
}

export class PostgresIntakeRepository implements IntakeRepository {
  constructor(private readonly pool: Pool) {}

  async insertOrGet(record: NewIntake): Promise<{
    kind: "inserted" | "existing";
    record: PersistedIntake;
  }> {
    const inserted = await this.pool.query<IntakeRow>(
      `INSERT INTO wf01_intake_requests (
         request_id,
         canonical_payload,
         payload_hash,
         human_review_required,
         approval_status,
         reason_codes
       )
       VALUES ($1, $2::jsonb, $3, $4, $5, $6)
       ON CONFLICT (request_id) DO NOTHING
       RETURNING request_id, canonical_payload, payload_hash,
                 human_review_required, approval_status, reason_codes, created_at`,
      [
        record.request_id,
        JSON.stringify(record.canonical_payload),
        record.payload_hash,
        record.human_review_required,
        record.approval_status,
        record.reason_codes,
      ],
    );

    if (inserted.rows[0]) {
      return { kind: "inserted", record: mapRow(inserted.rows[0]) };
    }

    const existing = await this.pool.query<IntakeRow>(
      `SELECT request_id, canonical_payload, payload_hash,
              human_review_required, approval_status, reason_codes, created_at
       FROM wf01_intake_requests
       WHERE request_id = $1`,
      [record.request_id],
    );

    if (!existing.rows[0]) {
      throw new Error("WF-01 insert conflict occurred but the existing intake row was not found");
    }

    return { kind: "existing", record: mapRow(existing.rows[0]) };
  }
}
