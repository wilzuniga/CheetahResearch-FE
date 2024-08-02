async function checkSession(){
    try {
        let response = await fetch('http://127.0.0.1:8000/check-session/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        if (response.status === 200) {
            console.log('Sesión activa');
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.log('error check session', error);
    }

}

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
});