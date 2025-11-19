function listNonActiveUsers() {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('user_id');

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

document.addEventListener('DOMContentLoaded', function () {
    // Idioma
    const lang = sessionStorage.getItem('language') || 'es';
    setLanguage(lang);

    const studyId = sessionStorage.getItem('selectedStudyId');
    setColorsFromAPI(studyId);//Setea colores en sessionStorage y en la interfaz
});


//Colores
function setColorsFromAPI(studyId) {
    const url = 'https://api.cheetah-research.ai/configuration/info_study/' + studyId;
    return axios.get(url)
        .then(response => {
            const colors = {
                color1: response.data.primary_color,
                color2: response.data.secondary_color
            };

            applyColors(colors);

            return colors;
        })
        .catch(error => {
            console.error('Error capturando colores desde API:', error);
            return { color1: null, color2: null };
        });
}

function applyColors(colors) {//Colors es un array
    if (colors.color1) {
        document.documentElement.style.setProperty('--bs-CR-orange', colors.color1);

        document.documentElement.style.setProperty('--bs-CR-orange-2', brightColorVariant(colors.color1));
    }
    if (colors.color2) {
        document.documentElement.style.setProperty('--bs-CR-gray', colors.color2);

        document.documentElement.style.setProperty('--bs-CR-gray-dark', darkColorVariant(colors.color2));
    }
}
function darkColorVariant (color) {
    return adjustColor(color, -10);
}
function brightColorVariant (color) {
    return adjustColor(color, 10);
}
function adjustColor(color, percent) {//Funcion loca de chatsito
    const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16).slice(1).toUpperCase()}`;
}
