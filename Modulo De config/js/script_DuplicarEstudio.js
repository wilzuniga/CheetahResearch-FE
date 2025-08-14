// Script para duplicar estudios
// Funcionalidad: Duplica todos los datos del estudio actual con el título "[Título] - COPIA"

function duplicateStudy() {
    console.log('Iniciando proceso de duplicación de estudio...');
    
    try {
        // Obtener los datos del estudio actual desde sessionStorage
        const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
        
        if (!studyData) {
            console.error('No se encontraron datos del estudio en sessionStorage');
            alert('Error: No se encontraron datos del estudio para duplicar');
            return;
        }
        
        console.log('Datos del estudio a duplicar:', studyData);
        
        // Crear el nuevo título con "- COPIA"
        const newTitle = `${studyData.title} - COPIA`;
        console.log('Nuevo título del estudio:', newTitle);
        
        // Preparar los datos para la API
        const duplicateData = {
            title: newTitle,
            target: studyData.marketTarget,
            objective: studyData.studyObjectives,
            prompt: studyData.prompt
        };
        
        console.log('Datos preparados para duplicación:', duplicateData);
        
        // Obtener el token de autorización
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('No se encontró token de autorización');
            alert('Error: No se encontró token de autorización');
            return;
        }
        
        // URL para crear el nuevo estudio
        const url = 'https://api.cheetah-research.ai/configuration/createStudy/';
        
        console.log('Enviando solicitud de duplicación a:', url);
        
        // Hacer la solicitud POST para crear el estudio duplicado
        axios.post(url, duplicateData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Estudio duplicado creado exitosamente:', response.data);
            
            // Obtener el ID del nuevo estudio
            const newStudyId = response.data.study_id;
            console.log('ID del nuevo estudio:', newStudyId);
            
            // Ahora configurar los colores del estudio duplicado
            if (studyData.primary_color && studyData.secondary_color) {
                console.log('Configurando colores del estudio duplicado...');
                
                const colorsUrl = `https://api.cheetah-research.ai/configuration/set_colors/${newStudyId}`;
                const colorsData = new FormData();
                colorsData.append('primary_color', studyData.primary_color);
                colorsData.append('secondary_color', studyData.secondary_color);
                
                axios.post(colorsUrl, colorsData)
                    .then(colorsResponse => {
                        console.log('Colores configurados exitosamente:', colorsResponse.data);
                        
                        // Mostrar mensaje de éxito
                        alert('¡Estudio duplicado exitosamente! Se han copiado todos los datos incluyendo los colores.');
                        
                        // Opcional: Redirigir al nuevo estudio o recargar la página
                        // window.location.reload();
                    })
                    .catch(colorsError => {
                        console.error('Error al configurar los colores:', colorsError);
                        alert('Estudio duplicado pero hubo un problema al configurar los colores. Puedes configurarlos manualmente.');
                    });
            } else {
                console.log('No se encontraron colores para copiar');
                alert('¡Estudio duplicado exitosamente! Se han copiado todos los datos del estudio.');
            }
        })
        .catch(error => {
            console.error('Error al crear el estudio duplicado:', error);
            alert('Error al duplicar el estudio. Por favor, inténtalo de nuevo.');
        });
        
    } catch (error) {
        console.error('Error en el proceso de duplicación:', error);
        alert('Error inesperado al duplicar el estudio. Por favor, inténtalo de nuevo.');
    }
}

// Función para inicializar la funcionalidad de duplicación
function initDuplicateStudy() {
    console.log('Inicializando funcionalidad de duplicación de estudios...');
    
    // Verificar si estamos en la página de información del estudio
    if (window.location.href.includes('https://www.cheetah-research.ai/configuration/studyInfo/')) {
        // Verificar si hay un estudio seleccionado
        if (sessionStorage.getItem('selectedStudyId') != null) {
            console.log('Estudio seleccionado encontrado, configurando botón de duplicación...');
            
            // Buscar el botón de duplicación
            const duplicateButton = document.getElementById('duplicateStudyBtn');
            if (duplicateButton) {
                // Agregar el event listener al botón
                duplicateButton.addEventListener('click', duplicateStudy);
                console.log('Event listener agregado al botón de duplicación');
                
                // Habilitar el botón
                duplicateButton.disabled = false;
                duplicateButton.style.opacity = '1';
            } else {
                console.error('No se encontró el botón de duplicación');
            }
        } else {
            console.log('No hay estudio seleccionado, deshabilitando botón de duplicación...');
            
            // Deshabilitar el botón si no hay estudio seleccionado
            const duplicateButton = document.getElementById('duplicateStudyBtn');
            if (duplicateButton) {
                duplicateButton.disabled = true;
                duplicateButton.style.opacity = '0.5';
                duplicateButton.title = 'Selecciona un estudio para poder duplicarlo';
            }
        }
    } else {
        console.log('No estamos en la página de información del estudio, no se configura botón de duplicación');
    }
}

// Inicializar cuando la página se carga
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDuplicateStudy);
} else {
    // Si el DOM ya está cargado, ejecutar inmediatamente
    initDuplicateStudy();
}
