const OPERATIONS = ["+", "-", "*", "/"];

/**
 * Generates a random number based on difficulty level
 * @param {number} difficulty - Difficulty level
 * @returns {number} Random number
 */
const generateRandomNumber = (difficulty) => {
    return Math.floor(Math.random() * Math.pow(10, difficulty));
};

/**
 * Generates random operands array
 * @param {number} count - Number of operands needed
 * @param {number} difficulty - Difficulty level
 * @returns {number[]} Array of operands
 */
const generateOperands = (count, difficulty) => {
    return Array(count).fill(0).map(() => generateRandomNumber(difficulty));
};

/**
 * Builds equation string from operands and operations
 * @param {number[]} operands - Array of numbers
 * @returns {string} Formatted equation string
 */
const buildEquation = (operands) => {
    return operands.reduce((equation, operand, index) => {
        if (index === operands.length - 1) return equation + operand;
        const operation = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];
        return equation + operand + " " + operation + " ";
    }, "");
};

/**
 * Calculates the result of the equation
 * @param {string} equation - Math equation string
 * @returns {string} Calculated result or "Error"
 */
const calculateResult = (equation) => {
    try {
        const result = eval(equation);
        return Number.isFinite(result) ? result.toFixed(2) : "Error";
    } catch {
        return "Error";
    }
};

/**
 * Generates a math equation based on difficulty level
 * @param {number} difficulty - Difficulty level
 * @returns {Object} Object containing question and answer
 */
const generateEquation = (difficulty) => {
    const numOperands = difficulty + 1;
    const operands = generateOperands(numOperands, difficulty);
    const equation = buildEquation(operands);
    const answer = calculateResult(equation);

    return {
        question: equation,
        answer
    };
};

module.exports = generateEquation;
