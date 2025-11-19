async function logOut(){
    try {

        let response = await fetch('https://api.cheetah-research.ai/configuration/logout/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${sessionStorage.getItem('token')}`

            }

        });
        if (response.status === 200) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user_id');
            window.location.href = 'https://www.cheetah-research.ai/login/';

        }
    } catch (error) {
        console.log('error login Out', error);
    }
}
