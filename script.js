        // Display and memory related variables
        let mainDisplay = document.getElementById('mainDisplay');
        let operationHistory = document.getElementById('operationHistory');
        let memoryPanel = document.getElementById('memoryPanel');
        let memory = [];  // Holds values added to memory
        let currentOperator = null;
        let firstOperand = null;
        let secondOperand = null;
        let currentOperation = ''; // Holds the current operation (e.g., '9 + 9')
        let previousOperation = ''; // Holds completed operation (e.g., '9 + 9 =')

        // Function to clear the display and reset operations
        function clearDisplay() {
            mainDisplay.textContent = '0';  // Reset main display
            currentOperator = null;
            currentOperation = '';  // Reset current operation
            previousOperation = ''; // Reset previous operation history
            operationHistory.textContent = ''; // Clear operation history
            updateOperationHistory();  // Update operation display
        }
        
// Function to calculate percentage
function percent() {
    if (firstOperand !== null && currentOperator === null) {
        let result = firstOperand / 100;
        mainDisplay.textContent = result;
        previousOperation = `${firstOperand} % =`;
        operationHistory.textContent = previousOperation;  // Update operation history
        firstOperand = result;
    }
}

// Function to delete the last digit or operator
function deleteLast() {
    let currentText = mainDisplay.textContent;

    if (currentText.length > 1) {
        mainDisplay.textContent = currentText.slice(0, -1); // Remove last character
    } else {
        mainDisplay.textContent = '0'; // Reset to 0 if no digits remain
    }
    updateOperationHistory();  // Update operation history
}

        // Function to append numbers to the display
        function appendNumber(number) {
            if (mainDisplay.textContent === '0' || (currentOperator && secondOperand === null)) {
                mainDisplay.textContent = number;
            } else {
                mainDisplay.textContent += number;
            }

            // Update operands based on the operator status
            if (currentOperator === null) {
                firstOperand = parseFloat(mainDisplay.textContent);
            } else {
                secondOperand = parseFloat(mainDisplay.textContent);
            }

            updateOperationHistory();  // Update operation history on display
        }

        // Function to append decimal point to the display
        function appendDecimal() {
            if (!mainDisplay.textContent.includes('.')) {
                mainDisplay.textContent += '.';
            }
        }

        // Set the operator (e.g., +, -, X, ÷) for the operation
        function setOperator(operator) {
            if (currentOperator && secondOperand !== null) {
                calculate();  // If there's a previous operator and second operand, calculate it first
            }
            currentOperator = operator;
            currentOperation = `${mainDisplay.textContent} ${operator}`;  // Build current operation string
            updateOperationHistory();  // Update operation display
        }

        // Perform the calculation and display the result
        function calculate() {
            if (currentOperator && firstOperand !== null && secondOperand !== null) {
                let result;
                switch (currentOperator) {
                    case '+':
                        result = firstOperand + secondOperand;
                        break;
                    case '-':
                        result = firstOperand - secondOperand;
                        break;
                    case 'X':
                        result = firstOperand * secondOperand;
                        break;
                    case '/':
                        if (secondOperand === 0) {
                            alert('Cannot divide by zero');
                            return;
                        }
                        result = firstOperand / secondOperand;
                        break;
                    default:
                        return;
                }

                mainDisplay.textContent = result;
                previousOperation = `${currentOperation} ${secondOperand} =`;
                operationHistory.textContent = previousOperation;  // Update the operation history
                currentOperator = null;
                firstOperand = result;
                secondOperand = null;
                currentOperation = '';
            }
        }

        // Toggle the sign of the current number (positive/negative)
        function toggleSign() {
            let currentValue = parseFloat(mainDisplay.textContent);
            mainDisplay.textContent = -currentValue;
            updateOperationHistory();  // Update operation history
        }

        // Function to update the operation history area
        function updateOperationHistory() {
            operationHistory.textContent = currentOperation;
        }

        // Toggle between memory panel visibility
        function toggleMemoryPanel() {
            memoryPanel.style.display = (memoryPanel.style.display === 'none' || !memoryPanel.style.display) ? 'block' : 'none';
        }

        // Add current value to memory
        function addToMemory() {
            let currentValue = parseFloat(mainDisplay.textContent);
            if (!isNaN(currentValue)) {
                // If memory already has a value, update it, otherwise store the current value
                memory[0] = (memory[0] || 0) + currentValue; 
                updateMemoryPanel(); // Update the memory panel
            }
        }
        // save current value to memory
        function memorySave() {
            let value = parseFloat(mainDisplay.textContent);
            if (!isNaN(value)) {
                memory.unshift(value);
                updateMemoryPanel();
            }
        }

        // Subtract current value from memory
        function subtractFromMemory() {
            let currentValue = parseFloat(mainDisplay.textContent);
            if (!isNaN(currentValue)) {
                // If memory already has a value, update it, otherwise store the current value
                memory[0] = (memory[0] || 0) - currentValue; 
                updateMemoryPanel(); // Update the memory panel
            }
        }

        // Recall the most recent memory value
        function recallMemory() {
            if (memory.length > 0) {
                mainDisplay.textContent = memory[memory.length - 1];
            }
        }

        // Clear memory
        function clearMemory() {
            memory = [];
            updateMemoryPanel();
        }
