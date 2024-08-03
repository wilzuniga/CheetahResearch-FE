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


        const studys = await response.json();
        const studySelect=document.getElementById('select-Study');

        studySelect.innerHTML = '';

        studys.forEach(study => {
            const option = document.createElement('option');
            option.value = study._id;
            option.textContent = study.title;
            studySelect.appendChild(option);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }


}

document.addEventListener('DOMContentLoaded', listNonActiveUsers);

