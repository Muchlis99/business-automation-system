import type {
  NewOrchestration,
  OrchestrationRepository,
  PersistedOrchestration,
} from "../src/types.js";

export class MemoryOrchestrationRepository implements OrchestrationRepository {
  readonly records = new Map<string, PersistedOrchestration>();

  async insertOrGet(record: NewOrchestration): Promise<{
    kind: "inserted" | "existing";
    record: PersistedOrchestration;
  }> {
    const existing = this.records.get(record.plan_id);
    if (existing) return { kind: "existing", record: existing };

    const persisted: PersistedOrchestration = {
      ...record,
      created_at: "2026-06-01T12:00:00.000Z",
    };
    this.records.set(record.plan_id, persisted);
    return { kind: "inserted", record: persisted };
  }
}
