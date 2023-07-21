import { checkIfNotEmpty } from './common.js';

const userNameInput = document.getElementById("userNameInput");
const passwordInput = document.getElementById("passwordInput");
const rememberCheck = document.getElementById("rememberCheck");
const userNameLabel = document.getElementById("userNameLabel");
const passwordLabel = document.getElementById("passwordLabel");
const loginBtn = document.getElementById("loginBtn");
const loginErrMessage = document.getElementById("loginErrMessage");

// Get RememberUser when loaded
window.addEventListener("DOMContentLoaded", async (event) => {
    const rememberUser = await window.auth.getRemember();

    // Change style of form 
    if (rememberUser.rememberUser) {
        userNameInput.setAttribute('data-te-input-state-active', '')
        passwordInput.setAttribute('data-te-input-state-active', '')

        const userNameBox = userNameLabel.nextElementSibling;
        const passwordBox = passwordLabel.nextElementSibling;
        userNameBox.setAttribute('data-te-input-state-active', '')
        passwordBox.setAttribute('data-te-input-state-active', '')

        userNameInput.value = rememberUser.rememberUser.name;
        passwordInput.value = rememberUser.rememberUser.password;
        rememberCheck.checked = true;
    }
});

// Login event
loginBtn.addEventListener('click', async () => {
    const loginData = {
        userName: userNameInput.value,
        password: passwordInput.value,
        rememberCheck: rememberCheck.checked
    }

    // Check if the name and pass is correct
    let result = await window.auth.login(loginData);

    // If the data is correct, link to home.
    (result.login) ? window.location.href = '../html/category.html?category-name=All&category-id=99999&user=' + encodeURIComponent(result.login) : loginErrMessage.classList.remove('hidden');
})