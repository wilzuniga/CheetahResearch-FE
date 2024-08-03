document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('InputEmail').value;
    const password1 = document.getElementById('PasswordInput').value;
    const password2 = document.getElementById('RepeatPasswordInput').value;
    let passwordError = document.getElementById('Error-Password');

    if (password1 !== password2) {
        passwordError.style.display = 'flex';
    } else {
        passwordError.style.display = 'none';

        const response = await fetch('https://api.cheetah-research.ai/register', {
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
            let emailError = document.getElementById('Error-RegEmail');

            //Validating Error Type
            if (errorData.email) {
                emailError.textContent = 'El correo electrónico no es válido';
            } else if (errorData.error === 'Invalid credentials.') {
                emailError.textContent = 'Credenciales Inválidas';
            } else {
                alert(errorData.error);
            }
        }
    }
});

document.getElementById('MainP-Link').addEventListener('click', function (event) {
    const successContainer = document.getElementById('Success-Cont');
    window.location.href = 'https://www.cheetah-research.ai/login/';
    successContainer.style.display = 'none';
});
