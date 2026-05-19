import argparse
import json
import logging
from pathlib import Path
from typing import Any, Dict, List

from runner import run_runner_pipeline, save_json_file


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


PROJECT_ROOT = Path(__file__).resolve().parent.parent
LABEL_KEY_DICT_PATH = PROJECT_ROOT / "label_key_dict.json"


def load_label_key_dict(path: Path) -> Dict[str, str]:
    with open(path, encoding="utf-8") as file:
        return json.load(file)


def extract_topographies(label_key_dict: Dict[str, str]) -> List[str]:
    return sorted(
        label
        for label, key in label_key_dict.items()
        if key.startswith("0_0_0")
        and label != "icdOTopography"
    )


def extract_histologies(label_key_dict: Dict[str, str]) -> List[str]:
    return sorted(
        label
        for label, key in label_key_dict.items()
        if key.startswith("0_0_1")
        and label != "icdOHistology"
    )


def build_input_term(topography_label: str) -> Dict[str, Any]:
    return {
        "id": None,
        "label": topography_label,
        "category": "icdOTopography",
        "primaryGroup": "cancer-type",
        "description": "",
    }


def generate_results_dictionary(
    topographies: List[str],
    histologies: List[str],
) -> Dict[str, Any]:
    results_dictionary = {}

    total = len(topographies) * len(histologies)
    counter = 0

    logger.info("Topographies: %d", len(topographies))
    logger.info("Histologies: %d", len(histologies))
    logger.info("Total combinations: %d", total)

    for topography in topographies:
        results_dictionary[topography] = {}

        for histology in histologies:
            counter += 1

            if counter % 1000 == 0:
                logger.info("Processed %d / %d combinations", counter, total)

            output = run_runner_pipeline(
                input_terms=[build_input_term(topography)],
                histology=histology,
            )

            results_dictionary[topography][histology] = {
                "results": output.get("results", []),
                "unmatched": output.get("unmatched", []),
                "encountered_problems": output.get("encountered_problems", []),
            }

    return results_dictionary


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate precomputed ICD-O mapping results dictionary."
    )

    parser.add_argument(
        "--output",
        default="results_dictionary.json",
        help="Output JSON file path.",
    )

    parser.add_argument(
        "--limit-topographies",
        type=int,
        default=None,
        help="Optional limit for testing.",
    )

    parser.add_argument(
        "--limit-histologies",
        type=int,
        default=None,
        help="Optional limit for testing.",
    )

    args = parser.parse_args()

    label_key_dict = load_label_key_dict(LABEL_KEY_DICT_PATH)

    topographies = extract_topographies(label_key_dict)
    histologies = extract_histologies(label_key_dict)

    if args.limit_topographies:
        topographies = topographies[:args.limit_topographies]

    if args.limit_histologies:
        histologies = histologies[:args.limit_histologies]

    results_dictionary = generate_results_dictionary(
        topographies=topographies,
        histologies=histologies,
    )

    save_json_file(args.output, results_dictionary)
    logger.info("Saved results dictionary to %s", args.output)


if __name__ == "__main__":
    main()