#!/usr/bin/env python3
"""
CRUK Schema Validation Script
Validates dummy dataset files in utils/dummy_data/*.json against src/utils/CRUKv.1.0.0.json.
Output Format: Option A (Grouped by Dataset File)
"""

import argparse
import json
import os
import glob
import sys
from pathlib import Path

try:
    import jsonschema
except ImportError:
    print("Error: 'jsonschema' python package is required. Install via: pip install jsonschema")
    sys.exit(1)


def unwrap_error(err):
    """
    Recursively unwrap jsonschema errors to find the specific leaf validation failure,
    ignoring generic anyOf/oneOf container messages and 'type: null' branches.
    """
    if not err.context:
        return err
    
    # Filter out 'is not of type null' noise from nullable schema branches
    meaningful = [e for e in err.context if not (e.validator == 'type' and e.validator_value == 'null')]
    if meaningful:
        return unwrap_error(meaningful[0])
    return unwrap_error(err.context[0])


def format_path(path_iterable):
    if not path_iterable:
        return "(root)"
    result = []
    for item in path_iterable:
        if isinstance(item, int):
            result.append(f"[{item}]")
        else:
            if result and not result[-1].endswith("]"):
                result.append(f".{item}")
            else:
                result.append(str(item))
    return "".join(result)


def categorize_and_format_error(raw_err):
    err = unwrap_error(raw_err)
    validator = err.validator
    path_str = format_path(err.absolute_path)

    if validator == "additionalProperties":
        return {
            "title": "⚠️  UNEXPECTED PROPERTY (Not in Schema)",
            "cat_key": "unexpected",
            "path": path_str,
            "detail": err.message
        }

    elif validator == "required":
        return {
            "title": "🚫 MISSING REQUIRED PROPERTY",
            "cat_key": "required",
            "path": path_str,
            "detail": err.message
        }

    elif validator == "enum":
        allowed = err.validator_value
        found_val = json.dumps(err.instance)
        if len(found_val) > 70:
            found_val = found_val[:67] + "..."
        return {
            "title": "🔤 INVALID ENUM VALUE",
            "cat_key": "enum",
            "path": path_str,
            "expected": f"One of {allowed}",
            "found": found_val
        }

    elif validator == "maxLength":
        found_val = json.dumps(err.instance)
        if len(found_val) > 70:
            found_val = found_val[:67] + "..."
        return {
            "title": "❌ STRING EXCEEDS MAXIMUM LENGTH (maxLength)",
            "cat_key": "format",
            "path": path_str,
            "expected": f"Maximum length of {err.validator_value} characters",
            "found": f"String length {len(err.instance)}: {found_val}"
        }

    elif validator == "minLength":
        found_val = json.dumps(err.instance)
        if len(found_val) > 70:
            found_val = found_val[:67] + "..."
        return {
            "title": "❌ STRING BELOW MINIMUM LENGTH (minLength)",
            "cat_key": "format",
            "path": path_str,
            "expected": f"Minimum length of {err.validator_value} characters",
            "found": f"String length {len(err.instance)}: {found_val}"
        }

    elif validator in ("pattern", "type", "format"):
        found_val = json.dumps(err.instance)
        if len(found_val) > 70:
            found_val = found_val[:67] + "..."
        return {
            "title": "❌ FORMAT / TYPE MISMATCH",
            "cat_key": "format",
            "path": path_str,
            "expected": f"Rule '{validator}' matching {json.dumps(err.validator_value)}",
            "found": found_val
        }

    else:
        found_val = json.dumps(err.instance)
        if len(found_val) > 70:
            found_val = found_val[:67] + "..."
        return {
            "title": f"❌ FORMAT / SCHEMA MISMATCH ({validator})",
            "cat_key": "format",
            "path": path_str,
            "expected": f"Schema rule '{validator}': {err.message}",
            "found": found_val
        }


