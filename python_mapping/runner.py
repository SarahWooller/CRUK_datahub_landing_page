import argparse
import json
import logging
import re
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "runner.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Standardised Output
# ---------------------------------------------------------------------------
@dataclass
class MappingResult:
    matched_term: Optional[str] = None
    matched_rule: Optional[str] = None
    cruk_terms: List[Dict[str, Any]] = field(default_factory=list)
    tcga_terms: List[Dict[str, Any]] = field(default_factory=list)

    def has_mapping(self) -> bool:
        return bool(self.cruk_terms or self.tcga_terms)


# ---------------------------------------------------------------------------
# Pure Helper Functions
# ---------------------------------------------------------------------------
def save_json_file(output_path: str, data: Dict[str, Any]) -> None:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


def deduplicate_strings(items: List[str]) -> List[str]:
    seen = set()
    unique_items = []
    for item in items:
        if item not in seen:
            seen.add(item)
            unique_items.append(item)
    return unique_items


def normalise_string(value: Optional[str]) -> str:
    if not isinstance(value, str):
        return ""
    return value.strip()


def ensure_list_of_objects(value: Any) -> List[Dict[str, Any]]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, dict)]


def get_topography_label(term: Dict[str, Any]) -> Optional[str]:
    label = term.get("label")
    if isinstance(label, str) and label.startswith("C"):
        return label
    return None


def get_histology_label(histology: Optional[str]) -> Optional[str]:
    if isinstance(histology, str) and histology.strip():
        return histology.strip()
    return histology


def detect_childhood_case(age_range_max: Optional[int]) -> bool:
    return isinstance(age_range_max, int) and age_range_max < 19


def detect_male_keywords(topography_label: Optional[str], histology_label: Optional[str]) -> bool:
    keywords = [r"\bmale\b", r"\bman\b", r"\bmen\b"]
    searchable_values = [
        normalise_string(topography_label).lower(),
        normalise_string(histology_label).lower(),
    ]
    return any(
        re.search(keyword, value)
        for value in searchable_values
        for keyword in keywords
    )


