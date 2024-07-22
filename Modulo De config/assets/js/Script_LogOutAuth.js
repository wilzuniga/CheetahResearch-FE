async function logOut(){
    try {

        let response = await fetch('http://ec2-44-203-206-68.compute-1.amazonaws.com/logout/', {
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
