document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login100-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="pass"]').value;

        const users = JSON.parse(localStorage.getItem('users')) || {};

        const user = users[email];

        if (!user) {
            alert('User not found. Please check your email or register.');
            return;
        }

        const hashedPassword = CryptoJS.PBKDF2(password, user.salt, {
            keySize: 256 / 32,
            iterations: 1000
        }).toString();

        if (hashedPassword === user.passwordHash) {

            alert(`Welcome back, ${user.fullName}!`);

            sessionStorage.setItem('currentUser', JSON.stringify(user));


            window.location.href = '../index.html';
        } else {
            alert('Incorrect password. Please try again.');
        }
    });
});