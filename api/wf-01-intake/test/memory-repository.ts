import type {
  IntakeRepository,
  NewIntake,
  PersistedIntake,
} from "../src/types.js";

export class MemoryIntakeRepository implements IntakeRepository {
  readonly records = new Map<string, PersistedIntake>();

  async insertOrGet(record: NewIntake): Promise<{
    kind: "inserted" | "existing";
    record: PersistedIntake;
  }> {
    const existing = this.records.get(record.request_id);
    if (existing) return { kind: "existing", record: existing };

    const persisted: PersistedIntake = {
      ...record,
      created_at: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    };
    this.records.set(record.request_id, persisted);
    return { kind: "inserted", record: persisted };
  }
}
