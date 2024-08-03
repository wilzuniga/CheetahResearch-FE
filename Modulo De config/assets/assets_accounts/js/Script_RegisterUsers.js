document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    let emailError = document.getElementById('Error-RegEmail');
    let passwordError = document.getElementById('Error-RegPassword');
    const email = document.getElementById('InputEmail').value;
    const password1 = document.getElementById('PasswordInput').value;
    const password2 = document.getElementById('RepeatPasswordInput').value;
    
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    if (password1 !== password2) {
        passwordError.style.display = 'flex';
    } else {
        passwordError.style.display = 'none';

        const response = await fetch('https://api.cheetah-research.ai/configuration/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password1, password2 })
        });
        if (response.ok) {
            let successContainer = document.getElementById('Success-Cont');
            const data = await response.json();
            localStorage.setItem('token', data.token);

            successContainer.style.display = 'flex';
        } else {
            const errorData = await response.json();

            //Error Type
            if (errorData.email[0] === 'user with this email already exists.') {
                emailError.textContent = 'Ya hay una cuenta con ese correo';
                emailError.style.display = 'flex';
            } else if (errorData.email) {
                emailError.textContent = 'El correo electrónico no es válido';
                emailError.style.display = 'flex';
            } else if (errorData.error === 'Invalid credentials.') {
                emailError.textContent = 'Datos no válidos';
                emailError.style.display = 'flex';
            } else {
                emailError.textContent = 'Error al registrarse';
                emailError.style.display = 'flex';
            }
        }
    }

});

document.getElementById('Link-Login').addEventListener('click', function (event) {
    let successContainer = document.getElementById('Success-Cont');

    window.location.href = 'https://www.cheetah-research.ai/login';
    successContainer.style.display = 'none';
});

document.getElementById('Error-RegEmail').addEventListener('input', function (event) {
    if (this.style.display === 'flex') {
        this.style.display = 'none'
    }
});
