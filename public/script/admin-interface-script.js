window.addEventListener('load', async function () {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const getUsersButton = document.getElementById('getUsersButton');
    const deleteUserButton = document.getElementById('deleteUserButton');
    const result = document.getElementById('result');

    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        const response = await fetch(`/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (response.status === 204) {
            result.textContent = 'Logged in successfully'
        } else {
            result.textContent = `Login failed with status ${response.status}`;
        }
    });

    logoutButton.addEventListener('click', async () => {
        const response = await fetch(`/api/logout`);
        if (response.status === 200) {
            const data = await response.text();
            result.textContent = data;
        } else {
            result.textContent = `Logout failed with status ${response.status}`;
        }
    });

    getUsersButton.addEventListener('click', async () => {
        const response = await fetch(`/api/users`);
        if (response.status === 200) {
            const data = await response.json();
            result.textContent = JSON.stringify({ data });
        } else {
            result.textContent = `Unauthorized with status ${response.status}`;
        }
    });

    deleteUserButton.addEventListener('click', async () => {
        const userId = document.getElementById('userIdInput').value;
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
        });
        if (response.status === 204) {
            result.textContent = `User with id ${userId} deleted successfully`;
        } else {
            result.textContent = `Unauthorized with status ${response.status}`;
        }
    });
});
