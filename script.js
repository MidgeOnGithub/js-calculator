const operators = ['+', '-', '*', '/'];
const display = document.querySelector('.display p');

let blockForResult = false;

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return undefined;
    }
    return a / b;
}

function operate(a, operator, b) {
    if (operator === '+')
        return add(a, b);
    else if (operator === '-')
        return subtract(a, b);
    else if (operator === '*')
        return multiply(a, b);
    else  // operator === '/'
        return divide(a, b);
}

let buffer = [];

// Perform the operations necessary to clear the buffer.
function runCalculations() {
    if (buffer.length < 3) {
        return;
    }

    // Perform the calculations.
    let result = null;
    for (let i = 0; i < buffer.length; i += 2) {
        if (i === buffer.length - 1) {
            break;
        }
        let [a, operator, b] = buffer.slice(i, i + 3);
        if (result) {
            a = result;
        } 
        result = operate(a, operator, b);
    }

    // Handle a division by zero.
    if (result === undefined) {
        buffer = [];
        display.textContent = "No dividing by zero, please!";
        return;
    } else {
        result = trimNumber(result);
        // Set the buffer to the result and display the result.
        buffer = [result]
        blockForResult = true;
        display.textContent = result;
    }
}

// Trim a number so it fits within the display.
function trimNumber(number) {
    let numStr = number.toString();
    let numLen = numStr.length;
    if (numLen > 13) {
        if (numStr.includes('e')) {
            // The number is big enough to be in scientific notation,
            // Just truncate the decimals until it's small enough.
            let decimal = numStr.indexOf('.');
            let e = numStr.indexOf('e');
            let numArr = numStr.split('');
            // The splice method returns what's deleted,
            // so a simple usage cannot be chained nicely.
            numArr.splice(decimal, e - decimal);
            numStr = numArr.join('');
            return Number(numStr);
        }
        if (numStr.includes('.')) {
            let decimal = numStr.indexOf('.');
            if (decimal <= 12 && decimal !== -1) {
                return parseFloat(number.toFixed(12 - decimal));
            } else {
                Math.trunc(number);
                numStr = number.toString();
                numStr = numStr.slice(0, 13);
                return parseInt(numStr);
                // UGHGHGH
            }
        } else {  // Number does not have a decimal, just cut it.
            numStr = numStr.slice(0, 13);
            return parseInt(numStr);
        }
    } else {
        return number;
    }
}
// Clear the operation buffer and display.
function clear() {
    buffer = [];
    display.textContent = '...';
}

// Update the operation buffer and display.
function update(input) {
    // Update buffer appropriately.
    let inputIsOperator = operators.includes(input);
    
    if (buffer.length === 0) {
        // The buffer is empty, add the input if it's a number.
        if (inputIsOperator)
            return;
        buffer.push(input);
        display.textContent = input;
    } else {
        // The buffer is not empty, so do some extra checks.
        let lastElement = buffer[buffer.length - 1];
        let lastElemIsOperator = operators.includes(lastElement);
        if (inputIsOperator) {
            // Only allow one operator between numbers,
            // and only allow four operations at a time.
            if (lastElemIsOperator || buffer.length === 9)
                return;
            else
                buffer.push(input);
                blockForResult = false;
        } else {
            if (lastElemIsOperator) {
                buffer.push(input);
                blockForResult = false;
            } else {
                if (blockForResult)
                    return;
                lastElement = lastElement * 10 + input;
            }
        }
        display.textContent += input;
    }
}

const digitButtons = document.querySelectorAll('.digits');
[...digitButtons].forEach((button) => {
    button.addEventListener('click', () => {
        update(parseInt(button.id));
    })
});

const opButtons = document.querySelectorAll('.operators');
[...opButtons].forEach((button) => {
    button.addEventListener('click', () => {
        update(button.id);
    })
});

const reset = document.querySelector('#CE');
reset.addEventListener('click', clear);
const submit = document.querySelector('[id="="]');
submit.addEventListener('click', runCalculations);
