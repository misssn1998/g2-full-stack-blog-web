window.addEventListener('load', async function () {


    // const updateProfileBtn = document.querySelector("#my_profile_submit_btn")
    // const profileLoadTick = document.querySelector("#load-tick-profile")
    // const profileDoneTick = document.querySelector("#done-tick-profile")

    // function profileEventListener(){
    //     profileDoneTick.style.display = "none"
    //     profileLoadTick.style.display = "inline-block"
    //     updateProfileBtn.disabled = true
    //     let running = false;
    //     if (!running) {
    //         running = true
    //         const myTimeout = setTimeout(function () {
    //             profileLoadTick.style.display = "none"
    //             profileDoneTick.style.display = "block"   
    //             running = false
    //             updateProfileBtn.disabled = false
    //             const myTimeout1 = setTimeout(function () {
    //                 profileDoneTick.style.display = "none"
    //             }, 5000);
    //         }, 800);
    //     }
    // }

    // const updateSecurityBtn1 = document.querySelector("#update-security-button")
    // const securityLoadTick = document.querySelector("#load-tick-security")
    // const securityDoneTick = document.querySelector("#done-tick-security")

    // function securityEventListener(){
    //     console.log("sddssdsd")
    //     securityDoneTick.style.display = "none"
    //     securityLoadTick.style.display = "inline-block"
    //     updateSecurityBtn1.disabled = true
    //     let running = false;
    //     if (!running) {
    //         running = true
    //         const myTimeout = setTimeout(function () {
    //             securityLoadTick.style.display = "none"
    //             securityDoneTick.style.display = "block"
    //             running = false
    //             updateSecurityBtn1.disabled = false
    //             const myTimeout1 = setTimeout(function () {
    //                 securityDoneTick.style.display = "none"
    //             }, 5000);
    //         }, 800);
    //     }
    // }

    
    // updateSecurityBtn1.addEventListener(`click`, securityEventListener)
    // updateProfileBtn.addEventListener(`click`, profileEventListener)

    const iconInput = document.querySelectorAll('input[name=icon]');
    iconInput.forEach((icon) => {
        icon.addEventListener('click', () => {
            const iconImage = document.getElementById('my-profile-icon-image');
            iconImage.src = `/images/avatars/${icon.value}.png`;
            const iconStorage = document.getElementById('icon_id_temp_storage');
            iconStorage.value = icon.value;
        });
    });

    const updateFormBtn = document.getElementById('my_profile_submit_btn');
    const updateIconButton = document.getElementById('update-icon-btn');
    const icon_container = document.getElementById('icon_container');
    
    updateIconButton.addEventListener('click', function (e) {
        console.log('click');
        if (icon_container.style.display === 'block') {
            icon_container.style.display = 'none';
        } else {
            icon_container.style.display = 'block';
        }
        updateIconButton.classList.toggle('active');
    });

    await deleteAccount();
    await updateInfo();
    await updateSecurityInfo();

    // update securty validation settings
    const updateSecurityBtn = document.querySelector('#update-security-button');
    const emailInput = document.querySelector('#my_profile_email');
    const usernameInput = document.querySelector('#my_profile_username');
    const passwordInput = document.querySelector('#my_profile_password');
    const confirmPasswordInput = document.querySelector(
        '#my_profile_comfirm_password'
    );

    // error selectors
    const usernameError = document.querySelector('#username-error');
    const passwordFormatError = document.querySelector(
        '#password-format-error'
    );
    const passwordMatchError = document.querySelector('#password-match-error');
    const emailFormatError = document.querySelector('#email-format-error');

    await windowsOnLoadChecks();
    await addFormVerificationListeners();

    async function addFormVerificationListeners() {
        usernameInput.addEventListener('input', async () => {
            await checkUsernameInDb();
            updateButtonEnabler();
        });
        passwordInput.addEventListener('input', async () => {
            await checkValidPasswordFormat();
            await checkPasswordsMatch();
            updateButtonEnabler();
        });
        confirmPasswordInput.addEventListener('input', async () => {
            await checkPasswordsMatch();
            updateButtonEnabler();
        });
        emailInput.addEventListener('input', async () => {
            await checkValidEmailFormat();
            updateButtonEnabler();
        });
    }

    async function checkUsernameInDb() {
        const username = usernameInput.value;
        const loggedInUsername = document.querySelector('#loggedInUser').value;
        
        const response = await fetch(
            `/api/check-username?username=${username}`
        );
        let data = await response.text();
        if (data === 'username exists' && username != loggedInUsername) {
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

    function updateButtonEnabler() {
        if (
            usernameError.style.display === 'none' &&
            passwordFormatError.style.display === 'none' &&
            passwordMatchError.style.display === 'none'
        ) {
            updateSecurityBtn.disabled = false;
            updateSecurityBtn.style.opacity = '1.0';
        } else {
            updateSecurityBtn.disabled = true;

            updateSecurityBtn.style.opacity = '0.3';
        }

        if (emailFormatError.style.display === 'none') {
            updateFormBtn.disabled = false;
            updateFormBtn.style.opacity = '1.0';
        } else {
            updateFormBtn.disabled = true;
            updateFormBtn.style.opacity = '0.3';
        }
    }

    async function windowsOnLoadChecks() {
        await checkUsernameInDb();
        await checkValidPasswordFormat();
        await checkPasswordsMatch();
        await checkValidEmailFormat();
        updateButtonEnabler();
    }
});

async function deleteAccount() {
    const deleteAccountForm = document.getElementById('deleteAccount');

    deleteAccountForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const user_id = document.getElementById('user_id_temp_storage').value;
        console.log(user_id);

        const data = {
            userKey: user_id,
        };

        try {
            const response = await fetch('/api/deleteAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.text();

            if (!response.ok) {
                throw new Error(
                    'Request failed with status: ' +
                        response.status +
                        ' ' +
                        responseData
                );
            }
            alert(responseData);

            const directTimer = setTimeout(() => {
                window.location.assign('/');
                clearTimeout(directTimer);
            }, 300);
        } catch (e) {
            alert(e);

            const directTimer = setTimeout(() => {
                location.reload();
                clearTimeout(directTimer);
            }, 300);
        }
    });
}

async function updateInfo() {
    const updateInfoForm = document.getElementById('updateInfo');

    updateInfoForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const icon = document.getElementById('icon_id_temp_storage').value;
        const fname = updateInfoForm.querySelector('#my_profile_fname').value;
        const lname = updateInfoForm.querySelector('#my_profile_lname').value;
        const email = updateInfoForm.querySelector('#my_profile_email').value;
        const DOB = updateInfoForm.querySelector('#my_profile_DOB').value;
        const desc = updateInfoForm.querySelector('#my_profile_desc').value;

        const info = {
            my_profile_fname: fname,
            my_profile_lname: lname,
            my_profile_email: email,
            my_profile_DOB: DOB,
            my_profile_desc: desc,
            icon: icon,
        };

        try {
            const response = await fetch('/api/updateInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(info),
            });

            const responseData = await response.text();

            if (!response.ok) {
                throw new Error(
                    'Request failed with status: ' +
                        response.status +
                        ' ' +
                        responseData
                );
            }

            alert(responseData);

            const directTimer = setTimeout(() => {
                location.reload();
                clearTimeout(directTimer);
            }, 300);
        } catch (e) {
            alert(e);

            const directTimer = setTimeout(() => {
                location.reload();
                clearTimeout(directTimer);
            }, 300);
        }
    });
}

async function updateSecurityInfo() {
    const updateSecurityForm = document.getElementById('update-security-info');

    updateSecurityForm.addEventListener('submit', async function (e) {
        e.preventDefault();


        const currentPassword = document.querySelector('#current_password').value;
        const username = document.querySelector('#my_profile_username').value;
        const password = document.querySelector('#my_profile_password').value;
        const confirmPassword = document.querySelector('#my_profile_comfirm_password').value;

        const info = {
            my_profile_currentPassword: currentPassword,
            my_profile_username: username,
            my_profile_password: password,
            my_profile_confirmPassword: confirmPassword,
        };

        try {
            const response = await fetch('/api/updateSecurityInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(info),
            });

            const responseData = await response.text();

            if (!response.ok) {
                throw new Error(
                    'Request failed with status: ' +
                        response.status +
                        ' ' +
                        responseData
                );
            }

            alert(responseData);

            const directTimer = setTimeout(() => {
                location.reload();
                clearTimeout(directTimer);
            }, 300);
        } catch (e) {
            alert(e);

            const directTimer = setTimeout(() => {
                location.reload();
                clearTimeout(directTimer);
            }, 300);
        }
    });
}