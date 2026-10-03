#!/usr/bin/env python3
"""Check positive and explicitly schema-invalid fixtures for each workflow.

Schema-negative fixtures use the ``schema-invalid-*.json`` filename pattern.
Examples of semantic failures (such as unknown task dependencies) remain separate,
since JSON Schema does not express those cross-record workflow rules.
"""

import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]


def fixture_errors(validator, fixture_path):
    instance = json.loads(fixture_path.read_text(encoding="utf-8"))
    return sorted(
        validator.iter_errors(instance),
        key=lambda error: (list(map(str, error.absolute_path)), error.message),
    )


def main():
    schema_paths = sorted(ROOT.glob("workflows/*/schema.json"))
    failures = []
    positive_count = 0
    negative_count = 0

    if not schema_paths:
        failures.append("No workflow schemas found")

    for schema_path in schema_paths:
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
        validator = Draft202012Validator(schema)
        positive_fixtures = sorted(schema_path.parent.glob("examples/valid*.json"))
        negative_fixtures = sorted(
            schema_path.parent.glob("examples/schema-invalid-*.json")
        )

        if not positive_fixtures:
            failures.append(f"{schema_path}: missing examples/valid*.json")
        if not negative_fixtures:
            failures.append(f"{schema_path}: missing examples/schema-invalid-*.json")

        for fixture_path in positive_fixtures:
            errors = fixture_errors(validator, fixture_path)
            if errors:
                for error in errors:
                    failures.append(
                        f"{fixture_path}: unexpected schema error: {error.message}"
                    )
            else:
                positive_count += 1
                print(f"OK {fixture_path} matches {schema_path}")

        for fixture_path in negative_fixtures:
            errors = fixture_errors(validator, fixture_path)
            if not errors:
                failures.append(
                    f"{fixture_path}: expected rejection by {schema_path}, "
                    "but it was accepted"
                )
            else:
                negative_count += 1
                print(f"OK {fixture_path} is rejected by {schema_path}")

    if failures:
        print("Schema fixture validation failed:")
        for failure in failures:
            print(f"- {failure}")
        raise SystemExit(1)

    print(
        "Schema fixture validation passed: "
        f"{len(schema_paths)} schema(s), {positive_count} positive fixture(s), "
        f"{negative_count} rejected negative fixture(s)."
    )


if __name__ == "__main__":
    main()
