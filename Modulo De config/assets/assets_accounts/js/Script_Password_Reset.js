document.getElementById('passwordResetForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    let resetCont = document.getElementById('Reset-Cont');
    let resetError = document.getElementById('Error-PasswordReset');
    const email = document.getElementById('InputEmail').value;

    resetError.style.display = 'none';

    const response = await fetch('http://127.0.0.1:8000/password-reset/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });
    if (response.ok) {
        resetCont.style.display = 'flex';
    } else {
        const errorData = await response.json();

        //Error Type
        resetError.style.display = 'flex';
    }

});