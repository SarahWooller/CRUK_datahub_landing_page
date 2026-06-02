import json
import os

from mapping_utils import resolve_labels_to_objects

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)

SCHEMA_PATH = os.path.join(PROJECT_ROOT, "schemas", "schema_special_1.1.2.json")
FILTER_DATA_PATH = os.path.join(PROJECT_ROOT, "longer_filter_data.json")
LABEL_KEY_DICT_PATH = os.path.join(PROJECT_ROOT, "label_key_dict.json")

with open(SCHEMA_PATH, encoding="utf-8") as f:
    schema = json.load(f)

with open(LABEL_KEY_DICT_PATH, encoding="utf-8") as f:
    label_key_dict = json.load(f)

with open(FILTER_DATA_PATH, encoding="utf-8") as f:
    filter_data = json.load(f)

special_rules = schema["special_rules"]


def normalise_label(value):
    if value is None:
        return ""
    return value.strip()


def get_icdo_prefix(label):
    label = normalise_label(label)

    if not label:
        return None

    first_part = label.split()[0]

    if first_part.startswith("C"):
        return first_part.split(".")[0]

    return None


def topography_matches(input_topography, schema_topographies):
    input_topography = normalise_label(input_topography)

    if input_topography in schema_topographies:
        return True

    input_prefix = get_icdo_prefix(input_topography)

    if input_prefix:
        for schema_topography in schema_topographies:
            schema_prefix = get_icdo_prefix(schema_topography)
            if schema_prefix == input_prefix:
                return True

    return False


def extract_input_labels(dataset_filters):
    cruk_label = None
    topography_label = None
    histology_label = None

    for item in dataset_filters:
        category = item.get("category")
        label = item.get("label")

        if category == "crukTerms" and cruk_label is None and not item.get("isGenerated"):
            cruk_label = label

        elif category == "icdOTopography" and topography_label is None:
            topography_label = label

        elif category in {"icdOHistology", "icdOMorphology", "histology"} and histology_label is None:
            histology_label = label

    return cruk_label, topography_label, histology_label


def rule_matches(rule, cruk_label, topography_label, histology_label):
    match_type = rule.get("match_type")

    cruk_label = normalise_label(cruk_label)
    topography_label = normalise_label(topography_label)
    histology_label = normalise_label(histology_label)

    if match_type == "cruk_label":
        return cruk_label == normalise_label(rule.get("cruk_label"))

    if match_type == "histology_exact":
        return histology_label in rule.get("histology_exact", [])

    if match_type == "topography_exact":
        return topography_matches(
            topography_label,
            rule.get("topography_exact", [])
        )

    if match_type == "topography_exact_and_histology_exact":
        return (
            topography_matches(topography_label, rule.get("topography_exact", []))
            and histology_label in rule.get("histology_exact", [])
        )

    return False


def get_matching_special_rules(cruk_label, topography_label, histology_label):
    matches = []

    for rule in special_rules:
        if rule_matches(rule, cruk_label, topography_label, histology_label):
            matches.append(rule)

    return matches


def get_return_labels(matched_rules, output_key):
    return_labels = []
    seen_labels = set()

    for rule in matched_rules:
        for label in rule.get(output_key, []):
            normalised = normalise_label(label)
            if normalised and normalised not in seen_labels:
                return_labels.append(normalised)
                seen_labels.add(normalised)

    return return_labels


def get_missing_labels_from_label_key_dict(labels, label_dict):
    missing_labels = []

    for label in labels:
        if label not in label_dict:
            missing_labels.append(label)

    return missing_labels


def map_special_cruk_terms(dataset_filters):
    cruk_label, topography_label, histology_label = extract_input_labels(dataset_filters)

    matched_rules = get_matching_special_rules(
        cruk_label,
        topography_label,
        histology_label
    )

    return_cruk_labels = get_return_labels(matched_rules, "return_CRUK")
    return_tcga_labels = get_return_labels(matched_rules, "return_TCGA")

    missing_labels_in_label_key_dict = get_missing_labels_from_label_key_dict(
        return_cruk_labels + return_tcga_labels,
        label_key_dict
    )

    resolved_cruk_objects = resolve_labels_to_objects(
        return_cruk_labels,
        label_key_dict,
        filter_data
    )

    resolved_tcga_objects = resolve_labels_to_objects(
        return_tcga_labels,
        label_key_dict,
        filter_data
    )

    resolved_labels = {
        obj.get("label")
        for obj in resolved_cruk_objects + resolved_tcga_objects
    }

    missing_labels_in_filter_data = [
        label for label in return_cruk_labels + return_tcga_labels
        if label not in resolved_labels
    ]

    return {
        "input": {
            "cruk_label": cruk_label,
            "topography_label": topography_label,
            "histology_label": histology_label
        },
        "matched_rule_names": [rule.get("rule_name") for rule in matched_rules],
        "return_cruk_labels": return_cruk_labels,
        "return_tcga_labels": return_tcga_labels,
        "missing_labels_in_label_key_dict": missing_labels_in_label_key_dict,
        "missing_labels_in_filter_data": missing_labels_in_filter_data,
        "resolved_cruk_objects": resolved_cruk_objects,
        "resolved_tcga_objects": resolved_tcga_objects
    }


def get_special_mapped_terms(dataset):
    dataset_filters = dataset.get("datasetFilters", [])

    result = map_special_cruk_terms(dataset_filters)

    matched_rule_names = result.get("matched_rule_names", [])
    resolved_cruk_objects = result.get("resolved_cruk_objects", [])
    resolved_tcga_objects = result.get("resolved_tcga_objects", [])

    matched_term = ", ".join(result.get("return_cruk_labels", [])) or None
    matched_rule = ", ".join(matched_rule_names) if matched_rule_names else None

    return matched_term, matched_rule, resolved_cruk_objects, resolved_tcga_objects


if __name__ == "__main__":
    pass