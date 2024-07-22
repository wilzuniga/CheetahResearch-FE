document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('InputEmail').value;
    const password = document.getElementById('InputPassword').value;

    const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);

        alert('Login successful');

    } else {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed');
    }
});

