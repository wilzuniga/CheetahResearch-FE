async function eliminarEstudio(){
    const selectElement = document.getElementById('select-Study');
    const selectedStudy = selectElement.value;
    
    if (selectedStudy) {
        // Mostrar alert de confirmación
        const confirmacion = confirm('¿Estás seguro de que quieres eliminar este estudio? Esta acción no se puede deshacer.');
        
        if (!confirmacion) {
            console.log('Eliminación de estudio cancelada por el usuario');
            return;
        }
        
        try {
            const response = await fetch('https://api.cheetah-research.ai/configuration/deleteStudy/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ study_id: selectedStudy })
            });
            if (response.ok) {
                alert('Estudio eliminado con éxito');
                location.reload();

            } else {
                throw new Error('error al eliminar estudio');
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Error al eliminar el estudio. Por favor, inténtalo de nuevo.');
        }

    } else {
        alert('Por favor, selecciona un estudio para eliminar.');
    }
}
