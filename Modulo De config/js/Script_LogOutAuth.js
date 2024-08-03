async function logOut(){
    try {

        let response = await fetch('https://api.cheetah-research.ai/configuration/logout/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`

            }

        });
        if (response.status === 200) {
            localStorage.removeItem('token');
            window.location.href = 'https://www.cheetah-research.ai/configuration/login';

        }
    } catch (error) {
        console.log('error login Out', error);
    }
}
