document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('InputEmail').value;
    const password1 = document.getElementById('PasswordInput').value;
    const password2 = document.getElementById('RepeatPasswordInput').value;
    let passwordError = document.getElementById('Error-Password');

    if(password1 !== password2) {
        passwordError.style.display = 'flex';
        return;
    }else{
        passwordError.style.display = 'none';
    }

    const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password1, password2 })
    });
    if (response.ok) {
        const successContainer = document.getElementById('Success-Cont');
        const data = await response.json();
        localStorage.setItem('token', data.token);


        alert('User registered, and waiting for approval');
        successContainer.style.display = 'flex';

        window.location.href = './login.html';
    } else {
        const errorData = await response.json();
        alert(errorData.error || 'Registration failed');
    }
});

document.getElementById('MainP-Link').addEventListener('click', function (event) {
    const successContainer = document.getElementById('Success-Cont');

    window.location.href = './PaginaPrincipal.html';
        
    successContainer.style.display = 'none';
});