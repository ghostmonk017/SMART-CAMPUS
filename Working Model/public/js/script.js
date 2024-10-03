document.getElementById('signupForm').addEventListener('submit', function(event) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple validation (you can add more)
    if (!email || !password) {
        event.preventDefault();
        alert('Please fill in all fields.');
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple validation (you can add more)
    if (!email || !password) {
        event.preventDefault();
        alert('Please fill in all fields.');
    }
});
