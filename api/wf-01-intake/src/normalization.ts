export function normalizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.normalize("NFKC").replace(/\r\n?/g, "\n").trim();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([key, item]) => [key, normalizeValue(item)] as const);
    return Object.fromEntries(entries);
  }

  return value;
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}