def main():
    base_dir = Path(__file__).resolve().parent.parent
    default_schema = base_dir / "src" / "utils" / "CRUKv.1.0.0.json"
    default_input = base_dir / "utils" / "dummy_data"
    default_output = base_dir / "utils" / "validated.txt"

    parser = argparse.ArgumentParser(
        description="Validate JSON dummy dataset files against CRUKv.1.0.0.json schema."
    )
    parser.add_argument(
        "input_dir",
        nargs="?",
        default=str(default_input),
        help=f"Path to input directory containing JSON files (default: {default_input})"
    )
    parser.add_argument(
        "output_file",
        nargs="?",
        default=str(default_output),
        help=f"Path to output report text file (default: {default_output})"
    )
    parser.add_argument(
        "--schema", "-s",
        default=str(default_schema),
        help=f"Path to CRUK JSON schema file (default: {default_schema})"
    )

    args = parser.parse_args()

    dummy_dir = Path(args.input_dir).resolve()
    output_file = Path(args.output_file).resolve()
    schema_file = Path(args.schema).resolve()

    if not schema_file.exists():
        print(f"Error: Schema file not found at {schema_file}")
        sys.exit(1)

    if not dummy_dir.exists() or not dummy_dir.is_dir():
        print(f"Error: Dummy data input directory not found or is not a directory at {dummy_dir}")
        sys.exit(1)

    with open(schema_file, "r", encoding="utf-8") as f:
        schema = json.load(f)

    validator = jsonschema.Draft202012Validator(schema)
    dummy_files = sorted(dummy_dir.glob("*.json"))

    if not dummy_files:
        print(f"No JSON dummy files found in {dummy_dir}")
        sys.exit(0)

    output_lines = []

    def log(msg=""):
        output_lines.append(msg)

    try:
        rel_input = dummy_dir.relative_to(base_dir)
    except ValueError:
        rel_input = dummy_dir

    log("=" * 80)
    log(f"CRUK SCHEMA VALIDATION REPORT: {rel_input}")
    log(f"Schema Version File: {schema_file.name}")
    log("=" * 80)

    files_checked = len(dummy_files)
    files_with_issues = 0
    total_issues = 0

    category_counts = {
        "format": 0,
        "unexpected": 0,
        "enum": 0,
        "required": 0
    }

    for filepath in dummy_files:
        filename = filepath.name
        with open(filepath, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        # Apply schema strictly to the meta_data_blob (or metadata_blob / metadata) key and ignore all other top-level keys (id, datasetid, active, status, etc.)
        blob = raw_data.get("meta_data_blob")
        if blob is None:
            blob = raw_data.get("metadata_blob")
        if blob is None:
            blob = raw_data.get("metadata")

        if blob is not None:
            if isinstance(blob, str):
                try:
                    target_data = json.loads(blob)
                except Exception:
                    target_data = blob
            elif isinstance(blob, dict):
                target_data = dict(blob)
            else:
                target_data = blob
        else:
            target_data = raw_data

        if isinstance(target_data, dict):
            if "identifier" not in target_data:
                if "identifier" in raw_data:
                    target_data["identifier"] = str(raw_data["identifier"])
                elif "datasetid" in raw_data:
                    target_data["identifier"] = str(raw_data["datasetid"])

        errors = list(validator.iter_errors(target_data))
        if not errors:
            continue

        files_with_issues += 1
        total_issues += len(errors)

        log(f"\n📄 File: {filename} ({len(errors)} Issue{'s' if len(errors) != 1 else ''} Found)")
        log("-" * 80)

        for idx, err in enumerate(errors, 1):
            info = categorize_and_format_error(err)
            category_counts[info["cat_key"]] += 1

            log(f"  [{idx}] {info['title']}")
            log(f"      Path:     {info['path']}")
            if "detail" in info:
                log(f"      Detail:   {info['detail']}")
            if "expected" in info:
                log(f"      Expected: {info['expected']}")
            if "found" in info:
                log(f"      Found:    {info['found']}")
            log()

    log("=" * 80)
    log("SUMMARY TOTALS")
    log("-" * 80)
    log(f"Files Checked:            {files_checked}")
    log(f"Files with Issues:        {files_with_issues}")
    log(f"Total Issues Identified:  {total_issues}")
    log(f"  - Format/Type Mismatches: {category_counts['format']}")
    log(f"  - Unexpected Terms:       {category_counts['unexpected']}")
    log(f"  - Invalid Enum Values:    {category_counts['enum']}")
    log(f"  - Missing Required:       {category_counts['required']}")
    log("=" * 80)

    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(output_lines) + "\n")

    try:
        rel_output = output_file.relative_to(base_dir)
    except ValueError:
        rel_output = output_file

    print(f"Validation complete. Report saved to: {rel_output}")


if __name__ == "__main__":
    main()
