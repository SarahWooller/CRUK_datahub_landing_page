// Removed mock_study_data.js import

// --- A. GLOBAL UTILITIES (Set Prototype Extensions) ---
// These are necessary for the evaluation logic to work.
if (!Set.prototype.intersection) {
    Set.prototype.intersection = function(otherSet) {
        const intersection = new Set();
        for (const elem of otherSet) {
            if (this.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    }
}

if (!Set.prototype.union) {
    Set.prototype.union = function(otherSet) {
        const union = new Set(this);
        for (const elem of otherSet) {
            union.add(elem);
        }
        return union;
    }
}
// --------------------------------------------------------

// Removed idsToStudies mapping

/**
 * Takes an array of logic tokens, safely evaluates them using a recursive descent parser, and logs the result.
 * No eval() is used, ensuring complete security.
 * 
 * @param {Array} tokens - Array of token objects
 * @param {Array} datasets - Array of active dataset records
 */
export const executeFilterLogic = (tokens, datasets = []) => {
    if (!tokens || tokens.length === 0) {
        return { success: false, error: "No filter logic tokens provided." };
    }

    try {
        let pos = 0;

        // Highest precedence: OR
        const parseOr = () => {
            let leftSet = parseAnd();
            while (pos < tokens.length && tokens[pos].type === 'operator' && tokens[pos].value === 'OR') {
                pos++;
                const rightSet = parseAnd();
                leftSet = leftSet.union(rightSet);
            }
            return leftSet;
        };

        // Next precedence: AND
        const parseAnd = () => {
            let leftSet = parsePrimary();
            while (pos < tokens.length && tokens[pos].type === 'operator' && tokens[pos].value === 'AND') {
                pos++;
                const rightSet = parsePrimary();
                leftSet = leftSet.intersection(rightSet);
            }
            return leftSet;
        };

        // Lowest precedence (leaves): Filters and Brackets
        const parsePrimary = () => {
            const token = tokens[pos];
            if (!token) throw new Error("Unexpected end of expression");

            if (token.type === 'filter') {
                pos++;
                const matchingDatasetIds = datasets
                    .filter(d => {
                        const filters = d.rawData?.metadata_blob?.datasetFilters || d.rawData?.datasetFilters || d.datasetFilters || [];
                        return filters.some(f => f.id === token.id);
                    })
                    .map(d => d.rawData?.datasetid || d.id?.toString() || "");
                return new Set(matchingDatasetIds);
            } else if (token.type === 'bracket' && token.value === '(') {
                pos++;
                const innerSet = parseOr(); 
                const closeToken = tokens[pos];
                if (!closeToken || closeToken.type !== 'bracket' || closeToken.value !== ')') {
                    throw new Error("Missing closing parenthesis");
                }
                pos++;
                return innerSet;
            } else {
                throw new Error(`Unexpected token at position ${pos}: ${JSON.stringify(token)}`);
            }
        };

        // Start parsing from the top
        const finalStudiesSet = parseOr();
        
        if (pos < tokens.length) {
             throw new Error(`Unexpected extra tokens starting at position ${pos}`);
        }

        const studyArray = Array.from(finalStudiesSet).sort();
        return { success: true, count: studyArray.length, studies: studyArray };

    } catch (error) {
        console.error("Filter Evaluation Error:", error);
        return { success: false, error: error.message };
    }
};