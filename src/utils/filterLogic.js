import { filterData } from './longer_filter_data.js';
import { studyData } from './mock_study_data.js';

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

// --- B. DATA INITIALIZATION (Adapted from useMemo in test.jsx) ---
// Note: We initialize this outside the function so it only runs once per file load.

const filterNameToId = {};
const idsToStudies = studyData; // Directly use studyData as idsToStudies
const operatorMap = { "AND": "intersection", "OR": "union" };
const validOperators = new Set(Object.keys(operatorMap));

const populateMap = (nodes) => {
    if (!nodes) return;
    const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
    nodesArray.forEach(item => {
        // Trim label here to match key expectations in the parsing functions
        filterNameToId[item.label.trim()] = item.id;
        if (item.children && Object.keys(item.children).length > 0) {
            populateMap(item.children);
        }
    });
};

// User's provided map population logic
if (filterData['0_0']) populateMap(filterData['0_0'].children);
if (filterData['0_2']) populateMap(filterData['0_2'].children);
if (filterData['0_1']) populateMap(filterData['0_1'].children);

const goodKeys = new Set(Object.keys(filterNameToId));


// --- C. LOGIC CONVERSION AND PARSING FUNCTIONS (from test.jsx) ---

const findTopLevelOperator = (expression, operator) => {
    let balance = 0;
    const opLength = operator.length;

    for (let i = expression.length - 1; i >= 0; i--) {
        const char = expression[i];
        if (char === ')') {
            balance++;
        } else if (char === '(') {
            balance--;
        } else if (balance === 0) {
            if (i >= opLength - 1 && expression.substring(i - opLength + 1, i + 1) === operator) {
                 const start = i - opLength + 1;
                const isPrecededBySpace = (start === 0 || /\s/.test(expression[start - 1]));
                const isFollowedBySpace = (i + 1 === expression.length || /\s/.test(expression[i + 1]));

                if (isPrecededBySpace && isFollowedBySpace) {
                    return { index: start, operator: operator };
                }
            }
        }
    }
    return null;
};

const infixToPrefix = (infix) => {
    let expression = infix.trim();

    // 1. Remove unnecessary outer parentheses
    while (expression.startsWith('(') && expression.endsWith(')')) {
        let balance = 0;
        let isFullyContained = true;
        for (let i = 1; i < expression.length - 1; i++) {
            if (expression[i] === '(') {
                balance++;
            } else if (expression[i] === ')') {
                balance--;
                if (balance < 0) {
                    isFullyContained = false;
                    break;
                }
            }
        }
        if (isFullyContained && balance === 0) {
            expression = expression.substring(1, expression.length - 1).trim();
        } else {
            break;
        }
    }

    // 2. Base Case: Single operand (key)
    if (!expression.includes('AND') && !expression.includes('OR')) {
        const key = expression.trim();
        if (!goodKeys.has(key)) {
             throw new Error(`Security failed: Invalid filter key: ${key}`);
        }
        return key;
    }

    // 3. Recursive step: Find the lowest precedence, rightmost operator at balance 0.
    const operators = ["OR", "AND"];

    for (const op of operators) {
        let splitInfo = findTopLevelOperator(expression, op);

        if (splitInfo) {
            const { index, operator } = splitInfo;
            const left = expression.substring(0, index).trim();
            const right = expression.substring(index + operator.length).trim();

            const leftPrefix = infixToPrefix(left);
            const rightPrefix = infixToPrefix(right);

            return `${operator}(${leftPrefix}, ${rightPrefix})`;
        }
    }

    throw new Error(`Infix parsing failed. Check parentheses and operators: ${expression}`);
};

const parsePrefixExpression = (expression) => {
    expression = expression.trim();

    // 1. Identify if the string starts with a known operator
    const isFunctionalExpression = expression.startsWith('AND') || expression.startsWith('OR');

    // 2. If it lacks parentheses OR doesn't start with an operator, it's a label
    if (!expression.includes('(') || !isFunctionalExpression) {
        // Base case: Operand (filter label)
        // Look up the ID using the label, then get the studies using the ID
        const studyId = filterNameToId[expression];
        const studies = idsToStudies[studyId];
        return `new Set([${(studies || []).join(', ')}])`;
    }

    // 3. Only proceed with Regex matching if it passed the operator check
    const match = expression.match(/^([A-Z]+)\s*\((.*)\)$/);
    if (!match) {
        throw new Error(`Prefix parsing error: Invalid format for expression: ${expression}`);
    }

    const operator = match[1];
    const argsString = match[2];
    const jsMethod = operatorMap[operator];

    const args = [];
    let balance = 0;
    let currentArg = '';

    for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];

        if (char === '(') {
            balance++;
        } else if (char === ')') {
            balance--;
        } else if (char === ',' && balance === 0) {
            args.push(currentArg.trim());
            currentArg = '';
            continue;
        }
        currentArg += char;
    }
    if (currentArg.trim()) {
        args.push(currentArg.trim());
    }

    const initialSet = parsePrefixExpression(args[0]);
    let finalExpression = initialSet;

    for (let i = 1; i < args.length; i++) {
        const nextSet = parsePrefixExpression(args[i]);
        finalExpression = `(${finalExpression}).${jsMethod}(${nextSet})`;
    }

    return finalExpression;
};


// --- D. EXPORTED EXECUTION HANDLER ---

/**
 * Takes the infix logic string, evaluates it, and logs the result.
 * @param {string} expressionText - The logic message from the textarea (e.g., "(A OR B) AND C").
 */
export const executeFilterLogic = (expressionText) => {
    const log = ["--- Starting Logic Evaluation (from JustVertFilterApp) ---"];

    if (!expressionText) {
        log.push("❌ No filter logic expression provided.");
        console.log(log.join('\n'));
        return { success: false, log: log };
    }

    try {
        // 1. Convert Infix to Prefix
        const prefixExpression = infixToPrefix(expressionText);
        log.push(`Intermediate Prefix Expression: ${prefixExpression}`);

        // 2. Convert Prefix to final executable JavaScript Set expression
        const finalExpression = parsePrefixExpression(prefixExpression);
        log.push(`Intermediate JS Set Expression: ${finalExpression}`);

        // 3. Evaluate the JS expression string to get the final Set
        const finalStudiesSet = eval(finalExpression);

        // 4. Print the result
        if (finalStudiesSet instanceof Set) {
            const studyArray = Array.from(finalStudiesSet).sort((a, b) => a - b);
            log.push("\n✅ Final Studies Found:");
            log.push(JSON.stringify(studyArray));
            log.push(`Total Studies: ${studyArray.length}`);

            console.log(log.join('\n'));
            return { success: true, count: studyArray.length, studies: studyArray, log: log };
        } else {
            log.push("❌ Evaluation failed to produce a Set.");
            console.log(log.join('\n'));
            return { success: false, log: log };
        }

    } catch (error) {
        log.push(`\n❌ An error occurred during evaluation: ${error.message}`);
        console.error(error); // Log the full error object
        console.log(log.join('\n'));
        return { success: false, error: error.message, log: log };
    }
};