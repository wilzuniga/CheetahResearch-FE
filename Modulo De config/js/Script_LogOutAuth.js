async function logOut(){
    try {

        let response = await fetch('http://api.cheetah-research.com/logout/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`

            }

        });
        if (response.status === 200) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.log('error login Out', error);
    }
}
