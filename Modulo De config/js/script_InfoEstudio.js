function llenar() {
    const studyDataJSON = localStorage.getItem('selectedStudyData');
    
    if (!studyDataJSON) {
        console.error('No se encontró el estudio seleccionado en localStorage.');
        return;
    }

    const studyData = JSON.parse(studyDataJSON);

    const selectedStudyData = {
        tituloDelEstudio: studyData.title || 'Título no disponible',
        mercadoObjetivo: studyData.marketTarget || 'Mercado no disponible',
        objetivosDelEstudio: studyData.studyObjectives || 'Objetivos no disponibles',
        Resumen: studyData.prompt || 'Resumen no disponible',
    };

    const nombreProyectoLbl = document.getElementById('nombreProyectoLbl');
    if (nombreProyectoLbl) {
        nombreProyectoLbl.innerText = selectedStudyData.tituloDelEstudio;
    } else {
        console.error('Elemento con ID "nombreProyectoLbl" no encontrado.');
    }

    const url = 'https://api.cheetah-research.ai/chatbot/download_logs/';
    const formData = new FormData();
    const studyId = localStorage.getItem('selectedStudyId');
    if (!studyId) {
        console.error('No se encontró "selectedStudyId" en localStorage.');
        return;
    }
    formData.append('study_id', studyId);

    axios.post(url, formData)
    .then((response) => {
        console.log(response.data);
        const downloadLogsButton = document.getElementById('DescargarTranscrptBtn');
        if (downloadLogsButton) {
            downloadLogsButton.href = response.data.url;
            downloadLogsButton.setAttribute('download', 'transcript_' + selectedStudyData.tituloDelEstudio + '.txt');


        } else {
            console.error('Elemento con ID "DescargarTranscrptBtn" no encontrado.');
        }
    })
    .catch((error) => {
        console.error('Error al realizar la solicitud:', error);
    });

}

window.onload = llenar;
