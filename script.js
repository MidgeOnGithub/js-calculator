const numKeyCodes = ['48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105'];
const opKeyCodes = ['106, 107, 109, 111']
const operators = ['+', '-', '*', '/'];
const display = document.querySelector('.display p');

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

// Trim a number so it fits within the display.
function trimNumber(number) {
    let numStr = number.toString();
    if (numStr.length > 13) {
        if (numStr.includes('e')) {
            // The number is big enough to be in scientific notation,
            // Just remove the decimals so it's small enough.
            let decimal = numStr.indexOf('.');
            let e = numStr.indexOf('e');
            let numArr = numStr.split('');
            // The splice method returns what's deleted,
            // so its usage cannot be chained nicely.
            numArr.splice(decimal, e - decimal);
            numStr = numArr.join('');
            return Number(numStr);
        }
        if (numStr.includes('.')) {
            // The number has a decimal point.
            let decimal = numStr.indexOf('.');
            if (decimal <= 12 && decimal !== -1) {
                // The decimal point occurs before the text overflows,
                // so remove all digits past the last fitting digit.
                return parseFloat(number.toFixed(12 - decimal));
            } else {
                // The decimal point occurs after the text overflows,
                // so remove all decimals, then shorten the number.
                Math.trunc(number);
                numStr = number.toString();
                numStr = numStr.slice(0, 13);
                return parseInt(numStr);
            }
        } else {
            // Number does not have a decimal, just cut it and lose accuracy.
            numStr = numStr.slice(0, 13);
            return parseInt(numStr);
        }
    } else {
        // Number fits and no action is needed.
        return number;
    }
}
// Clear the buffer and reset the display.
function clearAll() {
    buffer = [];
    blockForResult = false;
    display.textContent = '...';
}

// Update the operation buffer and display.
function updateBuffer(input) {
    let inputIsOperator = operators.includes(input);
    if (buffer.length === 0) {
        // The buffer is empty, add the input if it's a number.
        if (inputIsOperator)
            return;
        buffer.push(input);
    } else {
        // The buffer is not empty, so do some extra checks.
        let lastElement = buffer[buffer.length - 1];
        let lastElemIsOperator = operators.includes(lastElement);
        if (inputIsOperator) {
            // Only allow one operator between numbers,
            // don't allow excessive calculations in one buffer.
            if (lastElemIsOperator || buffer.length >= 8)
                return;
            else
                buffer.push(input);
                blockForResult = false;
        } else {
            if (lastElemIsOperator) {
                buffer.push(input);
                blockForResult = false;
            } else {
                // If the number currently displayed is the last
                // calculation reseult, numbers may not be appended.
                if (blockForResult)
                    return;
                // Block the input if it overflows the display line.
                if (lastElement.toString().length === 13)
                    return;
                buffer[buffer.length - 1] = lastElement * 10 + input;
            }
        }
    }

    updateDisplay(input, inputIsOperator);
}

function updateDisplay(input, inputIsOperator) {
    // Clear the default text if present.
    if (display.textContent === '...')
        display.textContent = '';
    // If symbol is an operator, place spaces around it.
    inputIsOperator ? display.textContent += ` ${input} ` :
                      display.textContent += input;
}

let blockForResult = false;
let buffer = [];

const digitButtons = document.querySelectorAll('.digits');
[...digitButtons].forEach((button) => {
    button.addEventListener('click', () => {
        updateBuffer(parseInt(button.id));
    })
});

const opButtons = document.querySelectorAll('.operators');
[...opButtons].forEach((button) => {
    button.addEventListener('click', () => {
        updateBuffer(button.id);
    })
});

const reset = document.querySelector('#CE');
reset.addEventListener('click', clearAll);
const submit = document.querySelector('[id="="]');
submit.addEventListener('click', runCalculations);

function handleKeyPress(e) {
    console.log(e);

    if (e.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    
    switch (e.key) {
        case "Escape":
            clearAll();
            break;

        case "Backspace": 
            // TODO: Backspace eventually.
            break;

        case "Enter":
        case "=":
            runCalculations();
            break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            updateBuffer(parseInt(e.key));
            break;

        case "/":
        case "*":
        case "+":
        case "-":
            updateBuffer(e.key)
            break;

        default:
            return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    e.preventDefault();
}

window.addEventListener('keydown', handleKeyPress, true);