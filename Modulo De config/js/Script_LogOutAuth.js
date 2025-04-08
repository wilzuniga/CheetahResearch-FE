async function logOut() {
    try {
        let response = await fetch(`https://api.cheetah-research.ai/configuration/logout/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        if (response.status === 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            window.location.href = CONFIG.LOGIN_URL;
        }
    } catch (error) {
        console.log('error logging out', error);
    }
}
