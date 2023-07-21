import { checkIfNotEmpty, checkIfValidPassword } from './common.js';

const inputUserName = document.getElementById("inputUserName");
const inputPassword = document.getElementById("inputPassword");
const inputConfirmPassword = document.getElementById("inputConfirmPassword");
const rememberCheck = document.getElementById("rememberCheck");
const registerBtn = document.getElementById("registerBtn");
const userNameHelp = document.getElementById("userNameHelp");
const passwordHelp = document.getElementById("passwordHelp");
const confirmPasswordHelp = document.getElementById("confirmPasswordHelp");

// Flag for notice if all validation are clear.
let registerFlag = true;

// Register event 
registerBtn.addEventListener('click', async () => {
    registerFlag = true;

    const registerData = {
        userName: inputUserName.value,
        password: inputPassword.value,
        confirmPassword: inputConfirmPassword.value,
        rememberCheck: rememberCheck.checked
    }

    //--------- Reset Message -----------
    userNameHelp.innerText = 'The user name is not valid';
    passwordHelp.innerText = 'The password is not valid. Minimum 8 caracter';
    confirmPasswordHelp.innerText = 'The password is not match';

    //--------- Validate inputData -----------

    // Validate userName 
    if (!checkIfNotEmpty(registerData.userName)) {
        userNameHelp.classList.remove('hidden')
        registerFlag = false;
    } else {
        // Check if the userName is already exist
        let result = await window.auth.registerCheck(registerData);
        if (!result.registerCheck) {
            userNameHelp.innerText = 'The user name is already exists';
            userNameHelp.classList.remove('hidden');
            registerFlag = false;
        } else {
            userNameHelp.classList.add('hidden');
        }
    }

    // Validete password
    if (!checkIfValidPassword(registerData.password)) {
        passwordHelp.classList.remove('hidden');
        registerFlag = false;
    }else{
        passwordHelp.classList.add('hidden');
    }

    // Validate confirmPassword
    if(registerData.password !== registerData.confirmPassword) {
        confirmPasswordHelp.classList.remove('hidden');
        registerFlag = false;
    } else{
        confirmPasswordHelp.classList.add('hidden');
    }

    // Register and login 
    if (registerFlag) {
        await window.auth.register(registerData);
        let login = await window.auth.login(registerData);

        if(login.login)  window.location.href = '../html/category.html?category-name=All&category-id=99999&user=' + encodeURIComponent(login.login);

    }

})