// Common Functions 

/**
 * Check if the string isn't empty.  
 * @param {string} str 
 * @returns Boolean
 */
function checkIfNotEmpty(str) {
    const value = str.trim();
    return (value.length == 0) ? false : true;
}

/**
 * Check if the string has more than 8 caracter.
 * @param {string} str 
 * @returns Boolean
 */
function checkIfValidPassword(str) {
    const value = str.trim();
    return (value.length < 8) ? false : true;
}

/**
 * Check if the string is number(can convert to num) and more than 0.
 * @param {string} num 
 * @returns Boolean
 */
function checkNum(num) {
    const value = num.trim();
    return (value < 0 || isNaN(value)) ? false : true;
}

export { checkIfNotEmpty, checkIfValidPassword, checkNum }