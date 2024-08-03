document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    let authAwaitContainer = document.getElementById('AuthAwait-Cont');
    let loginError = document.getElementById('Error-Login');
    const email = document.getElementById('InputEmail').value;
    const password = document.getElementById('InputPassword').value;

    loginError.style.display = 'none';

    const response = await fetch('https://api.cheetah-research.ai/configuration/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);

        window.location.href = './home';
    } else {
        const errorData = await response.json();

        //Error Type
        if (errorData.error === 'Your account is awaiting approval.') {
            loginError.style.display = 'none';
            authAwaitContainer.style.display = 'flex';
        } else if (errorData.error === 'Invalid credentials.') {
            loginError.textContent = 'Datos no válidos';
            loginError.style.display = 'flex';
        } else {
            loginError.textContent = 'Error al iniciar sesión';
            loginError.style.display = 'flex';
        }
    }
});

document.getElementById('Link-AuthReturn').addEventListener('click', function (event) {
    let authAwaitContainer = document.getElementById('AuthAwait-Cont');
    authAwaitContainer.style.display = 'none';
});

document.getElementById('MoreInfo').addEventListener('click', function (event) {
    let authAwaitInfo = document.getElementById('AuthAwait-Info');
    authAwaitInfo.style.display = 'flex';
});

document.getElementById('Link-InfoReturn').addEventListener('click', function (event) {
    let authAwaitInfo = document.getElementById('AuthAwait-Info');
    authAwaitInfo.style.display = 'none';
});
