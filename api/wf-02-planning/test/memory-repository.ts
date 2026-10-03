import type {
  NewPlanning,
  PersistedPlanning,
  PlanningRepository,
} from "../src/types.js";

export class MemoryPlanningRepository implements PlanningRepository {
  readonly records = new Map<string, PersistedPlanning>();

  async insertOrGet(record: NewPlanning): Promise<{
    kind: "inserted" | "existing";
    record: PersistedPlanning;
  }> {
    const existing = this.records.get(record.request_id);
    if (existing) return { kind: "existing", record: existing };

    const persisted: PersistedPlanning = {
      ...record,
      created_at: "2026-06-01T12:00:00.000Z",
    };
    this.records.set(record.request_id, persisted);
    return { kind: "inserted", record: persisted };
  }
}
