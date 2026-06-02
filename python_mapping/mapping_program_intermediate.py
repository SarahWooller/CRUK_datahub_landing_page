import json
import os

from mapping_utils import (
    deduplicate_by_id,
    resolve_labels_to_objects,
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)

SCHEMA_PATH = os.path.join(PROJECT_ROOT, "schemas", "schema_intermediate_1.1.2.json")
FILTER_DATA_PATH = os.path.join(PROJECT_ROOT, "longer_filter_data.json")
LABEL_KEY_DICT_PATH = os.path.join(PROJECT_ROOT, "label_key_dict.json")

with open(SCHEMA_PATH, encoding="utf-8") as file:
    schema = json.load(file)

with open(LABEL_KEY_DICT_PATH, encoding="utf-8") as file:
    label_key_dict = json.load(file)

with open(FILTER_DATA_PATH, encoding="utf-8") as file:
    filter_data = json.load(file)

topography_mappings = schema["topography_mappings"]


def get_icdo_prefix(label):
    """
    Extract the broad ICD-O topography code from a label.

    Examples:
    - 'C22.0 Liver' -> 'C22'
    - 'C21 Anus and anal canal' -> 'C21'
    - 'C18.0 Cecum' -> 'C18'
    """
    if not label:
        return None

    first_part = label.split()[0]

    if first_part.startswith("C"):
        return first_part.split(".")[0]

    return None


def find_topography_mapping_key(input_term):
    label = input_term.get("label", "")
    category = input_term.get("category", "")

    # 1. Try exact label match first
    if label in topography_mappings:
        return label

    # 2. Try exact category match
    if category in topography_mappings:
        return category

    # 3. Try matching by broad ICD-O prefix
    # Example: C22.0 Liver -> C22 Liver and intrahepatic bile ducts
    input_prefix = get_icdo_prefix(label)

    if input_prefix:
        for schema_key in topography_mappings:
            schema_prefix = get_icdo_prefix(schema_key)
            if schema_prefix == input_prefix:
                return schema_key

    return None


def get_intermediate_mapped_terms(input_term, histology_text=None):
    term_key = find_topography_mapping_key(input_term)

    if term_key is None:
        return None, [], []

    mapping = topography_mappings[term_key]

    cruk_terms = mapping.get("default_CRUK") or []
    default_tcga_terms = mapping.get("default_tcga") or []
    tcga_labels_to_use = list(default_tcga_terms)

    overrides = mapping.get("overrides", [])
    override_applied = False

    if histology_text is not None:
        histology_text = histology_text.strip()

        for override in overrides:
            override_histologies = override.get("histology", [])

            if histology_text in override_histologies:
                tcga_value = override.get("tcga")

                if tcga_value is None:
                    tcga_labels_to_use = []
                elif isinstance(tcga_value, list):
                    tcga_labels_to_use = list(tcga_value)
                else:
                    tcga_labels_to_use = [tcga_value]

                override_applied = True
                break

    cruk_objects = resolve_labels_to_objects(cruk_terms, label_key_dict, filter_data)
    tcga_objects = resolve_labels_to_objects(tcga_labels_to_use, label_key_dict, filter_data)

    if override_applied:
        tcga_objects = deduplicate_by_id(tcga_objects)

    return term_key, cruk_objects, tcga_objects