// Update the most recent memory with the current value, maintaining other values
function updateMemory() {
    let currentValue = parseFloat(mainDisplay.textContent);
    if (!isNaN(currentValue)) {
        // Add the current value to the front of the memory array (most recent first)
        memory.unshift(currentValue);
        updateMemoryPanel();  // Update the memory panel to reflect the change
    }
}

        // Update the memory panel to display memory items
        function updateMemoryPanel() {
            memoryPanel.innerHTML = '';
            memory.forEach((value, index) => {
                let div = document.createElement('div');
                div.classList.add('memory-item');
                div.innerHTML = `${value} <button onclick="deleteMemoryItem(${index})">Delete</button>`;
                memoryPanel.appendChild(div);
            });
        }

        // Delete a specific item from memory
        function deleteMemoryItem(index) {
            memory.splice(index, 1);
            updateMemoryPanel();
        }

        let hasBase = false;
        let fromBase = 'decimal';
        
        function conversion(type) {
            let value = mainDisplay.textContent.trim();
        
            if (!isNaN(value) && value !== '') {
                if (parseInt(value) === 0 && !hasBase) {
                    fromBase = type;
                    hasBase = true;
                    console.log("The base is " + type);
                    updateBaseIndicator(type);
                } else if (!hasBase) {
                    convertDecimal(type);
                    updateBaseIndicator(type);
                } else {
                    console.log("Converting from " + fromBase + " to " + type);
                    convertBases(fromBase, type);
                    updateBaseIndicator(type);
                }
            } else {
                alert('Invalid input for conversion');
            }
        }
        
        function convertDecimal(toBase) {
            let value = parseInt(mainDisplay.textContent);
            switch (toBase) {
                case 'binary':
                    mainDisplay.textContent = value.toString(2);
                    break;
                case 'octal':
                    mainDisplay.textContent = value.toString(8);
                    break;
                case 'hex':
                    mainDisplay.textContent = value.toString(16).toUpperCase();
                    break;
            }
        }
        
        function convertBases(fromBase, toBase) {
            let value = mainDisplay.textContent;
        
            let numericFromBase;
            switch (fromBase) {
                case 'binary':
                    numericFromBase = 2;
                    break;
                case 'octal':
                    numericFromBase = 8;
                    break;
                case 'decimal':
                    numericFromBase = 10;
                    break;
                case 'hex':
                    numericFromBase = 16;
                    break;
                default:
                    alert('Invalid fromBase for conversion');
                    return;
            }
        
            const decimalValue = parseInt(value, numericFromBase);
            if (isNaN(decimalValue)) {
                alert('Invalid input for conversion from ' + fromBase);
                return;
            }
        
            switch (toBase) {
                case 'binary':
                    mainDisplay.textContent = decimalValue.toString(2);
                    break;
                case 'octal':
                    mainDisplay.textContent = decimalValue.toString(8);
                    break;
                case 'hex':
                    mainDisplay.textContent = decimalValue.toString(16).toUpperCase();
                    break;
                default:
                    alert('Invalid toBase for conversion');
            }
        
            hasBase = false; // Reset after conversion
        }
        
        function updateBaseIndicator(base) {
            const baseIndicator = document.getElementById('base-indicator');
            switch (base) {
                case 'binary':
                    baseIndicator.style.background = '#f0951f';
                    break;
                case 'octal':
                    baseIndicator.style.background = 'blue';
                    break;
                case 'hex':
                    baseIndicator.style.background = 'green';
                    break;
                default:
                    baseIndicator.style.background = '#940303'; // Default red
            }
        }
        
        function resetBase() {
            hasBase = false;
            fromBase = 'decimal';
            updateBaseIndicator('decimal'); // Reset indicator to default
        }
        
    
      
        // Function to toggle between dark and light mode
        function toggleTheme() {
            document.body.classList.toggle('light-mode');
            let themeLabel = document.getElementById('themeLabel');
            if (document.body.classList.contains('light-mode')) {
                themeLabel.textContent = 'Dark';
            } else {
                themeLabel.textContent = 'Light';
            }
        }

        // Set default values on load
        window.onload = () => {
            memoryPanel.style.display = 'none'; // Initially hide memory panel
        };

        // Code made by Justin James Corral BSIT 3-3 2024 
