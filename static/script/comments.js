// // Theme Slider and Body Element
// const themeSlider = document.getElementById('themeSlider');
// const body = document.body;

// // Check the saved theme preference in localStorage
// const savedTheme = localStorage.getItem('theme') || 'light';
// body.classList.add(savedTheme + '-theme');

// // Set the slider position based on the saved theme
// if (savedTheme === 'dark') {
//     themeSlider.checked = false;
// }

// // Theme toggle event listener
// themeSlider.addEventListener('change', () => {
//     const isDarkMode = themeSlider.checked;
//     if (isDarkMode) {
//         body.classList.replace('dark-theme', 'light-theme');
//         localStorage.setItem('theme', 'light');
//     } else {
//         body.classList.replace('light-theme', 'dark-theme');
//         localStorage.setItem('theme', 'dark');
//     }
// });

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

async function sendComment() {
    const comment = document.getElementById('commentBox').value
    queryId = Number.parseInt(document.getElementById('qid').getAttribute('queryId'))
    const response = await fetch('/sendComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment:comment ,query_id:queryId })
    });
    const result = await response.json()
    if (result.success) {
        location.reload()
        // alert('Comment Sent Successfully');
    } else {
        alert("Comment not added successfully: " + result.message);
    }
}

commentBox.addEventListener('keydown', function(event) {
    // Check if the pressed key is "Enter" (key code 13)
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (like form submission)
        sendComment(); // Call the sendComment function
    }
});


async function deleteQuery(){
    confirmation = confirm("Are you sure you want to delete this query?")
    if(confirmation){
        queryId = Number.parseInt(document.getElementById('qid').getAttribute('queryId'))
        console.log(queryId)
        const response = await fetch('/deleteQuery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query_id:queryId })
        });
        const result = await response.json()
        if (result.success) {
            window.location.href = '/discussions'
        } else {
            alert("Query not deleted successfully: " + result.message);
        }
    }
    else{
        return
    }
}