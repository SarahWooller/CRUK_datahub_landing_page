import json
import os
import re

from mapping_utils import resolve_labels_to_objects

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)

SCHEMA_PATH = os.path.join(PROJECT_ROOT, "schemas", "schema_complex_1.1.2.json")
FILTER_DATA_PATH = os.path.join(PROJECT_ROOT, "longer_filter_data.json")
LABEL_KEY_DICT_PATH = os.path.join(PROJECT_ROOT, "label_key_dict.json")

with open(SCHEMA_PATH, encoding="utf-8") as f:
    schema = json.load(f)

with open(LABEL_KEY_DICT_PATH, encoding="utf-8") as f:
    label_key_dict = json.load(f)

with open(FILTER_DATA_PATH, encoding="utf-8") as f:
    filter_data = json.load(f)


COMPLEX_SECTIONS = [
    "histology_driven_mappings",
    "umbrella_or_special_mappings",
    "multi_site_or_overlap_mappings",
]


def extract_histology_code(histology_text):
    if histology_text is None:
        return None

    histology_text = histology_text.strip()
    match = re.match(r"^(\d{4}/\d)", histology_text)
    return match.group(1) if match else histology_text


def extract_topography_code(label_text):
    if label_text is None:
        return None

    label_text = label_text.strip()
    match = re.match(r"^(C\d{2})(?:\.\d)?", label_text, re.IGNORECASE)
    return match.group(1).upper() if match else None


def topography_matches(term, allowed_topographies):
    input_code = extract_topography_code(term.get("label", ""))
    if input_code is None:
        return False

    return any(
        extract_topography_code(topo) == input_code
        for topo in allowed_topographies
    )


def topography_in_group(term, topography_codes):
    input_code = extract_topography_code(term.get("label", ""))
    if input_code is None:
        return False

    input_match = re.match(r"^C(\d{2})$", input_code)
    if not input_match:
        return False

    input_num = int(input_match.group(1))

    for item in topography_codes:
        item = item.strip()
        range_match = re.match(r"^(C\d{2})-(C\d{2})$", item, re.IGNORECASE)

        if range_match:
            start_num = int(range_match.group(1)[1:])
            end_num = int(range_match.group(2)[1:])

            if start_num <= input_num <= end_num:
                return True

        elif extract_topography_code(item) == input_code:
            return True

    return False


def histology_matches(histology_text, allowed_histology_codes):
    input_code = extract_histology_code(histology_text)
    if input_code is None:
        return False

    return input_code in allowed_histology_codes


def rule_matches(term, histology_text, rule):
    match_type = rule.get("match_type")

    if match_type == "histology_exact":
        return histology_matches(histology_text, rule.get("histology_codes", []))

    if match_type == "topography_exact":
        return topography_matches(term, rule.get("topography", []))

    if match_type == "topography_group":
        return topography_in_group(term, rule.get("topography_codes", []))

    if match_type == "topography_and_histology":
        return (
            topography_matches(term, rule.get("topography", []))
            and histology_matches(histology_text, rule.get("histology_codes", []))
        )

    if match_type == "topography_group_and_histology":
        return (
            topography_in_group(term, rule.get("topography_codes", []))
            and histology_matches(histology_text, rule.get("histology_codes", []))
        )

    return False


def rule_is_potentially_relevant(term, histology_text, rule):
    match_type = rule.get("match_type")

    if match_type == "histology_exact":
        return histology_matches(histology_text, rule.get("histology_codes", []))

    if match_type == "topography_exact":
        return topography_matches(term, rule.get("topography", []))

    if match_type == "topography_group":
        return topography_in_group(term, rule.get("topography_codes", []))

    if match_type == "topography_and_histology":
        return topography_matches(term, rule.get("topography", []))

    if match_type == "topography_group_and_histology":
        return topography_in_group(term, rule.get("topography_codes", []))

    return False


def resolve_rule_outputs(rule):
    cruk_objects = resolve_labels_to_objects(
        rule.get("cruk", []) or [],
        label_key_dict,
        filter_data,
    )
    tcga_objects = resolve_labels_to_objects(
        rule.get("tcga", []) or [],
        label_key_dict,
        filter_data,
    )

    return cruk_objects, tcga_objects


def get_complex_mapped_terms(input_term, histology_text=None):
    if histology_text is not None:
        histology_text = histology_text.strip()

    for section_name in COMPLEX_SECTIONS:
        section = schema.get(section_name, {})

        for schema_term, mapping in section.items():
            for rule in mapping.get("rules", []):
                if rule_matches(input_term, histology_text, rule):
                    cruk_objects, tcga_objects = resolve_rule_outputs(rule)
                    return schema_term, rule.get("rule_name"), cruk_objects, tcga_objects

    for section_name in COMPLEX_SECTIONS:
        section = schema.get(section_name, {})

        for schema_term, mapping in section.items():
            rules = mapping.get("rules", [])

            if any(
                rule_is_potentially_relevant(input_term, histology_text, rule)
                for rule in rules
            ):
                fallback = mapping.get("fallback", {})
                cruk_objects, tcga_objects = resolve_rule_outputs(fallback)
                return schema_term, "fallback", cruk_objects, tcga_objects

    return None, None, [], []

