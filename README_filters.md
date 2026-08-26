# Understanding the CRUK Datahub Filtering Engine

This document explains the current state of the dataset filtering engine, detailing how user selections are translated into a filtered list of datasets.

## 1. The Data Structures

- **`src/utils/longer_filter_data.js`**: Contains the raw, hierarchical JSON representation of the entire taxonomy (Cancer Types, Data Types, Access Rules).
- **`src/utils/flattened_filter_data.js`**: A pre-computed, flattened dictionary (`O(1)` lookup) mapping every filter ID to its details (label, category, group).
- **`src/utils/filter-setup.js`**: The central import hub. It loads the flattened dictionary and instantiates a JavaScript `Map` (`filterDetailsMap`) for use throughout the application.

## 2. Capturing User Selections (`FilterApp.jsx`)

When a user interacts with the UI, they check/uncheck `<input type="checkbox">` elements.
These selections are maintained in a React state `Set` called `selectedFilters`, which stores the raw IDs of the checked filters (e.g., `0_0_2_1`).

## 3. Generating Logic Tokens (`logic-utils.js`)

Instead of constructing fragile, error-prone text strings, the engine dynamically constructs an array of structured JSON tokens using `calculateLogicTokens()`.
This array acts as an Abstract Syntax Tree (AST) representing the user's logic.

- **Grouping**: Filters are grouped by prefix (Histology, Topography, Data Types, Access).
- **Relationships**:
  - Filters within most groups (like Topography or Histology) are ORed together.
  - Distinct groups (Cancer Types vs. Data Types) are ANDed together.
  - Parent nodes are automatically resolved and included as required.
- **Tokens**: The output is an array of objects like `[{ type: 'bracket', value: '(' }, { type: 'filter', id: '0_0_2_1', label: 'Lung' }, { type: 'operator', value: 'AND' }, ...]`.

## 4. The Advanced Logic Builder (`FilterLogicBuilder.jsx`)

To keep the UI clean, the interactive token builder is hidden by default. Most users will rely on the auto-generated logic.
If a user toggles the Advanced Logic Builder:
- The logic tokens are rendered into an interactive UI where users can visually manipulate the logic.
- Filters, brackets, and operators all have `✕` buttons so users can manually prune the logic.
- Operators (`AND`/`OR`) are interactive buttons. Clicking them toggles their value instantly.
- If a user manually edits the tokens, the application displays a `(Custom Logic Active)` badge and stops auto-generating logic until the user clicks the "Reset to Auto Logic" button.

## 5. Safe Evaluation (`filterLogic.js`)

When the user clicks "Find Studies", the token array undergoes a strict validation and evaluation process:

1. **Syntax Validation**: The `executeFilterLogic` parser first checks for valid syntax. If a user manually creates an invalid sequence (e.g., `OR OR`), the validation fails. The UI automatically expands the Advanced Builder and displays an error banner, prompting the user to reset.
2. **Recursive Parsing**: A robust recursive descent parser (`parseOr`, `parseAnd`, `parsePrimary`) navigates the valid token array.
3. **Set Operations**: The parser uses native JavaScript `Set` arithmetic (unions and intersections) to securely compute the final list of matching dataset IDs.
4. **Security**: `eval()` has been completely eliminated, guaranteeing that the application is secure against injection vulnerabilities.

## 6. Event Dispatch

The final filtered array of datasets is emitted to the wider application via a custom browser event called `apply-dataset-filters`. Other components (like the `DatasetsSection`) listen for this event and update their internal tables accordingly.
