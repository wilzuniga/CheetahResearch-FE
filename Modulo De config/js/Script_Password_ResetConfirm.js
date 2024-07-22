function getQueryParams() {
    const param = new URLSearchParams(window.location.search);
    return {
        uidb64: param.get('uidb64'),
        token: param.get('token')
    };
}

document.getElementById('resetPasswordFormConfirm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const { uidb64, token } = getQueryParams();
    const new_password1 = document.getElementById('ConfirmPassword01').value;
    const new_password2 = document.getElementById('ConfirmPassword02').value;
    if (new_password1 !== new_password2) {
        alert('Passwords do not match');
        return;
    }

    const response = await fetch(`http://api.cheetah-research.com/password-reset-confirm/${uidb64}/${token}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_password1, new_password2 })
    });

    const responseData = await response.json();
    if (response.ok) {
        alert('Password reset successful');
        window.location.href = 'login.html';
    } else {
        alert(responseData.error || 'Password reset failed');
    }
});