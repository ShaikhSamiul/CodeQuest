// code for detaisl class
function toggleEdit() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const editButton = document.getElementById('editButton');
    // const saveButton = document.getElementById('saveButton');

    // If in view mode, switch to edit mode
    if (emailInput.readOnly) {
        emailInput.readOnly = false;
        passwordInput.readOnly = false;
        editButton.style.display = 'inline';  // Hide edit button
        // saveButton.style.display = 'inline';  // Show save button
    } else {
        emailInput.readOnly = true;
        passwordInput.readOnly = true;
        editButton.style.display = 'inline';  // Show edit button
        // saveButton.style.display = 'none';  // Hide save button
    }
}

// Form submit handler (to be implemented based on your backend)
// document.getElementById('accountDetailsForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     // Implement the logic to send updated email/password to your server
// });


/* flaoting edit */
function toggleFloatingEdit() {
    const overlay = document.getElementById('editFormOverlay');

    // Toggle visibility of the floating form
    if (overlay.style.display === 'none' || overlay.style.display === '') {
        overlay.style.display = 'flex';
        document.body.classList.add('modal-open'); // Prevent scrolling
    } else {
        overlay.style.display = 'none';
        document.body.classList.remove('modal-open'); // Re-enable scrolling
    }
}

function closeEditForm() {
    const overlay = document.getElementById('editFormOverlay');
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open'); // Re-enable scrolling
}

// Close the form when the "Escape" key is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditForm();
    }
});

// Close the form if clicking outside of the form
document.getElementById('editFormOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        closeEditForm();
    }
});


const theme = document.getElementById('themeToggle');
document.addEventListener('DOMContentLoaded', function() {
    //selected theme 
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(currentTheme + '-theme');
    document.getElementById('themeToggle').checked = currentTheme === 'light';

    //for whole css..
    if (currentTheme == "light"){
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }else{
        document.body.classList.toggle('light-theme', theme === 'light');
    } 
})

async function validatePassword(){
    const currentPassword = document.getElementById('current-password').value;
    const signupUsername = document.getElementById('signup-username');
    const email = document.getElementById('email');
    const signupPassword = document.getElementById('signup-password');
    const confirmPasword = document.getElementById('cnf-password');

    console.log(currentPassword)
    const response = await fetch('/validatePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            password: currentPassword
        })
    });
    const data = await response.json();
    
    if (data.success) {
        document.getElementById("current-password").style.display = "none";
        document.getElementById("cpLabel").style.display = "none";
        document.getElementById("validatePasswordButton").style.display = "none";
        
        signupUsername.style.display = 'inline';
        email.style.display = 'inline';
        signupPassword.style.display = 'inline';
        confirmPasword.style.display = 'inline';
        document.getElementById("saveButton").style.display = "inline";


    } else {
        alert('Incorrect password');
    }
}

async function saveDetails(){
    const signupUsername = document.getElementById('signup-username').value;
    const email = document.getElementById('email').value;
    const signupPassword = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('cnf-password').value;

    const response = await fetch('/saveDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username: signupUsername,
            email: email,
            password: signupPassword,
            confirmPassword: confirmPassword
        })
    });
    const data = await response.json();

    if (data.success) {
        alert('Details saved successfully');
        window.location.reload();
    } else {
        alert('Failed to save details: '+data.message);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('signup-username');
    const availableText = document.getElementById('available');
    
    const emailInput = document.getElementById('email');
    const availableEmail = document.getElementById('available-email');

    usernameInput.addEventListener('blur', function() {
        const username = usernameInput.value;
        
        if (username.length === 0) {
            availableText.textContent = '';
            return;
        }

       
        fetch(`/check-username?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.available) {
                    availableText.textContent = 'Username Available';
                    availableText.style.color = '#53e853';
                } else {
                    availableText.textContent = 'Username Taken';
                    availableText.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error checking username:', error);
                availableText.textContent = 'Error checking username';
                availableText.style.color = 'red';
            });
    });

    emailInput.addEventListener('blur', function() {
        const email = emailInput.value;
        
        if (email.length === 0) {
            availableText.textContent = '';
            return;
        }

       
        fetch(`/check-email?email=${email}`)
            .then(response => response.json())
            .then(data => {
                if (data.available) {
                    availableEmail.textContent = '';
                } else {
                    availableEmail.textContent = data.message;
                    availableEmail.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error checking email:', error);
                availableText.textContent = 'Error checking email';
                availableText.style.color = 'red';
            });
    });

    const password = document.getElementById('signup-password');
    const confirm_password = document.getElementById('cnf-password');
    const password_check = document.getElementById('password-check');
    confirm_password.addEventListener('blur', function(){
        if (confirm_password.length === 0) {
            password_check.textContent = '';
            return;
        }
        if (password.value != confirm_password.value){
            password_check.textContent = 'Passwords do not match';
            password_check.style.color = 'red';
            
        }
        else{
            password_check.textContent = 'Passwords match';
            password_check.style.color = '#53e853';
            
        }
    })
});

// 
function toggleAnsweredQuestions() {
    const overlay = document.getElementById('answeredQuestionsOverlay');

    // Toggle visibility of the floating form
    if (overlay.style.display === 'none' || overlay.style.display === '') {
        overlay.style.display = 'flex';
        document.body.classList.add('modal-open'); // Prevent scrolling
    } else {
        overlay.style.display = 'none';
        document.body.classList.remove('modal-open'); // Re-enable scrolling
    }
}

function closeAnsweredQuestions() {
    const overlay = document.getElementById('answeredQuestionsOverlay');
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open'); // Re-enable scrolling
}

// Close the form when the "Escape" key is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAnsweredQuestions();
    }
});

// Close the form if clicking outside of the form
document.getElementById('answeredQuestionsOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        closeAnsweredQuestions();
    }
});