document.getElementById('LanzarEstudioBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const studioID = localStorage.getItem('selectedStudyId');
    if (studioID.trim() !== '') {

        const nuevaURL = `../../../CheetahResearch-FE/Recolección%20de%20Datos/Chat.html?id=${studioID}`;
        const linkText = `Recolección de Datos`;
        console.log(nuevaURL);
        document.getElementById('ModuloDeRecoleccionURL').innerHTML = `<a href="${nuevaURL}">${linkText}</a>`;

        let coso = document.getElementById('test_Switch');

        if(coso.checked){
            const url = 'https://api.cheetah-research.ai/configuration/test/' + studioID + '/0';
            axios.post(url)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error al enviar los datos:', error);
                });
        }else{
            const url = 'https://api.cheetah-research.ai/configuration/test/' + studioID + '/1';
            axios.post(url)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error al enviar los datos:', error);
                });
        }
    } else {
        alert('Por favor, ingrese un ID de estudio.');
    }
});
