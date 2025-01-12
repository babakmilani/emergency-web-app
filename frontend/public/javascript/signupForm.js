/*-- Sign Up form DOM validator 
-----signUpForm.js
--*/

document.getElementById("myForm").addEventListener("submit", function (event) {
    clearErrors(); // Clear previous error messages

    const fullName = document.getElementById("fullname").value.trim();
    const emailSign = document.getElementById("emailSign").value.trim();
    const sms = document.getElementById("sms").value.trim();

    let isValid = true;

    // Validate full name
    const namePattern = /^[A-Za-z\s-]+$/;
    if (!namePattern.test(fullName)) {
        showError("fullName", "Please enter a valid name (alphabetic characters, spaces, and hyphens only).");
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.*$/;
    if (!emailPattern.test(emailSign)) {
        showError("emailError", "Please enter a valid email address.");
        isValid = false;
    }

    // Validate 10-digit phone number 
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(sms)) {
        showError("smsError", "Please enter a valid 10-digit phone number.");
        isValid = false;
    }

    // If the form is invalid, prevent submission
    if (!isValid) {
        event.preventDefault(); // Stop form submission
    }
});

function clearErrors() {
    document.querySelectorAll(".error").forEach(error => {
        error.style.display = "none";
        error.innerText = "";
    });
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.innerText = message;
    errorElement.style.display = "block";
}
