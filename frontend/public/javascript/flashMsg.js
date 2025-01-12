//flashMsg.js
/*----Flash message for registration form----*/


// Display flash message modal
const showFlashMessage = (message) => {
    const flashModal = document.getElementById('flashModal');
    const flashMessage = document.getElementById('flashMessage');
    flashMessage.textContent = message;
    flashModal.style.display = 'block';
};

// Close modal
const closeFlashModal = () => {
    document.getElementById('flashModal').style.display = 'none';
};

// Show the relevant message if available
if (successMessage) {
    showFlashMessage(successMessage);
} else if (errorMessage) {
    showFlashMessage(errorMessage);
}

// Modal Logic
var modal = document.getElementById('id01'); // The login modal
var flashModal = document.getElementById('flashModal'); // The flash message modal


function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}


