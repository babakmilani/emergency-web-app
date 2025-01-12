/*-- frontend/javascript/js.js --*/
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission initially
    clearErrors();

    const username = document.getElementById("regUname").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPsw").value.trim();
    const confirmPassword = document.getElementById("regConfirmPassword").value.trim();

    let isValid = true;

    // Validate username
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (username.length < 6 || !usernamePattern.test(username)) {
        showError("regUnameError", "Username must be at least 6 characters long and contain only letters and numbers.");
        isValid = false;
    }

    // Validate email (must be a .gov address)
    const emailPattern = /^[^\s@]+@[^\s@]+\.gov$/;
    if (!emailPattern.test(email)) {
        showError("emailError", "Please enter a valid .gov email address.");
        isValid = false;
    }


    // Validate password
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(password)) {
        showError("passwordError", "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 number.");
        isValid = false;
    }

    // Confirm password match
    if (password !== confirmPassword) {
        showError("confirmPasswordError", "Passwords do not match.");
        isValid = false;
    }

    // Stop submission if validation fails
    if (!isValid) {
        console.log("Validation failed. Form not submitted.");
        return;
    }

    // Submit the form programmatically
    console.log("Validation passed. Submitting the form.");
    this.submit();
});

function clearErrors() {
    document.querySelectorAll(".error").forEach(error => {
        error.style.display = "none";
        error.innerText = "";
    });
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerText = message;
        errorElement.style.display = "block";
    }
}
