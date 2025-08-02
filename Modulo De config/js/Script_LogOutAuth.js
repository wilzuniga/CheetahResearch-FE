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
            localStorage.removeItem('user_id');
            // Usar el nuevo sistema de study_id por usuario
            removeStudyIdForUser();
            localStorage.removeItem('selectedStudyData');
            window.location.href = 'https://www.cheetah-research.ai/login/';

        }
    } catch (error) {
        console.log('error login Out', error);
    }
}
