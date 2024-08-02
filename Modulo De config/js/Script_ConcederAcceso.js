async function concederAcceso() {
    const selectElement = document.getElementById('inactiveUsersSelect');
    const selectedEmail = selectElement.value;
    if (selectedEmail) {
        try {
            const response = await fetch('http://ec2-44-203-206-68.compute-1.amazonaws.com/activate-user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ email: selectedEmail })
            });
            if (response.ok) {
                alert('Usuario activado con éxito');
                location.reload();

            } else {
                throw new Error('error al activar usuario');
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

    }
}