// Load CryptoJS library if not already loaded
if (typeof CryptoJS === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    document.head.appendChild(script);
}

(function ($) {
    "use strict";

    /**
     * UserStorage class for handling user data in localStorage
     */
    class UserStorage {
        // Retrieve all users from localStorage
        static getUsers() {
            const users = localStorage.getItem('users');
            return users ? JSON.parse(users) : {};
        }

        // Save a user to localStorage
        static saveUser(email, userData) {
            const users = this.getUsers();
            users[email] = userData;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Check if a user exists in localStorage
        static userExists(email) {
            const users = this.getUsers();
            return !!users[email];
        }

        // Retrieve a specific user from localStorage
        static getUser(email) {
            const users = this.getUsers();
            return users[email];
        }
    }

    /**
     * Hash a password with a given salt using PBKDF2
     */
    function hashPassword(password, salt) {
        const hash = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 1000
        });
        return hash.toString();
    }

    /**
     * Generate a random salt
     */
    function generateSalt() {
        return CryptoJS.lib.WordArray.random(128 / 8).toString();
    }

    // Save form data to local storage
    function saveStepData(stepNumber, data) {
        localStorage.setItem(`registrationStep${stepNumber}`, JSON.stringify(data));
    }

    // Load form data from local storage
    function loadStepData(stepNumber) {
        const data = localStorage.getItem(`registrationStep${stepNumber}`);
        return data ? JSON.parse(data) : null;
    }

    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate current step
    function validateStep(stepNumber) {
        const step = document.getElementById(`step${stepNumber}`);
        const inputs = step.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            const parentDiv = input.closest('.wrap-input100');

            // Remove previous validation states
            parentDiv.classList.remove('alert-validate');

            // Check if input is empty
            if (!input.value.trim()) {
                parentDiv.classList.add('alert-validate');
                parentDiv.setAttribute('data-validate', 'This field is required');
                isValid = false;
                return;
            }

            // Specific validations
            switch (input.name) {
                case 'email':
                    if (!isValidEmail(input.value)) {
                        parentDiv.classList.add('alert-validate');
                        parentDiv.setAttribute('data-validate', 'Invalid email format');
                        isValid = false;
                    }
                    break;
                case 'age':
                    const age = parseInt(input.value);
                    if (isNaN(age) || age < 18 || age > 120) {
                        parentDiv.classList.add('alert-validate');
                        parentDiv.setAttribute('data-validate', 'Age must be between 18 and 120');
                        isValid = false;
                    }
                    break;
                case 'weight':
                    const weight = parseFloat(input.value);
                    if (isNaN(weight) || weight < 20 || weight > 300) {
                        parentDiv.classList.add('alert-validate');
                        parentDiv.setAttribute('data-validate', 'Invalid weight');
                        isValid = false;
                    }
                    break;
                case 'Password':
                    if (input.value.length < 8) {
                        parentDiv.classList.add('alert-validate');
                        parentDiv.setAttribute('data-validate', 'Password must be at least 8 characters');
                        isValid = false;
                    }
                    break;
            }
        });

        return isValid;
    }

    // Show/hide steps
    function showStep(stepNumber) {
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');
    }

    // Navigation between steps
    function nextStep(currentStep) {
        event.preventDefault(); // Prevent form submission
        if (validateStep(currentStep)) {
            const formData = new FormData(document.getElementById('registrationForm'));
            const stepData = Object.fromEntries(formData.entries());
            saveStepData(currentStep, stepData);
            showStep(currentStep + 1);
        }
    }

    function previousStep(currentStep) {
        event.preventDefault(); // Prevent form submission
        showStep(currentStep - 1);
    }

    // Complete registration
    function completeRegistration() {
        event.preventDefault(); // Prevent form submission
        if (validateStep(5)) {
            const formData = new FormData(document.getElementById('registrationForm'));
            const userData = Object.fromEntries(formData.entries());

            // Collect all step data
            for (let i = 1; i <= 5; i++) {
                const stepData = loadStepData(i);
                if (stepData) {
                    Object.assign(userData, stepData);
                }
            }

            // Check if user already exists
            if (UserStorage.userExists(userData.email)) {
                alert('A user with this email already exists');
                return;
            }

            // Generate a salt and hash the password
            const salt = generateSalt();
            const passwordHash = hashPassword(userData.Password, salt);

            // Prepare final user data
            const finalUserData = {
                fullName: userData.fullname,
                email: userData.email,
                age: userData.age,
                address: userData.address,
                weight: userData.weight,
                billingAddress: userData.address,
                creditCard: userData.credit_card,
                expiryDate: userData.expiry_date,
                cvv: userData.cvv,
                phone: userData.phone,
                emergencyContact: userData.emergency_contact,
                billingCycle: userData.billing_cycle,
                membershipTier: userData.membership_tier,
                securityQuestions: {
                    pet: userData.sequrityQuestion1,
                    maidenName: userData.sequrityQuestion2
                },
                passwordHash: passwordHash,
                salt: salt
            };

            // Save user data
            UserStorage.saveUser(userData.email, finalUserData);

            // Clear step data
            for (let i = 1; i <= 5; i++) {
                localStorage.removeItem(`registrationStep${i}`);
            }

            alert('Registration Completed Successfully!');
            window.location.href = 'login.html';
        }
    }

    // Load saved data when page loads
    window.onload = function () {
        for (let i = 1; i <= 5; i++) {
            const savedData = loadStepData(i);
            if (savedData) {
                Object.entries(savedData).forEach(([key, value]) => {
                    const element = document.querySelector(`[name="${key}"]`);
                    if (element) element.value = value;
                });
            }
        }
    };

    // Expose functions globally for onclick events
    window.nextStep = nextStep;
    window.previousStep = previousStep;
    window.completeRegistration = completeRegistration;

})(jQuery);

// Run code once the document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const billingCycleButton = document.getElementById('billing-cycle-btn');
    const membershipTiers = document.querySelectorAll('.membership-tier');
    const billingCycleMultipliers = {
        weekly: 1 / 4,
        monthly: 1,
        yearly: 12
    };

    // Add event listener to each dropdown item
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            const selectedCycle = this.id;
            billingCycleButton.textContent = this.textContent;

            // Update membership tier prices based on selected billing cycle
            membershipTiers.forEach(tier => {
                const basePrice = parseFloat(tier.getAttribute('data-price'));
                const newPrice = (basePrice * billingCycleMultipliers[selectedCycle]).toFixed(2);
                tier.querySelector('.price').textContent = `$${newPrice}/${selectedCycle}`;
            });
        });
    });
});

/* Svg update */
document.addEventListener('DOMContentLoaded', function () {
    const accountLogoContainer = document.querySelector('.account-logo-container img');
    const loginButton = document.querySelector('.login100-form-btn[onclick*="login.html"]');

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser) {
        accountLogoContainer.src = '../images/icons/yesUser.svg';
        accountLogoContainer.alt = 'Logged In User';

        loginButton.textContent = 'LOGOUT';
        loginButton.onclick = function () {
            sessionStorage.removeItem('currentUser');

            alert('You have been logged out successfully.');

            window.location.href = 'pages/login.html';
        };
    } else {
        accountLogoContainer.src = '../images/icons/noUser.svg';
        accountLogoContainer.alt = 'No User Logged In';

        loginButton.textContent = 'LOGIN OR SIGN UP';
        loginButton.onclick = function () {
            window.location.href = 'pages/login.html';
        };
    }
});