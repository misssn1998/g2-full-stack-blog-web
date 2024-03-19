window.addEventListener('load', async function () {
    const registerButton = document.querySelector('#register_button > button');
    const passwordEye = document.querySelector('#password-eye');
    const confirmPasswordEye = document.querySelector('#confirm-password-eye');
    // input selectors
    const fnameInput = document.querySelector('#fname');
    const lnameInput = document.querySelector('#lname');
    const emailInput = document.querySelector('#email');
    const dobInput = document.querySelector('#dob');
    const descriptionInput = document.querySelector('#description');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const confirmPasswordInput = document.querySelector('#confirm-password');
    const formInputs = [
        fnameInput,
        lnameInput,
        emailInput,
        dobInput,
        descriptionInput,
        usernameInput,
        passwordInput,
        confirmPasswordInput,
    ];
    
    // error selectors
    const usernameError = document.querySelector('#username-error');
    const passwordFormatError = document.querySelector(
        '#password-format-error'
    );
    const passwordMatchError = document.querySelector('#password-match-error');
    const emailFormatError = document.querySelector('#email-format-error');

    await windowsOnLoadChecks();
    await addFormVerificationListeners();
    addFormInputAnimationListeners();
    togglePasswordVisibility();

    async function addFormVerificationListeners() {
        usernameInput.addEventListener('input', async () => {
            await checkUsernameInDb();
            registerButtonEnabler();
        });
        passwordInput.addEventListener('input', async () => {
            await checkValidPasswordFormat();
            await checkPasswordsMatch();
            registerButtonEnabler();
        });
        confirmPasswordInput.addEventListener('input', async () => {
            await checkPasswordsMatch();
            registerButtonEnabler();
        });
        emailInput.addEventListener('input', async () => {
            await checkValidEmailFormat();
            registerButtonEnabler();
        });

        fnameInput.addEventListener('input', async () => {
            registerButtonEnabler();
        });

        lnameInput.addEventListener('input', async () => {
            registerButtonEnabler();
        });
    }

    async function checkUsernameInDb() {
        const username = usernameInput.value;
        const response = await fetch(
            `/api/check-username?username=${username}`
        );
        let data = await response.text();
        if (data === 'username exists') {
            usernameError.style.display = '';
            usernameError.innerHTML = 'Username exists, please choose another';
            return false;
        } else {
            usernameError.style.display = 'none';
            usernameError.innerHTML = '';
        }
    }

    async function checkValidPasswordFormat() {
        const password = passwordInput.value;
        const response = await fetch(`/api/validate-password-format`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        let data = await response.text();
        if (data === 'valid') {
            passwordFormatError.style.display = 'none';
            passwordFormatError.innerHTML = '';
            return true;
        } else {
            passwordFormatError.style.display = '';
            passwordFormatError.innerHTML =
                'Password must be at least 5 characters long and include at least 1 special character';
            return false;
        }
    }

    async function checkValidEmailFormat() {
        const email = emailInput.value;
        const response = await fetch(`/api/validate-email-format`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        let data = await response.text();
        if (data === 'valid') {
            emailFormatError.style.display = 'none';
            emailFormatError.innerHTML = '';
            return true;
        } else {
            emailFormatError.style.display = '';
            emailFormatError.innerHTML = 'Please input a valid email format';
            return false;
        }
    }

    async function checkPasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const response = await fetch(`/api/check-passwords-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password, confirmPassword }),
        });
        let data = await response.text();
        if (data === 'passwords match') {
            passwordMatchError.style.display = 'none';
            passwordMatchError.innerHTML = '';
        } else {
            passwordMatchError.style.display = '';
            passwordMatchError.innerHTML = 'Please ensure passwords match';
        }
    }

    function registerButtonEnabler() {
        console.log(usernameError.style.display === 'none')
        if (
            usernameError.style.display === 'none' &&
            passwordFormatError.style.display === 'none' &&
            passwordMatchError.style.display === 'none' &&
            emailFormatError.style.display === 'none'
        ) {
            console.log("im here")
            


            registerButton.disabled = false;
            console.log(fnameInput.value);
            console.log(fnameInput.value == '' &&
            lnameInput.value == '' &&
            emailInput.value == '' &&
            usernameInput.value == '' &&
            passwordInput.value == '' &&
            confirmPasswordInput.value == '');


            if (
                fnameInput.value == '' ||
                lnameInput.value == '' ||
                emailInput.value == '' ||
                usernameInput.value == '' ||
                passwordInput.value == '' ||
                confirmPasswordInput.value == ''
            ) {
                console.log("skeet");
                console.log(fnameInput.value);
                registerButton.style.opacity = '0.3';
            } else {
                console.log("reached");
                registerButton.style.opacity = '1.0';
            }
        } else {
            registerButton.style.opacity = '0.3';
            registerButton.disabled = true;
        }
    }

    function addFormInputAnimationListeners() {
        formInputs.forEach(function (input) {
            input.addEventListener('input', function () {
                checkIfInputFocused(input);
            });
        });
    }

    function checkIfInputFocused(input) {
        const label = input.nextElementSibling;

        if (input.value && input.value.trim() !== '') {
            label.classList.add('focused-label');
            label.classList.remove('label');
            input.style.borderBottomColor = 'black';
            input.style.color = 'black';
        } else {
            label.classList.remove('focused-label');
            label.classList.add('label');
            input.style.borderBottomColor = '#cecece';
            input.style.color = '#cecece';
        }
    }

    function togglePasswordVisibility() {
        passwordEye.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordEye.src = '/images/svg/eye-fill.svg';
                passwordEye.style.opacity = '1';
            } else {
                passwordInput.type = 'password';
                passwordEye.src = '/images/svg/eye.svg';
                passwordEye.style.opacity = '0.3';
            }
        });
        confirmPasswordEye.addEventListener('click', () => {
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                confirmPasswordEye.src = '/images/svg/eye-fill.svg';
                confirmPasswordEye.style.opacity = '1';
            } else {
                confirmPasswordInput.type = 'password';
                confirmPasswordEye.src = '/images/svg/eye.svg';
                confirmPasswordEye.style.opacity = '0.3';
            }
        });
    }

    async function windowsOnLoadChecks() {
        formInputs.forEach(async (input) => {
            checkIfInputFocused(input);
        });
        await checkUsernameInDb();
        await checkValidPasswordFormat();
        await checkPasswordsMatch();
        await checkValidEmailFormat();
        registerButtonEnabler();
    }
});
