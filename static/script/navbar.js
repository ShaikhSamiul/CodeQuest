// Initialize the theme from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(currentTheme + '-theme');
    document.getElementById('themeToggle').checked = currentTheme === 'light';
});

// Toggle theme
document.getElementById('themeToggle').addEventListener('change', function () {
    const theme = this.checked ? 'light' : 'dark';
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
});


// //BEFORE
// const currentTheme = localStorage.getItem('theme') || 'dark';
// document.body.classList.add(currentTheme + '-theme');
// document.getElementById('themeToggle').checked = currentTheme === 'dark';

// // Toggle theme

// document.getElementById('themeToggle').addEventListener('change', function () {
//     const theme = this.checked ? 'dark' : 'light';
//     document.body.classList.toggle('dark-theme', theme === 'dark');
//     document.body.classList.toggle('light-theme', theme === 'light');
//     localStorage.setItem('theme', theme);

//     // Update the overlay theme
//     const overlay = document.getElementById('askQuestionOverlay');
//     overlay.classList.toggle('dark-theme', theme === 'dark');
//     overlay.classList.toggle('light-theme', theme === 'light');
// });


// function checkOrientation() {
//     const overlay = document.getElementById('portraitOverlay');
//     const mainContent = document.getElementById('mainContent');

//     if (window.matchMedia("(orientation: portrait)").matches) {
//         overlay.style.display = 'flex';  // Show video overlay
//         mainContent.style.display = 'none';  // Hide main content
//     } else {
//         overlay.style.display = 'none';  // Hide video overlay
//         mainContent.style.display = 'block';  // Show main content
//     }
// }



// // Listen for orientation change
// window.addEventListener('orientationchange', checkOrientation);
