const operators = ['+', '-', '*', '/'];

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

// Decide which basic function to perform based on the operator.
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

// Convert the first and every other element after into `number` types.
function convertElementsToNumbers() {
    for (let i = 0; i < buffer.length; i += 2) {
        buffer[i] = Number(buffer[i]);
    }
}

// Perform the operations necessary to clear the buffer.
function runCalculations() {
    if (buffer.length < 3) {
        return;
    }

    convertElementsToNumbers();

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
        display.textContent = "No dividing by zero!";
        return;
    } else {
        result = trimNumber(result);
        // Set the buffer to the result and display the result.
        buffer = [result]
        blockForResult = true;
        display.textContent = result;
    }
}

// Ensure a number fits within the display.
function trimNumber(number) {
    let numStr = number.toString();
    if (numStr.length > 13) {
        if (numStr.includes('e')) {
            return trimScientific(numStr);
        }
        if (numStr.includes('.')) {
            return trimDecimal(number, numStr);
        } else {
            // Neither decimal nor scientific notation; cut the number
            // short. This loses information, but this is standard
            // behavior for many calculators.
            numStr = numStr.slice(0, 13);
            return parseInt(numStr);
        }
    } else {
        // No trimming required.
        return number;
    }
}

// Help `trimNumber` handle proper floats.
function trimDecimal(number, numStr) {
    let decimal = numStr.indexOf('.');
    if (decimal <= 12 && decimal !== -1) {
        // The decimal point occurs before the text overflows,
        // so remove all digits past the last fitting digit.
        return parseFloat(number.toFixed(12 - decimal));
    } else {
        // The decimal point occurs after the text overflows,
        // so remove all decimals and shorten the number.
        Math.trunc(number);
        numStr = number.toString();
        numStr = numStr.slice(0, 13);
        return parseInt(numStr);
    }
}

// Help `trimNumber` handle numbers in scientific notation.
function trimScientific(numStr) {
    // Remove the decimal and numbers after to ensure the number fits.
    let decimal = numStr.indexOf('.');
    let e = numStr.indexOf('e');
    let numArr = numStr.split('');
    // The splice method returns what's deleted,
    // so its usage cannot be chained nicely.
    numArr.splice(decimal, e - decimal);
    numStr = numArr.join('');
    return Number(numStr);
}

// Clear the buffer and reset the display.
function clearAll() {
    buffer = [];
    blockForResult = false;
    display.textContent = '...';
}

// Help `handleInput` with digit and decimal inputs.
function handleNumber(digit) {
    if (buffer.length === 0) {
        // Numbers and decimals go first in the buffer.
        buffer.push(digit);
    } else {
        let lastElement = buffer[buffer.length - 1];
        let lastElemIsOperator = operators.includes(lastElement);
        if (lastElemIsOperator) {
            buffer.push(digit);
        } else {
            lastElemStr = lastElement.toString();
            // If the number currently displayed is the last
            // calculation result, numbers may not be appended.
            if (blockForResult) {
                return;
            }
    
            if (digit === '.') {
                // Allow only one decimal point per number,
                // and ensure that adding a decimal and a
                // digit won't overflow the display.
                if (lastElemStr.includes('.') || lastElemStr.length === 12) {
                    return;
                }
            }
    
            // Block the input if it overflows the display line.
            if (lastElemStr.length === 13)
                return;
            buffer[buffer.length - 1] = lastElement += digit;
        }
    }
}

// Help `handleInput` with operator inputs.
function handleOperator(op) {
    if (buffer.length === 0) {
        // Only numbers may go first in the buffer.
        return;
    } else {
        let lastElement = buffer[buffer.length - 1];
        let lastElemIsOperator = operators.includes(lastElement);
        // Only allow one operator between numbers,
        // allow only 4 calculations in the buffer.
        if (lastElemIsOperator || buffer.length >= 8) {
            return;
        } else {
            buffer.push(op);
            blockForResult = false;
        }
    }
}

// Decide if the buffer should be updated, and refresh the display.
function handleInput(input) {
    if (this.className === 'operator') {
        handleOperator(this.id);
    } else {
        handleNumber(this.id);
    }

    refreshDisplay();
}

// Refresh the calculator's display.
function refreshDisplay() {
    // Clear the default text if present.
    if (display.textContent === '...')
        display.textContent = '';
    display.textContent = buffer.join(' ');
}

let blockForResult = false;
let buffer = [];

const display = document.querySelector('.display p');

const inputButtons = document.querySelectorAll('.digit, .operator, .decimal');
[...inputButtons].forEach((button) => {
    button.addEventListener('click', handleInput);
});

function handleKeyPress(e) {
    button = convertKeyToButton(e.key);
    let element = document.querySelector(`[id='${button}']`)
    if (element)
        element.click();
}

function convertKeyToButton(key) {
    let button;
    switch (key) {
        // Handle special key cases and convert to our button keys.
        case "Escape":
            button = 'CE'
            break;
        case "Backspace":
            break;
        case "Enter":
            button = '=';
            break;
        default:
            button = key;
    }
    return button;
}

window.addEventListener('keydown', handleKeyPress, true);

const reset = document.querySelector('#CE');
reset.addEventListener('click', clearAll);
const submit = document.querySelector('[id="="]');
submit.addEventListener('click', runCalculations);