// agregarCard.js

function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');
    if (study_id) {
        console.log('ID de estudio:', study_id);
        loadInterviewer(study_id);
    } else {
        console.error('No se encontró el parámetro id en la URL.');
    }
}

function contenido() {
    var contenedor = document.getElementById("contentCard_PaginaOverview");

}




