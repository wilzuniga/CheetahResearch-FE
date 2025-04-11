document.getElementById('LanzarEstudioBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const studioID = localStorage.getItem('selectedStudyId');
    if (studioID.trim() !== '') {

        const nuevaURL = `https://www.cheetah-research.ai/chatbot?id=${studioID}`;
        const linkText = `Recolección de Datos`;
        const linkTextAnalisis = `Analisis de Datos`;
        const nuevaULRanalisis = `https://www.cheetah-research.ai/analysis/home?id=${studioID}`;
        
        // Añadir target="_blank" para abrir en una nueva pestaña
        document.getElementById('ModuloDeRecoleccionURL').innerHTML = `<a href="${nuevaURL}" target="_blank">${linkText}</a>`;
        document.getElementById('ModuloDeAnalisisURL').innerHTML = `<a href="${nuevaULRanalisis}" target="_blank">${linkTextAnalisis}</a>`;

        let coso = document.getElementById('test_Switch');

        if(coso.checked){
            const url = 'https://api.cheetah-research.ai/configuration/test/' + studioID + '/0';
            axios.post(url)
                .then(response => {
                    // console.log(response.data);
                })
                .catch(error => {
                    console.error('Error al enviar los datos:', error);
                });
        }else{
            const url = 'https://api.cheetah-research.ai/configuration/test/' + studioID + '/1';
            axios.post(url)
                .then(response => {
                    // console.log(response.data);
                })
                .catch(error => {
                    console.error('Error al enviar los datos:', error);
                });
        }
    } else {
        alert('Por favor, ingrese un ID de estudio.');
    }
});
