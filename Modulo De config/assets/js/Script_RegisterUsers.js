document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    let emailError = document.getElementById('Error-RegEmail');
    let passwordError = document.getElementById('Error-RegPassword');
    const email = document.getElementById('InputEmail').value;
    const password1 = document.getElementById('PasswordInput').value;
    const password2 = document.getElementById('RepeatPasswordInput').value;

    if (password1 !== password2) {
        passwordError.style.display = 'flex';
    } else {
        passwordError.style.display = 'none';

        const response = await fetch('http://ec2-44-203-206-68.compute-1.amazonaws.com/register/', {
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

            emailError.style.display = 'none';
            passwordError.style.display = 'none';
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
                emailError.textContent = 'Credenciales Inválidas';
                emailError.style.display = 'flex';
            } else {
                alert(errorData.error);
            }
        }
    }

});

document.getElementById('Link-Login').addEventListener('click', function (event) {
    let successContainer = document.getElementById('Success-Cont');

    window.location.href = './login.html';
    successContainer.style.display = 'none';
});

document.getElementById('Error-RegEmail').addEventListener('input', function (event) {
    if (this.style.display === 'flex') {
        this.style.display = 'none'
    }
});
