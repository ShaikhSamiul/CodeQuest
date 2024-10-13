require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' }});
require(['vs/editor/editor.main'], async function() {
    
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: `# Write your code below\n`,
        language: 'python',
        theme: 'vs-light' //default theme
    });
    applyEditorTheme();
});

document.addEventListener("DOMContentLoaded", async function(){
    let question_id = Number.parseInt(document.getElementById('question-title').getAttribute('qid'))

    const response = await fetch('/existingSolutionOnload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({question_id: question_id})
    });
    const result = await response.json();
    if (result.solution) {
        alert("An existing solution found");
    }
    monaco.editor.setModelLanguage(window.editor.getModel(), 'python');
    window.editor.setValue(result.solution || "# Write your code below\n");
})


document.getElementById('language').addEventListener('change', async function() {
    const newLang = this.value;
    const sampleCode = getSampleCode(newLang);
    
    let question_id = Number.parseInt(document.getElementById('question-title').getAttribute('qid'))
    const monacoLang = newLang === 'cpp' ? 'cpp' : newLang === 'java' ? 'java' : 'python';
    const response = await fetch('/existingSolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({language: newLang, question_id: question_id})
    });
    const result = await response.json();
    if (result.solution) {
        alert("An existing solution found");
    }
    monaco.editor.setModelLanguage(window.editor.getModel(), monacoLang);
    window.editor.setValue(result.solution || sampleCode);
});

function getSampleCode(language) {
    const samples = {
        python: `# Write your code below\n`,
        java: `public class Main {\n    public static void main(String[] args) {\n        // Write your code below;\n\n    }\n}`,
        cpp: `#include <iostream>\nint main() {\n    // Write your code below\n\n    return 0;\n}`
    };
    return samples[language];
}

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.add(currentTheme + '-theme');
document.getElementById('themeToggle').checked = currentTheme === 'dark';

// Toggle theme
document.getElementById('themeToggle').addEventListener('change', function() {
    const theme = this.checked ? 'light' : 'dark';
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
    applyEditorTheme();
});

function applyEditorTheme() {
    const theme = document.body.classList.contains('dark-theme') ? 'vs-dark' : 'vs-light';
    monaco.editor.setTheme(theme);
}

// Resizing functionality
const resizableBox = document.getElementById('resizableBox');
let isResizing = false;

resizableBox.addEventListener('mousedown', function(e) {
    if (e.offsetX > resizableBox.offsetWidth - 10) {  // resizing when clicked on right edge
        isResizing = true;
        document.body.style.cursor = 'ew-resize';  // Change cursor to resizing cursor
    }
});

document.addEventListener('mousemove', function(e) {
    if (isResizing) {
        const newWidth = e.clientX - resizableBox.offsetLeft;
        resizableBox.style.width = newWidth + 'px';
    }
});


document.addEventListener('mouseup', function() {
    isResizing = false;
    document.body.style.cursor = ''; // Reset cursor
});


async function runCode() {
    const code = window.editor.getValue();
    const language = document.getElementById('language').value;
    const response = await fetch('/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, language: language })
    });
    const result = await response.json();
    const outputBox = document.getElementById('output');
    outputBox.textContent = result.output || 'No output or error to display.';
}



async function submitCode() {
    const code = window.editor.getValue();
    const language = document.getElementById('language').value;
    const question = document.getElementById('question-description').innerText; 

    
    const response = await fetch('/submitCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, language: language, question: question })
    });
    const result = JSON.parse(await response.json())
    const isTrue = document.getElementById('isTrue')
    const hint = document.getElementById('hint')
    const submitButton = document.getElementById('submit-solution');

    hint.innerText = ""
    if(result.isTrue=="No"){
        isTrue.innerText = "Your answer is incorrect"
        hint.innerText = "Hint: "+result.hint
        submitButton.style.display = "none";
    }
    else{
        isTrue.innerText = "Your answer is correct"
        submitButton.style.display = "inline";
    }
    
    document.getElementById("msgOverlay").style.display = "block";
}

async function submitSolution(){
    const code = window.editor.getValue();
    let language = document.getElementById('language').value;
    const question = document.getElementById('question-title').innerText; 
    let question_id = Number.parseInt(document.getElementById('question-title').getAttribute('qid'))
    
    if(language=="python"){
        language = 1
    }
    else if(language=="java"){
        language = 2
    }
    else if(language=="cpp"){
        language = 3
    }
    else{
        language = 0
    }
    const response = await fetch('/submitSolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, language: language, question:question,question_id:question_id})
    });
    const result = await response.json()
    if (result.success) {
        window.location.href = result.redirect; // Redirect to the questions.html page
        alert('Solution Submitted Successfully');
    } else {
        alert('Login failed: ' + result.message);
    }
}


function closeMsg() {
    const overlay = document.getElementById('msgOverlay');
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open'); // Enable scrolling
    // const button = document.querySelector('.ask-question-btn');
    // button.setAttribute('aria-expanded', 'false'); // Update ARIA attribute
}

document.addEventListener('keydown', function(event) {
    const overlay = document.getElementById('msgOverlay');
    if (event.key === 'Escape' && overlay.style.display === 'block') {
        closeMsg();
    }
});

// Event listener for the overlay to close the form
document.getElementById('msgOverlay').addEventListener('click', function(event) {
    // Check if the click is on the overlay and not the form container
    if (event.target === this) {
        closeMsg(); // Call the function to close the form
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
document.getElementById('themeToggle').addEventListener('change', function () {
    const theme = this.checked ? 'light' : 'dark';
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
});
