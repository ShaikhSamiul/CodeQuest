// Elements for Sign Up form
const signupBtn = document.getElementById('signupBtn');
const closeSignupBtn = document.getElementById('closeSignupBtn');
const signupForm = document.getElementById('signupForm');

// Elements for Login form
const openLoginBtn = document.getElementById('loginBtn'); // Button to open login form
const closeLoginBtn = document.getElementById('closeLoginBtn');
const loginForm = document.getElementById('loginForm');
const submitLoginBtn = document.getElementById('submitLoginBtn'); // Button to submit login form
const signupLink = document.getElementById('signupLink');
const loginLink = document.getElementById('loginLink');
const overlay = document.querySelector('.overlay');

//Elements for LogOut Button
const logoutBtn = document.getElementById('logoutBtn');

// Elements for Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Function to toggle forms
const toggleForm = (form) => {
    form.style.display = 'block';
    overlay.style.display = 'block';
};

// Function to close forms
const closeForm = (form) => {
    form.style.display = 'none';
    overlay.style.display = 'none';
};

// Sign Up form events
if (signupBtn != null){
    signupBtn.addEventListener('click', () => toggleForm(signupForm));
    closeSignupBtn.addEventListener('click', () => closeForm(signupForm));
}

// Login form events
if (openLoginBtn != null){
    openLoginBtn.addEventListener('click', () => toggleForm(loginForm));
    closeLoginBtn.addEventListener('click', () => closeForm(loginForm));
}
signupLink.addEventListener('click', () => {
    closeForm(loginForm);
    toggleForm(signupForm);
});
loginLink.addEventListener('click', () => {
    closeForm(signupForm);
    toggleForm(loginForm);
});

// Handle Sign Up form submission
document.getElementById('signupFormInner').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way
    
    const formData = new FormData(this);

    const response = await fetch('/signup', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (data.success) {
        alert('Registered Successfully');
        window.location.href = data.redirect; // Redirect to the questions.html page
    } else {
        alert('Sign up failed: ' + data.message);
    }
});

// Handle Login form submission
submitLoginBtn.addEventListener('click', async function(event) { 
    event.preventDefault(); // Prevent the form from submitting the default way

    const usernameInput = loginForm.querySelector('#username');
    const passwordInput = loginForm.querySelector('#password');
    
    if (!usernameInput || !passwordInput) {
        console.error('Username or password input field is missing');
        return;
    }
    const username = usernameInput.value;
    const password = passwordInput.value; 

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username:username,
            password: password  
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        window.location.href = data.redirect; // Redirect to the questions.html page
        
    } else {
        alert('Login failed: ' + data.message);
    }
    });

// Close forms by clicking on the overlay
overlay.addEventListener('click', function() {
    signupForm.style.display = 'none';
    loginForm.style.display = 'none';
    overlay.style.display = 'none';
});

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/static/service-worker.js').then(registration => {
//             console.log('Service Worker registered with scope:', registration.scope);
//         }).catch(error => {
//             console.error('Service Worker registration failed:', error);
//         });
//     });
// }

// Function to check if an element is in view
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Function to handle the scroll effect
// const handleScrollEffect = () => {
//     const scrollEffectElements = document.querySelectorAll('.scroll-effect');
//     scrollEffectElements.forEach(element => {
//         if (isInViewport(element)) {
//             element.classList.add('active');
//         } else {
//             // Uncomment the following line if you want to remove the effect when out of view
//             // element.classList.remove('active');
//         }
//     });
// };

// // Add scroll event listener
// window.addEventListener('scroll', handleScrollEffect);

// // Initial check
// handleScrollEffect();


window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const logoutStatus = urlParams.get('logout');

    if (logoutStatus === 'success') {
        alert("Logged Out Successfully");
    }
};

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
    const confirm_password = document.getElementById('cnf-password');

        if (confirm_password.length === 0) {
            password_check.textContent = '';
           
        }
        else{
            if (password.value != confirm_password.value){
                password_check.textContent = 'Passwords do not match';
                password_check.style.color = 'red';
                
            }
            else{
                password_check.textContent = 'Passwords match';
                password_check.style.color = '#53e853';
                
            }
    }
    })
});

//for theme persistence
const theme = document.getElementById('themeToggle');
// Initialize the theme from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(currentTheme + '-theme');
    document.getElementById('themeToggle').checked = currentTheme === 'light';
        
    if (currentTheme == "light"){
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }else{
        document.body.classList.toggle('light-theme', theme === 'light');
    }
});

// Toggle theme
document.getElementById('themeToggle').addEventListener('change', function () {
    const theme = this.checked ? 'light' : 'dark';
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
});



let slideIndex = 1;
let autoSlideInterval; // Declare a variable for the interval

showSlides(slideIndex);
startAutoSlide();

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1; }    
    if (n < 1) { slideIndex = slides.length; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex-1].style.display = "block";  
}

// Next/previous controls
function plusSlides(n) {
    clearInterval(autoSlideInterval);  // Clear the timer when user clicks next/prev
    showSlides(slideIndex += n);
    startAutoSlide();  // Restart the auto-slide timer
}

// Function to start the auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000); // Auto change every 4 seconds
}


// Auto slide change every 4 seconds
// setInterval(() => {
//     plusSlides(1);
// }, 4000);
