// Función para mostrar/ocultar el botón de herramientas de administración
function toggleAdminToolsButton(email) {
    const adminToolsBtn = document.getElementById('AdminToolsBTN');
    if (email === 'it@cheetah-research.com') {
        adminToolsBtn.style.display = 'block';
        // Agregar clase para animación después de un pequeño delay
        setTimeout(() => {
            adminToolsBtn.classList.add('show');
        }, 100);
    } else {
        adminToolsBtn.classList.remove('show');
        // Ocultar después de la animación
        setTimeout(() => {
            adminToolsBtn.style.display = 'none';
        }, 300);
    }
}

// Event listener para el campo de email
document.getElementById('InputEmail').addEventListener('input', function(event) {
    const email = event.target.value.trim();
    toggleAdminToolsButton(email);
});

// Event listener para cuando el campo de email pierde el foco
document.getElementById('InputEmail').addEventListener('blur', function(event) {
    const email = event.target.value.trim();
    toggleAdminToolsButton(email);
});

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
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user_id', data.user_id);

        window.location.href = 'https://www.cheetah-research.ai/home/';
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

// Event listener para el botón de herramientas de administración
document.getElementById('AdminToolsBTN').addEventListener('click', function (event) {
    event.preventDefault();
    // Redirigir a la página de herramientas del administrador
    window.location.href = 'HerramientasDelAdministrador.html';
});
