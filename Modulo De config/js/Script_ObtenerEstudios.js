async function listNonActiveUsers() {
    try {
        const response = await fetch('https://api.cheetah-research.ai/configuration/get_studies/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const study = await response.json();
        const studySelect: document.getElementById('inactiveUsersSelect');


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

