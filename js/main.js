if (typeof CryptoJS === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    document.head.appendChild(script);
}

(function ($) {
    "use strict";

    class UserStorage {
        static getUsers() {
            const users = localStorage.getItem('users');
            return users ? JSON.parse(users) : {};
        }

        static saveUser(email, userData) {
            const users = this.getUsers();
            users[email] = userData;
            localStorage.setItem('users', JSON.stringify(users));
        }

        static userExists(email) {
            const users = this.getUsers();
            return !!users[email];
        }

        static getUser(email) {
            const users = this.getUsers();
            return users[email];
        }
    }

    function hashPassword(password, salt) {
        const hash = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 1000
        });
        return hash.toString();
    }

    function generateSalt() {
        return CryptoJS.lib.WordArray.random(128 / 8).toString();
    }

    function verifyPassword(password, storedHash, salt) {
        const hashedPassword = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 1000
        }).toString();
        return hashedPassword === storedHash;
    }

    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function (e) {
        e.preventDefault();
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) === false) {
                showValidate(input[i]);
                check = false;
            }
        }

        if (check) {
            const email = $('input[name="email"]').val().trim();
            const password = $('input[name="pass"]').val().trim();

            const isRegistration = $('input[name="fullname"]').length > 0;

            if (isRegistration) {
                handleRegistration(email, password);
            } else {
                handleLogin(email, password);
            }
        }

        return false;
    });

    function handleRegistration(email, password) {
        const confirmPass = $('input[name="confirm-pass"]').val();
        const fullName = $('input[name="fullname"]').val();

        if (password !== confirmPass) {
            showValidate($('input[name="confirm-pass"]')[0]);
            $('input[name="confirm-pass"]').parent().attr('data-validate', 'Passwords do not match');
            return;
        }

        if (UserStorage.userExists(email)) {
            showValidate($('input[name="email"]')[0]);
            $('input[name="email"]').parent().attr('data-validate', 'Email already registered');
            return;
        }

        const salt = generateSalt();
        const hashedPassword = hashPassword(password, salt);

        const userData = {
            fullName: fullName,
            email: email,
            passwordHash: hashedPassword,
            salt: salt,
            registeredAt: new Date().toISOString()
        };

        try {
            UserStorage.saveUser(email, userData);
            alert('Registration successful! You can now login.');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Error during registration. Please try again.');
            console.error('Registration error:', error);
        }
    }

    function handleLogin(email, password) {
        const userData = UserStorage.getUser(email);

        if (!userData) {
            showValidate($('input[name="email"]')[0]);
            $('input[name="email"]').parent().attr('data-validate', 'User not found');
            return;
        }

        if (verifyPassword(password, userData.passwordHash, userData.salt)) {
            sessionStorage.setItem('loggedInUser', JSON.stringify({
                email: email,
                fullName: userData.fullName,
                loginTime: new Date().toISOString()
            }));

            alert(`Welcome back, ${userData.fullName}!`);
        } else {
            showValidate($('input[name="pass"]')[0]);
            $('input[name="pass"]').parent().attr('data-validate', 'Invalid password');
        }
    }

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if ($(input).val().trim().match(emailPattern) == null) {
                return false;
            }
        }
        else if ($(input).attr('type') === 'password' || $(input).attr('name') === 'pass') {
            if ($('input[name="fullname"]').length > 0) {
                if ($(input).val().trim().length < 6) {
                    return false;
                }
            } else {
                if ($(input).val().trim() === '') {
                    return false;
                }
            }
        }
        else {
            if ($(input).val().trim() === '') {
                return false;
            }
        }
        return true;
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
        $(thisAlert).removeAttr('data-validate');
    }

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const alertShown = sessionStorage.getItem('alertShown');

    if (loggedInUser && !$('input[name="fullname"]').length && !alertShown) {
        const userData = JSON.parse(loggedInUser);
        alert(`Already logged in as ${userData.fullName}`);
        sessionStorage.setItem('alertShown', 'true');
    }

})(jQuery);