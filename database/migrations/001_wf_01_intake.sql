CREATE TABLE IF NOT EXISTS wf01_intake_requests (
    request_id TEXT PRIMARY KEY CHECK (char_length(request_id) BETWEEN 1 AND 128),
    canonical_payload JSONB NOT NULL CHECK (jsonb_typeof(canonical_payload) = 'object'),
    payload_hash CHAR(64) NOT NULL CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
    human_review_required BOOLEAN NOT NULL,
    approval_status TEXT NOT NULL CHECK (
        approval_status IN ('not_required', 'pending_human_review')
    ),
    reason_codes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        (human_review_required AND approval_status = 'pending_human_review')
        OR
        (NOT human_review_required AND approval_status = 'not_required')
    )
);

CREATE INDEX IF NOT EXISTS wf01_intake_created_at_idx
    ON wf01_intake_requests (created_at DESC);
