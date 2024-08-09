async function eliminarEstudio(){
    const selectElement = document.getElementById('select-Study');
    const selectedStudy = selectElement.value;
    if (selectedStudy) {
        try {
            const response = await fetch('https://api.cheetah-research.ai/configuration/deleteStudy/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ study: selectedStudy })
            });
            if (response.ok) {
                alert('Estudio eliminado con éxito');
                location.reload();

            } else {
                throw new Error('error al eliminar estudio');
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

    }
}