def build_dataset_context(
    term: Dict[str, Any],
    histology: Optional[str] = None,
    existing_cruk_labels: Optional[List[str]] = None,
    extra_metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    dataset_filters = [
        {
            "id":           term.get("id"),
            "label":        term.get("label"),
            "category":     term.get("category"),
            "primaryGroup": term.get("primaryGroup", "cancer-type"),
            "description":  term.get("description", ""),
        }
    ]
    if histology:
        dataset_filters.append(
            {
                "id": None, "label": histology, "category": "histology",
                "primaryGroup": "cancer-type", "description": "",
            }
        )
    if existing_cruk_labels:
        for label in existing_cruk_labels:
            dataset_filters.append(
                {
                    "id": None, "label": label, "category": "crukTerms",
                    "primaryGroup": "cancer-type", "description": "",
                    "isGenerated": True,
                }
            )
    return {"datasetFilters": dataset_filters, "metadata": extra_metadata or {}}


def unpack_mapping_response(response: Any) -> MappingResult:
    if not isinstance(response, tuple):
        return MappingResult()
    if len(response) == 3:
        matched_term, cruk_terms, tcga_terms = response
        return MappingResult(
            matched_term=matched_term,
            matched_rule=None,
            cruk_terms=ensure_list_of_objects(cruk_terms),
            tcga_terms=ensure_list_of_objects(tcga_terms),
        )
    if len(response) == 4:
        matched_term, matched_rule, cruk_terms, tcga_terms = response
        return MappingResult(
            matched_term=matched_term,
            matched_rule=matched_rule,
            cruk_terms=ensure_list_of_objects(cruk_terms),
            tcga_terms=ensure_list_of_objects(tcga_terms),
        )
    return MappingResult()


# ---------------------------------------------------------------------------
# Strategy Interfaces
# ---------------------------------------------------------------------------
class MappingStrategy(ABC):
    def __init__(self, name: str, shared_data: Dict[str, Any]):
        self.name = name
        self.shared_data = shared_data  # e.g. loaded JSON lookups, mapping functions

    def is_available(self) -> bool:
        return True

    def get_import_error(self) -> Optional[str]:
        return None

    @abstractmethod
    def map_term(self, term: Dict[str, Any], context: Dict[str, Any]) -> MappingResult:
        """Executes the specific mapping logic for this stage."""
        pass


class SimpleMappingStrategy(MappingStrategy):
    def __init__(self, shared_data: Dict[str, Any]):
        super().__init__("simple", shared_data)

    def map_term(self, term: Dict[str, Any], context: Dict[str, Any]) -> MappingResult:
        get_mapped_terms = self.shared_data.get("get_mapped_terms")
        response = get_mapped_terms(term)
        return unpack_mapping_response(response)


class IntermediateMappingStrategy(MappingStrategy):
    def __init__(self, shared_data: Dict[str, Any]):
        super().__init__("intermediate", shared_data)

    def map_term(self, term: Dict[str, Any], context: Dict[str, Any]) -> MappingResult:
        histology = context.get("histology_label")
        get_intermediate_mapped_terms = self.shared_data.get("get_intermediate_mapped_terms")
        response = get_intermediate_mapped_terms(term, histology)
        return unpack_mapping_response(response)


class ComplexMappingStrategy(MappingStrategy):
    def __init__(self, shared_data: Dict[str, Any]):
        super().__init__("complex", shared_data)

    def map_term(self, term: Dict[str, Any], context: Dict[str, Any]) -> MappingResult:
        histology = context.get("histology_label")
        get_complex_mapped_terms = self.shared_data.get("get_complex_mapped_terms")
        response = get_complex_mapped_terms(term, histology)
        return unpack_mapping_response(response)


class SpecialMappingStrategy(MappingStrategy):
    def __init__(self, shared_data: Dict[str, Any]):
        super().__init__("special", shared_data)

    def is_available(self) -> bool:
        return self.shared_data.get("get_special_mapped_terms") is not None

    def get_import_error(self) -> Optional[str]:
        return self.shared_data.get("special_import_error")

    def map_term(self, term: Dict[str, Any], context: Dict[str, Any]) -> MappingResult:
        get_special_mapped_terms = self.shared_data.get("get_special_mapped_terms")
        dataset_context = build_dataset_context(
            term=term,
            histology=context.get("histology_label"),
            existing_cruk_labels=context.get("existing_cruk_labels"),
            extra_metadata=context.get("extra_metadata"),
        )
        response = get_special_mapped_terms(dataset_context)
        return unpack_mapping_response(response)


class RareMappingStrategy(MappingStrategy):
    def __init__(self, shared_data: Dict[str, Any]):
        super().__init__("rare", shared_data)

    def is_available(self) -> bool:
        return self.shared_data.get("get_rare_mapped_terms") is not None

    def get_import_error(self) -> Optional[str]:
        return self.shared_data.get("rare_import_error")

    def map_term(self, term: Dict[str, Any], context: Dict[str, Any]) -> MappingResult:
        get_rare_mapped_terms = self.shared_data.get("get_rare_mapped_terms")
        dataset_context = build_dataset_context(
            term=term,
            histology=context.get("histology_label"),
            existing_cruk_labels=context.get("existing_cruk_labels"),
            extra_metadata=context.get("extra_metadata"),
        )
        response = get_rare_mapped_terms(dataset_context)
        return unpack_mapping_response(response)


# ---------------------------------------------------------------------------
# Pipeline Execution
# ---------------------------------------------------------------------------
class MappingPipeline:
    def __init__(self, strategies: List[MappingStrategy]):
        self.strategies = strategies

    def execute(
        self,
        input_terms: List[Dict[str, Any]],
        global_context: Dict[str, Any],
    ) -> Dict[str, Any]:

        results = []
        remaining_terms = list(input_terms)
        encountered_problems: List[str] = global_context.setdefault("encountered_problems", [])

        for strategy in self.strategies:
            if not remaining_terms:
                break

            logger.info(
                "Running %s mapping on %d remaining terms",
                strategy.name.upper(),
                len(remaining_terms),
            )

            if not strategy.is_available():
                logger.warning(
                    "%s mapping function is not available; skipping stage. Import error: %s",
                    strategy.name.upper(),
                    strategy.get_import_error(),
                )
                continue

            next_remaining = []

            for term in remaining_terms:
                try:
                    result = strategy.map_term(term, global_context)

                    if result.has_mapping():
                        logger.info("Matched in %s: %s", strategy.name.upper(), term.get("label"))
                        results.append({
                            "input_term":          term,
                            "topography_label":    get_topography_label(term),
                            "histology_label":     global_context.get("histology_label"),
                            "matched_level":       strategy.name,
                            "matched_schema_term": result.matched_term,
                            "matched_rule":        result.matched_rule,
                            "CRUK":                result.cruk_terms,
                            "TCGA":                result.tcga_terms,
                        })
                    else:
                        next_remaining.append(term)

                except Exception:
                    logger.exception(
                        "Error in %s for term: %s",
                        strategy.name.upper(),
                        term.get("label"),
                    )
                    next_remaining.append(term)

            remaining_terms = next_remaining

            # Post-simple hook: warn if histology missing for deeper levels
            if strategy.name == "simple" and remaining_terms and not global_context.get("histology_label"):
                problem = (
                    "No histology string was provided for term(s) that were not resolved at simple level. "
                    "Histology-dependent mapping levels may fail or be incomplete."
                )
                encountered_problems.append(problem)
                logger.warning(problem)

        if remaining_terms:
            problem = (
                f"{len(remaining_terms)} term(s) remained unmatched after simple, intermediate, "
                f"complex, special, and rare."
            )
            encountered_problems.append(problem)
            logger.warning(problem)
            for term in remaining_terms:
                logger.info("Unmatched term: %s", term.get("label"))

        return {
            "results":   results,
            "unmatched": remaining_terms,
        }


# ---------------------------------------------------------------------------
# Shared Data Loader  (import once, inject everywhere)
# ---------------------------------------------------------------------------
def load_shared_data() -> Dict[str, Any]:
    """
    Imports all mapping functions once and bundles them into a single dict
    that gets injected into every strategy constructor.
    Handles optional imports gracefully.
    """
    from mapping_program_simple       import get_mapped_terms
    from mapping_program_intermediate import get_intermediate_mapped_terms
    from mapping_program_complex      import get_complex_mapped_terms

    shared: Dict[str, Any] = {
        "get_mapped_terms":              get_mapped_terms,
        "get_intermediate_mapped_terms": get_intermediate_mapped_terms,
        "get_complex_mapped_terms":      get_complex_mapped_terms,
        "get_special_mapped_terms":      None,
        "special_import_error":          None,
        "get_rare_mapped_terms":         None,
        "rare_import_error":             None,
    }

    try:
        from mapping_program_special import get_special_mapped_terms
        shared["get_special_mapped_terms"] = get_special_mapped_terms
    except Exception as exc:
        shared["special_import_error"] = str(exc)

    try:
        from mapping_program_rare import get_rare_mapped_terms
        shared["get_rare_mapped_terms"] = get_rare_mapped_terms
    except Exception as exc:
        shared["rare_import_error"] = str(exc)

    return shared


# ---------------------------------------------------------------------------
# Public Entry Point
# ---------------------------------------------------------------------------
def run_runner_pipeline(
    input_terms: List[Dict[str, Any]],
    histology: Optional[str] = None,
    existing_cruk_labels: Optional[List[str]] = None,
    age_range_max: Optional[int] = None,
    extra_metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:

    # --- Preprocessing ---
    histology_label      = get_histology_label(histology)
    existing_cruk_labels = list(existing_cruk_labels or [])
    childhood_detected   = detect_childhood_case(age_range_max)
    male_detected        = any(
        detect_male_keywords(
            topography_label=get_topography_label(term),
            histology_label=histology_label,
        )
        for term in input_terms
    )

    if childhood_detected and "Children's cancers" not in existing_cruk_labels:
        existing_cruk_labels.append("Children's cancers")

    if male_detected and "Men's cancer" not in existing_cruk_labels:
        existing_cruk_labels.append("Men's cancer")

    # --- Global context dict (Gemini-style plain dict) ---
    global_context: Dict[str, Any] = {
        "histology_label":      histology_label,
        "existing_cruk_labels": existing_cruk_labels,
        "extra_metadata":       extra_metadata or {},
        "encountered_problems": [],
    }

    logger.info("Starting runner pipeline")
    logger.info("Number of input terms: %d", len(input_terms))
    logger.info("Histology label: %s", histology_label)
    logger.info("Existing CRUK labels: %s", existing_cruk_labels)
    logger.info("AgeRangeMax: %s", age_range_max)
    logger.info("Childhood case detected: %s", childhood_detected)
    logger.info("Male-specific case detected: %s", male_detected)

    # --- Load shared data once, inject into all strategies ---
    shared_data = load_shared_data()

    pipeline = MappingPipeline([
        SimpleMappingStrategy(shared_data),
        IntermediateMappingStrategy(shared_data),
        ComplexMappingStrategy(shared_data),
        SpecialMappingStrategy(shared_data),
        RareMappingStrategy(shared_data),
    ])

    output = pipeline.execute(input_terms, global_context)

    logger.info("Runner pipeline finished")

    return {
        "topography_labels":       [get_topography_label(term) for term in input_terms],
        "histology_label":         histology_label,
        "existing_cruk_labels":    existing_cruk_labels,
        "age_range_max":           age_range_max,
        "childhood_case_detected": childhood_detected,
        "male_case_detected":      male_detected,
        "results":                 output["results"],
        "unmatched":               output["unmatched"],
        "encountered_problems":    deduplicate_strings(global_context["encountered_problems"]),
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Run simple -> intermediate -> complex -> special -> rare mapping pipeline."
    )
    parser.add_argument("--label",    required=True, help='ICD-O topography label, e.g. "C64 Kidney"')
    parser.add_argument("--category", default="icdOTopography", help="Input term category")
    parser.add_argument("--histology", default=None, help="Optional histology string")
    parser.add_argument(
        "--existing-cruk-label", action="append", default=[],
        help="Optional existing CRUK label(s)",
    )
    parser.add_argument("--age-range-max", type=int, default=None, help="Optional AgeRangeMax value")
    parser.add_argument("--output", default=None, help="Optional output JSON file path")

    args = parser.parse_args()

    input_term = {
        "id": None, "label": args.label, "category": args.category,
        "primaryGroup": "cancer-type", "description": "",
    }

    output_data = run_runner_pipeline(
        input_terms=[input_term],
        histology=args.histology,
        existing_cruk_labels=args.existing_cruk_label,
        age_range_max=args.age_range_max,
    )

    if args.output:
        save_json_file(args.output, output_data)
        logger.info("Saved output to %s", args.output)
    else:
        print(json.dumps(output_data, indent=2, ensure_ascii=False))