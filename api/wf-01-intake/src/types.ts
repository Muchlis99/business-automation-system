export const INTAKE_STATES = [
  "ACCEPTED",
  "CLARIFICATION_REQUIRED",
  "DUPLICATE",
  "CONFLICT",
  "REJECTED",
] as const;

export type IntakeState = (typeof INTAKE_STATES)[number];
export type ApprovalStatus = "not_required" | "pending_human_review";

export interface IntakeRequest {
  request_id: string;
  title: string;
  requester: string;
  description: string;
  source?: "manual" | "api" | "webhook" | "n8n";
  priority?: "P1" | "P2" | "P3" | "P4";
  repository?: string;
  acceptance_criteria?: string[];
  constraints?: string[];
}

export interface FieldViolation {
  path: string;
  message: string;
}

export interface IntakeResponse {
  correlation_id: string;
  request_id: string | null;
  state: IntakeState;
  reason_codes: string[];
  created_at: string;
  human_review_required: boolean;
  approval_status: ApprovalStatus;
  execution_permitted: false;
  missing_fields?: string[];
  validation_errors?: FieldViolation[];
}

export interface PersistedIntake {
  request_id: string;
  canonical_payload: IntakeRequest;
  payload_hash: string;
  human_review_required: boolean;
  approval_status: ApprovalStatus;
  reason_codes: string[];
  created_at: string;
}

export type NewIntake = Omit<PersistedIntake, "created_at">;

export interface IntakeRepository {
  insertOrGet(record: NewIntake): Promise<{
    kind: "inserted" | "existing";
    record: PersistedIntake;
  }>;
}
