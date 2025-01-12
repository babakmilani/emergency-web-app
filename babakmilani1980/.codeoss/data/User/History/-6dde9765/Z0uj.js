/*--frontend/javascript/report.js--*/

/*--frontend/javascript/report.js--*/

// Set default input styles for validation
var alertRedInput = "#8C1010";
var defaultInput = "rgba(10, 180, 180, 1)";

// Validation functions for the form fields (example)
function userNameValidation(usernameInput) {
    var username = document.getElementById("username");
    var issueArr = [];
    if (/[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(usernameInput)) {
        issueArr.push("No special characters!");
    }
    if (issueArr.length > 0) {
        username.setCustomValidity(issueArr);
        username.style.borderColor = alertRedInput;
    } else {
        username.setCustomValidity("");
        username.style.borderColor = defaultInput;
    }

    // Clear the form after successful submission
    document.getElementById("username").value = '';
}

function passwordValidation(passwordInput) {
    var password = document.getElementById("password");
    var issueArr = [];
    if (!/^.{7,15}$/.test(passwordInput)) {
        issueArr.push("Password must be between 7-15 characters.");
    }
    if (!/\d/.test(passwordInput)) {
        issueArr.push("Must contain at least one number.");
    }
    if (!/[a-z]/.test(passwordInput)) {
        issueArr.push("Must contain a lowercase letter.");
    }
    if (!/[A-Z]/.test(passwordInput)) {
        issueArr.push("Must contain an uppercase letter.");
    }
    if (issueArr.length > 0) {
        password.setCustomValidity(issueArr.join("\n"));
        password.style.borderColor = alertRedInput;
    } else {
        password.setCustomValidity("");
        password.style.borderColor = defaultInput;
    }

    // Clear the form after successful submission
    document.getElementById("password").value = '';
}

// Function to display the flash message modal
const showFlashMessage = (message) => {
    const flashModal = document.getElementById('flashModal');
    const flashMessage = document.getElementById('flashMessage');
    flashMessage.textContent = message;
    flashModal.style.display = 'block';
};

// Close modal when the user clicks the close button
const closeFlashModal = () => {
    const flashModal = document.getElementById('flashModal');
    flashModal.style.display = 'none'; // Hide the modal
};

// Function to close flash message modal after a delay or on button click
document.querySelector('#flashModal button').addEventListener('click', closeFlashModal);



