const generateEquation = (difficulty) => {
    const operations = ["+", "-", "*", "/"];
    let operands = [];
    let equation = "";

    const numOperands = difficulty + 1;
    for (let i = 0; i < numOperands; i++) {
        operands.push(Math.floor(Math.random() * Math.pow(10, difficulty)));
    }

    for (let i = 0; i < numOperands - 1; i++) {
        equation += `${operands[i]} ${operations[Math.floor(Math.random() * operations.length)]} `;
    }
    equation += operands[numOperands - 1];

    let answer;
    try {
        answer = eval(equation).toFixed(2); // Round answer for precision
    } catch (error) {
        answer = "Error";
    }

    return {
        question: equation,
        answer,
    };
};

module.exports = generateEquation;
