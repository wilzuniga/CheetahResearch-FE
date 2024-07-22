document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('InputEmail').value;
    const password = document.getElementById('InputPassword').value;

    const response = await fetch('http://api.cheetah-research.com/login/', {
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
        window.location.href = './paginaPrincipal.html';
    } else {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed');
    }
});