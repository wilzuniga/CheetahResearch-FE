function listNonActiveUsers() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    const url = `https://api.cheetah-research.ai/configuration/get_studies_by_user_id/${userId}/`;

    axios.get(url, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        const studies = response.data;
        // Invertir el orden si lo necesitás
        const reversedStudies = studies.reverse();

        const studySelect = document.getElementById('select-Study');
        studySelect.innerHTML = '';

        reversedStudies.forEach(study => {
            const option = document.createElement('option');
            option.value = study._id;
            option.textContent = study.title;
            studySelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al cargar los estudios no activos:', error);
    });
}


document.addEventListener('DOMContentLoaded', listNonActiveUsers);

