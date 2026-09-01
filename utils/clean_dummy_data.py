#!/usr/bin/env python3
"""
CRUK Dummy Data Schema Remediation Script
Applies 14 specific cleanup rules to dataset JSON files to ensure 100% compliance with CRUKv.1.0.0.json schema.
Does NOT modify files in situ. Outputs cleaned dataset JSONs to a specified output directory.
"""

import argparse
import datetime
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

# ROR API Cache
ROR_CACHE = {}


def fetch_ror_id(custodian_name):
    """
    Query ROR API v2 for custodian name, extract ROR ID string (e.g. '054225q67').
    Fallback to '054225q67' if lookup fails or returns no match.
    """
    if not custodian_name or not isinstance(custodian_name, str):
        return "054225q67"

    clean_name = custodian_name.strip()
    if clean_name in ROR_CACHE:
        return ROR_CACHE[clean_name]

    default_ror = "054225q67"
    try:
        encoded_query = urllib.parse.quote(clean_name)
        url = f"https://api.ror.org/v2/organizations?query={encoded_query}"
        req = urllib.request.Request(url, headers={"User-Agent": "CRUK-DataHub-Cleaner/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                items = data.get("items", [])
                if items:
                    ror_uri = items[0].get("id", "")
                    if ror_uri:
                        # Extract characters after last '/' (e.g., https://ror.org/054225q67 -> 054225q67)
                        ror_id = ror_uri.rstrip("/").split("/")[-1]
                        ROR_CACHE[clean_name] = ror_id
                        return ror_id
    except Exception:
        pass

    ROR_CACHE[clean_name] = default_ror
    return default_ror


def clean_dataset_json(raw_data, filename):
    notations = []
    now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # Determine root object vs wrapped meta_data_blob
    is_wrapped = False
    if "meta_data_blob" in raw_data or "metadata_blob" in raw_data:
        is_wrapped = True
        blob_key = "meta_data_blob" if "meta_data_blob" in raw_data else "metadata_blob"
        blob = raw_data[blob_key]
        if isinstance(blob, str):
            try:
                target_data = json.loads(blob)
            except Exception:
                target_data = blob
        elif isinstance(blob, dict):
            target_data = dict(blob)
        else:
            target_data = raw_data
    elif "metadata" in raw_data and isinstance(raw_data["metadata"], dict):
        is_wrapped = True
        blob_key = "metadata"
        target_data = dict(raw_data["metadata"])
    else:
        target_data = raw_data

    # Rule 1: Remove datasetid ONLY if present inside metadata_blob (leave outer database columns untouched)
    if isinstance(target_data, dict) and "datasetid" in target_data:
        del target_data["datasetid"]
        notations.append("[Rule 1] Removed 'datasetid' from metadata_blob")

    if isinstance(target_data, dict):
        # Rule 2: accessibility.usage remove
        if "accessibility" in target_data and isinstance(target_data["accessibility"], dict):
            if "usage" in target_data["accessibility"]:
                del target_data["accessibility"]["usage"]
                notations.append("[Rule 2] Removed 'accessibility.usage'")

        # Rule 3: enrichmentAndLinkage.publicationAboutDataset - extract DOI regex pattern
        if "enrichmentAndLinkage" in target_data and isinstance(target_data["enrichmentAndLinkage"], dict):
            enrichment = target_data["enrichmentAndLinkage"]
            if "publicationAboutDataset" in enrichment:
                pubs = enrichment["publicationAboutDataset"]
                doi_regex = re.compile(r"10\.\d{4,9}/[-._;()/:a-zA-Z0-9]+$")

                def clean_doi(val):
                    if not val or not isinstance(val, str):
                        return None
                    match = doi_regex.search(val.strip())
                    if match:
                        return match.group(0)
                    # If prefix present like https://doi.org/10.1016/...
                    idx = val.find("10.")
                    if idx != -1:
                        return val[idx:].strip()
                    return val.strip()

                if isinstance(pubs, list):
                    cleaned_pubs = [clean_doi(p) for p in pubs if clean_doi(p)]
                    enrichment["publicationAboutDataset"] = cleaned_pubs
                    notations.append(f"[Rule 3] Formatted publicationAboutDataset DOIs: {cleaned_pubs}")
                elif isinstance(pubs, str):
                    cleaned_pub = clean_doi(pubs)
                    enrichment["publicationAboutDataset"] = [cleaned_pub] if cleaned_pub else []
                    notations.append(f"[Rule 3] Formatted publicationAboutDataset DOI: {cleaned_pub}")

        # Rule 4 & 10 & 14: observations processing
        if "observations" in target_data and isinstance(target_data["observations"], list):
            valid_nodes = {"Persons", "Events", "Findings", "Number of scans per modality"}
            r4_count = 0
            r10_count = 0
            r14_count = 0

            for obs in target_data["observations"]:
                if isinstance(obs, dict):
                    # Rule 4: observationDate default 1000-01-01
                    if not obs.get("observationDate"):
                        obs["observationDate"] = "1000-01-01"
                        r4_count += 1

                    # Rule 10: observedNode validation & transfer
                    curr_node = obs.get("observedNode")
                    if curr_node not in valid_nodes:
                        if curr_node and not obs.get("measuredProperty"):
                            obs["measuredProperty"] = str(curr_node)
                        obs["observedNode"] = "Findings"
                        r10_count += 1

                    # Rule 14: measuredProperty default 'not given'
                    if not obs.get("measuredProperty"):
                        obs["measuredProperty"] = "not given"
                        r14_count += 1

            if r4_count:
                notations.append(f"[Rule 4] Set default '1000-01-01' on {r4_count} observationDate(s)")
            if r10_count:
                notations.append(f"[Rule 10] Moved non-standard observedNode text to measuredProperty on {r10_count} observation(s) -> set node to 'Findings'")
            if r14_count:
                notations.append(f"[Rule 14] Set default 'not given' on {r14_count} observations.measuredProperty field(s)")

        # Rule 5: Schema-driven string min/max length checks (remove empty strings < minLength, truncate > maxLength)
        STRING_BOUNDS = [
            ("summary.keywords", 2, 150),
            ("summary.title", 2, 150),
            ("summary.leadResearcher", 2, 150),
            ("summary.leadResearchInstitute", 2, 150),
            ("summary.abstract", 5, 500),
            ("documentation.description", 2, 10000),
            ("dataCustodian.name", 2, 150),
            ("dataCustodian.identifier", 2, 50),
            ("dataCustodian.description", 2, 10000),
            ("projectGrantScope", 5, 500),
            ("projectGrantName", 2, 150),
            ("leadResearcher", 2, 150),
            ("leadResearchInstitute", 2, 150),
            ("shortDescription", 2, 1000),
            ("otherDataTypes", 2, 1000),
            ("datasetAliases", 2, 1000),
            ("resourceCreator", 2, 1000),
            ("structuralMetadata", 1, 20000),
        ]

        def sanitize_strings(obj, parent_key=""):
            if isinstance(obj, dict):
                cleaned_dict = {}
                for k, v in obj.items():
                    full_k = f"{parent_key}.{k}" if parent_key else k
                    res = sanitize_strings(v, full_k)
                    if res is not None:
                        cleaned_dict[k] = res
                return cleaned_dict
            elif isinstance(obj, list):
                cleaned_list = []
                for item in obj:
                    res = sanitize_strings(item, parent_key)
                    if res is not None:
                        cleaned_list.append(res)
                return cleaned_list
            elif isinstance(obj, str):
                val = obj.strip()
                min_l, max_l = None, None
                for key_pat, mn, mx in STRING_BOUNDS:
                    if key_pat in parent_key:
                        min_l, max_l = mn, mx
                        break
                if min_l is None and max_l is None:
                    # Default string sanity: remove empty strings
                    if len(val) == 0:
                        return None
                    return val
                if min_l is not None and len(val) < min_l:
                    return None
                if max_l is not None and len(val) > max_l:
                    return val[:max_l]
                return val
            return obj

        target_data = sanitize_strings(target_data)
        notations.append("[Rule 5] Enforced schema string min/max length bounds across all string fields")

        # Rule 6: issued default now
        if not target_data.get("issued"):
            target_data["issued"] = now_iso
            notations.append(f"[Rule 6] Set default 'issued' timestamp: {now_iso}")

        # Rule 7: modified now
        target_data["modified"] = now_iso
        notations.append(f"[Rule 7] Updated 'modified' timestamp: {now_iso}")

        # Rule 8: revisions default [] (empty array)
        if not target_data.get("revisions") or target_data.get("revisions") == [None]:
            target_data["revisions"] = []
            notations.append("[Rule 8] Set 'revisions' default to [] (empty array)")

        # Rule 9 & 12: summary.dataCustodian processing
        if "summary" in target_data and isinstance(target_data["summary"], dict):
            summary = target_data["summary"]
            if "dataCustodian" not in summary or not isinstance(summary["dataCustodian"], dict):
                summary["dataCustodian"] = {}

            custodian = summary["dataCustodian"]
            custodian_name = custodian.get("name") or summary.get("publisher", {}).get("name") or "CRUK DataCustodian"
            custodian["name"] = custodian_name

            # Rule 9: dataCustodian.identifier from ROR API
            ror_id = fetch_ror_id(custodian_name)
            custodian["identifier"] = ror_id
            notations.append(f"[Rule 9] Set dataCustodian.identifier: '{ror_id}' (via ROR API lookup for '{custodian_name}')")

            # Rule 12: dataCustodian.contactPoint default 'not given'
            if not custodian.get("contactPoint"):
                custodian["contactPoint"] = "not given"
                notations.append("[Rule 12] Set default 'not given' for dataCustodian.contactPoint")

        # Rule 11: otherDataTypes processing (remove items missing 'title', set default format 'not given')
        if "otherDataTypes" in target_data and isinstance(target_data["otherDataTypes"], list):
            cleaned_odt = []
            removed_odt_count = 0
            r11_format_count = 0

            for item in target_data["otherDataTypes"]:
                if isinstance(item, dict):
                    # Delete items where 'title' is missing, None, or empty string
                    if not item.get("title") or not str(item.get("title")).strip():
                        removed_odt_count += 1
                        continue

                    if not item.get("format"):
                        item["format"] = "not given"
                        r11_format_count += 1

                    cleaned_odt.append(item)

            target_data["otherDataTypes"] = cleaned_odt

            if removed_odt_count:
                notations.append(f"[Rule 11] Removed {removed_odt_count} item(s) from otherDataTypes missing required 'title'")
            if r11_format_count:
                notations.append(f"[Rule 11] Set default 'not given' on {r11_format_count} otherDataTypes[].format field(s)")

        # Rule 13: accessibility.access.accessRights default 'not given'
        if "accessibility" in target_data and isinstance(target_data["accessibility"], dict):
            acc = target_data["accessibility"]
            if "access" not in acc or not isinstance(acc["access"], dict):
                acc["access"] = {}
            if not acc["access"].get("accessRights"):
                acc["access"]["accessRights"] = "not given"
                notations.append("[Rule 13] Set default 'not given' for accessibility.access.accessRights")

        # Ensure required top-level 'version' & 'identifier' exist
        if not target_data.get("version"):
            target_data["version"] = "1.0.0"
        if "identifier" not in target_data or not isinstance(target_data.get("identifier"), str):
            raw_id = target_data.get("identifier") or raw_data.get("identifier") or raw_data.get("datasetid") or raw_data.get("id") or "1"
            target_data["identifier"] = str(raw_id)

    # Re-wrap into raw_data structure if original was wrapped
    if is_wrapped:
        raw_data[blob_key] = target_data
        out_data = raw_data
    else:
        out_data = target_data

    return out_data, notations


def main():
    base_dir = Path(__file__).resolve().parent.parent
    default_input = base_dir / "utils" / "dummy_data"
    default_output = base_dir / "utils" / "cleaned_dummy_data"

    parser = argparse.ArgumentParser(
        description="Remediate CRUK dummy data JSON files for 100% schema compliance."
    )
    parser.add_argument(
        "input_dir",
        nargs="?",
        default=str(default_input),
        help=f"Input directory containing dummy data JSONs (default: {default_input})"
    )
    parser.add_argument(
        "output_dir",
        nargs="?",
        default=str(default_output),
        help=f"Output directory to save cleaned dataset JSONs (default: {default_output})"
    )

    parser.add_argument(
        "--notations", "-n",
        default=None,
        help="Optional file path to save a text report of all remediation notations."
    )

    args = parser.parse_args()

    input_path = Path(args.input_dir).resolve()
    output_path = Path(args.output_dir).resolve()
    notations_file = Path(args.notations).resolve() if args.notations else None

    if not input_path.exists() or not input_path.is_dir():
        print(f"Error: Input directory does not exist at {input_path}")
        sys.exit(1)

    output_path.mkdir(parents=True, exist_ok=True)

    dummy_files = sorted(input_path.glob("*.json"))
    if not dummy_files:
        print(f"No JSON files found in {input_path}")
        sys.exit(0)

    print("=" * 80)
    print("CRUK DUMMY DATA SCHEMA REMEDIATION PROCESS")
    print(f"Input Directory:  {input_path}")
    print(f"Output Directory: {output_path}")
    if notations_file:
        print(f"Notations Report: {notations_file}")
    print("=" * 80)

    notations_lines = []
    def log_note(msg=""):
        print(msg)
        notations_lines.append(msg)

    log_note("=" * 80)
    log_note("CRUK DUMMY DATA REMEDIATION NOTATIONS REPORT")
    log_note(f"Input Directory:  {input_path.name}")
    log_note(f"Output Directory: {output_path.name}")
    log_note("=" * 80)

    for filepath in dummy_files:
        filename = filepath.name
        with open(filepath, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        cleaned_data, notations = clean_dataset_json(raw_data, filename)

        out_filepath = output_path / filename
        with open(out_filepath, "w", encoding="utf-8") as f:
            json.dump(cleaned_data, f, indent=4)

        log_note(f"\n📄 File: {filename}")
        log_note("-" * 80)
        for note in notations:
            log_note(f"  ✓ {note}")
        log_note(f"  ➜ Saved to: {out_filepath.name}")

    log_note("\n" + "=" * 80)
    log_note(f"REMEDIATION COMPLETE: Processed {len(dummy_files)} files.")
    log_note(f"Cleaned datasets saved in: {output_path}")
    log_note("=" * 80)

    if notations_file:
        notations_file.parent.mkdir(parents=True, exist_ok=True)
        with open(notations_file, "w", encoding="utf-8") as f:
            f.write("\n".join(notations_lines) + "\n")
        print(f"\nNotations log successfully saved to: {notations_file}")


if __name__ == "__main__":
    main()
