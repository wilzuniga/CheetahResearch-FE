document.getElementById('LanzarEstudioBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const studioID = localStorage.getItem('selectedStudyId');
    if (studioID.trim() !== '') {

        const nuevaURL = `../../../CheetahResearch-FE/Recolección%20de%20Datos/Chat.html?id=${studioID}`;
        const linkText = `Recolección de Datos`;
        console.log(nuevaURL);
        document.getElementById('ModuloDeRecoleccionURL').innerHTML = `<a href="${nuevaURL}">${linkText}</a>`;

        url = 'https://api.cheetah-research.ai/configuration/test/' + localStorage.getItem('selectedStudyId');
        axios.get(url)
            .then(response => {
                console.log(response.data);
                const data = response.data;
                    if(data.test){
                        let coso = document.getElementById('test_Switch');
                        coso.checked = true;
                    }else{
                        let coso = document.getElementById('test_Switch');
                        coso.checked = false;
                    }
            }
            )
            .catch(error => {
                console.error('Error al enviar los datos:', error);
            });
    } else {
        alert('Por favor, ingrese un ID de estudio.');
    }
});
