
// Redirect to compile page when clicking on question box
const questionBoxes = document.querySelectorAll('.question-box');
questionBoxes.forEach(box => {
    box.addEventListener('click', function () {
        const questionId = this.getAttribute('data-question-id');
        if (questionId) {
            window.location.href = `/compiler/${questionId}`;
        }
    });
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

document.addEventListener('DOMContentLoaded', function() {
    //checkboxes
    const checkboxes = document.querySelectorAll('.difficultyFilter');
    const questionBoxes = document.querySelectorAll('.question-box');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Collect all checked values
            const selectedDifficulties = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            // Show or hide the questions based on selected difficulties
            questionBoxes.forEach(box => {
                const difficulty = box.getAttribute('data-difficulty');
                if (selectedDifficulties.length === 0 || selectedDifficulties.includes(difficulty)) {
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            });
        });
    });
});
document.getElementById('themeToggle').addEventListener('change', function () {
    const theme = this.checked ? 'light' : 'dark';
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
});


function filterQuestionsBySearch() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const questionBoxes = document.querySelectorAll('.question-box');

    questionBoxes.forEach(box => {
        const title = box.querySelector('.question-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
        box.style.display = "block";
        } else {
        box.style.display = "none";
        }
    });
}
  