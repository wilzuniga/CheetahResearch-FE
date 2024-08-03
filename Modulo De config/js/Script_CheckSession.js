async function checkSession(){
    try {
        let response = await fetch('https://api.cheetah-research.ai/configuration/check-session/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        if (response.status === 200) {
            console.log('Sesión activa');
        } else {
            window.location.href = 'https://www.cheetah-research.ai/configuration/login';
        }
    } catch (error) {
        console.log('error check session', error);
    }

}

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
});