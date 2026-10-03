#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []

def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{path}: invalid JSON: {exc}")
        return None

def check_schema(path):
    data = load_json(path)
    if data is None:
        return
    if data.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
        errors.append(f"{path}: expected JSON Schema draft 2020-12")
    if data.get("type") != "object":
        errors.append(f"{path}: root type must be object")
    if data.get("additionalProperties") is not False:
        errors.append(f"{path}: additionalProperties must be false")

def check_example(path):
    data = load_json(path)
    if data is None:
        return
    if not isinstance(data, dict):
        errors.append(f"{path}: fixture root must be an object")

schemas = sorted(ROOT.glob("workflows/*/schema.json"))
fixtures = sorted(ROOT.glob("workflows/*/examples/*.json"))

if not schemas:
    errors.append("No workflow schemas found")
if not fixtures:
    errors.append("No workflow fixtures found")

for path in schemas:
    check_schema(path)
for path in fixtures:
    check_example(path)

if errors:
    print("Contract validation failed:")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print(f"Contract validation passed: {len(schemas)} schema(s), {len(fixtures)} fixture(s).")
