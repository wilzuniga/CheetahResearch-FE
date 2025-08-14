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

// Función para agregar el botón de duplicación al formulario
function addDuplicateButton() {
    console.log('Agregando botón de duplicación...');
    
    // Buscar el contenedor del formulario
    const formContainer = document.getElementById('form-containerStudy');
    
    if (!formContainer) {
        console.error('No se encontró el contenedor del formulario');
        return;
    }
    
    // Verificar si el botón ya existe para evitar duplicados
    if (document.getElementById('duplicateStudyBtn')) {
        console.log('El botón de duplicación ya existe');
        return;
    }
    
    // Crear el botón de duplicación
    const duplicateButton = document.createElement('div');
    duplicateButton.className = 'mb-3';
    duplicateButton.style.fontFamily = "'hedliner', sans-serif";
    duplicateButton.style.textAlign = 'center';
    
    duplicateButton.innerHTML = `
        <button class="btn btn-warning" id="duplicateStudyBtn" type="button" 
                style="font-family: 'hedliner', sans-serif; font-weight: bold; border-radius: 13px; padding: 10px 20px; font-size: 18px;" 
                data-i18n="CreacionDeEstudio.btDuplicate">
            🔄 Duplicar Estudio
        </button>
    `;
    
    // Insertar el botón después del botón de actualizar
    const updateButton = formContainer.querySelector('#UpdateEstudio');
    if (updateButton) {
        // Buscar el contenedor del botón de actualizar
        const updateButtonContainer = updateButton.closest('.mb-3') || updateButton.parentNode;
        updateButtonContainer.parentNode.insertBefore(duplicateButton, updateButtonContainer.nextSibling);
        console.log('Botón de duplicación agregado después del botón de actualizar');
    } else {
        // Si no hay botón de actualizar, agregarlo al final del formulario
        formContainer.appendChild(duplicateButton);
        console.log('Botón de duplicación agregado al final del formulario');
    }
    
    // Agregar el event listener al botón
    document.getElementById('duplicateStudyBtn').addEventListener('click', duplicateStudy);
    console.log('Event listener agregado al botón de duplicación');
}

// Función para inicializar la funcionalidad de duplicación
function initDuplicateStudy() {
    console.log('Inicializando funcionalidad de duplicación de estudios...');
    
    // Verificar si estamos en la página de información del estudio
    if (window.location.href.includes('https://www.cheetah-research.ai/configuration/study/')) {
        // Verificar si hay un estudio seleccionado (modo edición)
        if (sessionStorage.getItem('selectedStudyId') != null) {
            console.log('Estudio seleccionado encontrado, agregando botón de duplicación...');
            
            // Esperar a que el DOM esté completamente cargado y el formulario renderizado
            const checkFormInterval = setInterval(() => {
                const formContainer = document.getElementById('form-containerStudy');
                const updateButton = document.getElementById('UpdateEstudio');
                
                if (formContainer && updateButton) {
                    clearInterval(checkFormInterval);
                    console.log('Formulario encontrado, agregando botón de duplicación...');
                    addDuplicateButton();
                }
            }, 100);
            
            // Timeout de seguridad para evitar bucles infinitos
            setTimeout(() => {
                clearInterval(checkFormInterval);
                console.log('Timeout alcanzado al buscar el formulario');
            }, 10000);
        } else {
            console.log('No hay estudio seleccionado, no se agrega botón de duplicación');
        }
    } else {
        console.log('No estamos en la página de estudio, no se agrega botón de duplicación');
    }
}

// Inicializar cuando la página se carga
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDuplicateStudy);
} else {
    // Si el DOM ya está cargado, esperar un poco más para asegurar que el formulario esté renderizado
    setTimeout(initDuplicateStudy, 1000);
}
