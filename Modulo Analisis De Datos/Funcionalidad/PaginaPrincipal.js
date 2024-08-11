// agregarCard.js

function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');
    if (study_id) {
        console.log('ID de estudio:', study_id);
        contenido(study_id);
    } else {
        console.error('No se encontró el parámetro id en la URL.');
    }
}

function contenido(study) {
    var div = document.getElementById("contentCard_PaginaOverview");

    formData = new FormData();
    formData.append('filter', 'General');
    formData.append('module', 'general');
    formData.append('sub_module', 'narrative');
    const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
    axios.post(url, formData)
        .then(function (response) {
            var data = response.data;
            ResumenIndividual = data;
            const coso = marked(data);      
            div.innerHTML = coso;                      

            console.log(data);
        })
        .catch(function (error) {
            div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}




