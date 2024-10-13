document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.languageFilter');
    const discussionBoxes = document.querySelectorAll('.discussion-box');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Collect all checked values
            const selectedLanguages = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            // Show or hide the questions based on selected difficulties
            discussionBoxes.forEach(box => {
                const language = box.getAttribute('language');
                if (selectedLanguages.length === 0 || selectedLanguages.includes(language)) {
                    box.style.display = 'flex';
                } else {
                    box.style.display = 'none';
                }
            });
        });
    });
});


function filterQuestionsBySearch() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const discussionBoxes = document.querySelectorAll('.discussion-box');

    discussionBoxes.forEach(box => {
        const title = box.querySelector('.discussion-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
        box.style.display = "block";
        } else {
        box.style.display = "none";
        }
    });
}


function toggleFloatingForm() {
    const overlay = document.getElementById('askQuestionOverlay');
    const button = document.querySelector('.ask-question-btn');

    if (overlay.style.display === 'none' || overlay.style.display === '') {
        overlay.style.display = 'block';
        document.body.classList.add('modal-open'); // Prevent scrolling
        button.setAttribute('aria-expanded', 'true'); // Update ARIA attribute
    } else {
        overlay.style.display = 'none';
        document.body.classList.remove('modal-open'); // Enable scrolling
        button.setAttribute('aria-expanded', 'false'); // Update ARIA attribute
    }
}

function closeAskQuestion() {
    const overlay = document.getElementById('askQuestionOverlay');
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open'); // Enable scrolling
    // const button = document.querySelector('.ask-question-btn');
    // button.setAttribute('aria-expanded', 'false'); // Update ARIA attribute
}

document.addEventListener('keydown', function(event) {
    const overlay = document.getElementById('askQuestionOverlay');
    if (event.key === 'Escape' && overlay.style.display === 'block') {
        closeAskQuestion();
    }
});

// Event listener for the overlay to close the form
document.getElementById('askQuestionOverlay').addEventListener('click', function(event) {
    // Check if the click is on the overlay and not the form container
    if (event.target === this) {
        closeAskQuestion(); // Call the function to close the form
    }
});


// function redirectToComments(queryId) {
//     // Construct the URL with query parameters
//     const url = `{{ url_for('comments') }}?query_id=${queryId}`;
//     console.log(url); // Log the URL for debugging
//     window.location.href = url; // Redirect to the URL
// }

const theme = document.getElementById('themeToggle');

const image = document.getElementById('general_logo');
const form_Image = document.getElementById('general_logo_form');

// Initialize the theme from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(currentTheme + '-theme');
    document.getElementById('themeToggle').checked = currentTheme === 'light';
    
    // Update the logo based on the theme
    const images = document.querySelectorAll('.general_logo'); 
const form_Images = document.querySelectorAll('.general_logo_form');
    
const newSrc = this.checked 
? '/static/images/General_Logo_Black.png' 
: '/static/images/General_Logo_White.png';

images.forEach(image => {
image.src = newSrc; // Change source for all general logos
});

form_Images.forEach(form_Image => {
form_Image.src = newSrc; // Change source for all form images if applicable
});
    //for whole css..
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

    // Update the overlay theme
    const overlay = document.getElementById('askQuestionOverlay');
    overlay.classList.toggle('dark-theme', theme === 'dark');
    overlay.classList.toggle('light-theme', theme === 'light');

    // Update the logo based on the theme toggle
    const images = document.querySelectorAll('.general_logo'); 
const form_Images = document.querySelectorAll('.general_logo_form');
    
const newSrc = this.checked 
? '/static/images/General_Logo_Black.png' 
: '/static/images/General_Logo_White.png';

images.forEach(image => {
image.src = newSrc; // Change source for all general logos
});

form_Images.forEach(form_Image => {
form_Image.src = newSrc; // Change source for all form images if applicable
});
});
