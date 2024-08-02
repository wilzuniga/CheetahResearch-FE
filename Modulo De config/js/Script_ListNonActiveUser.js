async function listNonActiveUsers() {
    try {
        const response = await fetch('http://ec2-44-203-206-68.compute-1.amazonaws.com/listnonactive_user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const users = await response.json();
        const userSelect = document.getElementById('inactiveUsersSelect');


        userSelect.innerHTML = '';

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.email;
            option.textContent = user.email;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }


}

document.addEventListener('DOMContentLoaded', listNonActiveUsers);

