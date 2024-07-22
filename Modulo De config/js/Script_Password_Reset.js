document.getElementById('passwordResetForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('InputEmail').value;

    const response = await fetch('http://127.0.0.1:8000/password-reset/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });
    if (response.ok) {
        alert('Password reset email sent');
    } else {
        const errorData = await response.json();
        alert(errorData.error || 'Password reset failed');
    }

});