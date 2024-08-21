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

    // Evento para manejar la descarga cuando se hace clic en el botón
    const downloadLogsButton = document.getElementById('DescargarTranscrptBtn');
    if (downloadLogsButton) {
        downloadLogsButton.addEventListener('click', () => {
            axios.post(url, formData)
            .then((response) => {
                const downloadUrl = response.data.url;
                // Sanitizar el nombre del archivo
                const sanitizedTitle = selectedStudyData.tituloDelEstudio.replace(/\s+/g, '_').replace(/[\/\\?*:|"<>]/g, '');
                const filename = 'transcript_' + sanitizedTitle + '.csv';
                // Crear un enlace temporal para la descarga
                const tempLink = document.createElement('a');
                tempLink.href = downloadUrl;
                tempLink.download = filename; // Usar el nombre sanitizado
                tempLink.style.display = 'none'; // Ocultar el enlace
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            })
            .catch((error) => {
                console.error('Error al realizar la solicitud:', error);
            });
        });
    } else {
        console.error('Elemento con ID "DescargarTranscrptBtn" no encontrado.');
    }
}

window.onload = llenar;
