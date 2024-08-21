function llenar(){
    study = localStorage.getItem('selectedStudyData');

    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;

    const url = 'https://api.cheetah-research.ai/chatbot/download_logs/';
    const formData = new FormData();
    formData.append('study_id', localStorage.getItem('selectedStudyId'));

    axios.post(url, formData)
    .then((response) => {
        console.log(response.data);
        const downloadLogsButton = document.getElementById('DescargarTranscrptBtn');
        downloadLogsButton.href = response.data.url;
    })
    .catch((error) => {
        console.error(error);
    });

}