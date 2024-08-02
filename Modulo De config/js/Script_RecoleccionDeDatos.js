document.getElementById('LanzarEstudioBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const studioID = localStorage.getItem('selectedStudyId');
    if (studioID.trim() !== '') {

        const nuevaURL = `../../../CheetahResearch-FE/Recolección%20de%20Datos/Chat.html?id=${studioID}`;
        const linkText = `Recolección de Datos`;
        console.log(nuevaURL);
        document.getElementById('ModuloDeRecoleccionURL').innerHTML = `<a href="${nuevaURL}">${linkText}</a>`;
    } else {
        alert('Por favor, ingrese un ID de estudio.');
    }
});
