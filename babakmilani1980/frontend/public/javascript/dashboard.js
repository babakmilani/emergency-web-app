const profileImage = document.getElementById('profile-image'); 
const imageUpload = document.getElementById('image-upload'); 
const uploadForm = document.getElementById('uploadForm'); 
const hiddenUpload = document.getElementById('hidden-upload'); 
profileImage.addEventListener('click', () => { 
    imageUpload.click(); 
}); 

imageUpload.addEventListener('change', () => { 
    hiddenUpload.files = imageUpload.files; 
    uploadForm.submit(); 
});