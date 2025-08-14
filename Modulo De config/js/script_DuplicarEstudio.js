/**
 * Script para duplicar estudios
 * Duplica todos los datos del estudio actual incluyendo:
 * - Título del estudio (con sufijo "- COPIA")
 * - Mercado objetivo
 * - Objetivos del estudio
 * - Prompt del estudio
 * - Colores principal y secundario
 * - Nombre del encuestador
 * - Tono del encuestador
 * - Observaciones importantes del encuestador
 * - Saludo del encuestador
 * - Encuesta completa
 * - Filtros del estudio
 * - Dominios autorizados
 * - Módulos activos en el estudio
 * - Preguntas sugeridas
 */

// Función principal para duplicar el estudio
async function duplicarEstudio() {
    const studyId = sessionStorage.getItem('selectedStudyId');
    const token = sessionStorage.getItem('token');
    
    if (!studyId || !token) {
        alert('Error: No se encontró el ID del estudio o el token de autenticación.');
        return;
    }

    try {
        // Mostrar indicador de carga
        const btnDuplicar = document.getElementById('DuplicarEstudioBtn');
        const textoOriginal = btnDuplicar.textContent;
        btnDuplicar.textContent = 'Duplicando...';
        btnDuplicar.disabled = true;

        // Obtener todos los datos del estudio actual
        const studyData = await obtenerDatosEstudio(studyId, token);
        
        // Crear el nuevo estudio
        const nuevoStudyId = await crearNuevoEstudio(studyData, token);
        
        // Duplicar todos los componentes del estudio
        await duplicarComponentesEstudio(studyId, nuevoStudyId, token, studyData);
        
        // Mostrar mensaje de éxito
        alert('Estudio duplicado exitosamente. El nuevo estudio se ha creado con el título: "' + studyData.titulo + ' - COPIA"');
        
        // Recargar la página para mostrar el nuevo estudio
        location.reload();
        
    } catch (error) {
        console.error('Error al duplicar el estudio:', error);
        alert('Error al duplicar el estudio: ' + error.message);
        
        // Restaurar el botón
        const btnDuplicar = document.getElementById('DuplicarEstudioBtn');
        btnDuplicar.textContent = 'Duplicar Estudio';
        btnDuplicar.disabled = false;
    }
}

// Función para obtener todos los datos del estudio actual
async function obtenerDatosEstudio(studyId, token) {
    const studyData = {};
    
    try {
        // 1. Información básica del estudio
        const infoResponse = await axios.get(`https://api.cheetah-research.ai/configuration/info_study/${studyId}`);
        const info = infoResponse.data;
        
        studyData.titulo = info.title || 'Estudio sin título';
        studyData.mercadoObjetivo = info.marketTarget || '';
        studyData.objetivos = info.objective || '';
        studyData.prompt = info.prompt || '';
        studyData.colorPrincipal = info.primary_color || '#FF6B35';
        studyData.colorSecundario = info.secondary_color || '#004E89';
        
        // 2. Información del encuestador
        try {
            const interviewerResponse = await axios.post('https://api.cheetah-research.ai/configuration/getInterviewer/', 
                { study_id: studyId },
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const interviewer = interviewerResponse.data;
            
            studyData.nombreEncuestador = interviewer.interviewerName || '';
            studyData.tonoEncuestador = interviewer.interviewerTone || '';
            studyData.observacionesImportantes = interviewer.importantObservation || '';
            studyData.saludoEncuestador = interviewer.interviewerGreeting || '';
            studyData.fotoEncuestador = interviewer.interviewerProfilePicture || null;
        } catch (error) {
            console.log('No se encontró información del encuestador:', error.message);
        }
        
        // 3. Encuesta completa
        try {
            const surveyResponse = await axios.get(`https://api.cheetah-research.ai/configuration/get_survey/${studyId}`);
            studyData.encuesta = surveyResponse.data || {};
        } catch (error) {
            console.log('No se encontró información de la encuesta:', error.message);
        }
        
        // 4. Filtros del estudio
        try {
            const filtersResponse = await axios.get(`https://api.cheetah-research.ai/configuration/get_filters/${studyId}`);
            studyData.filtros = filtersResponse.data || [];
        } catch (error) {
            console.log('No se encontraron filtros:', error.message);
        }
        
        // 5. Dominios autorizados
        try {
            const domainsResponse = await axios.get('https://api.cheetah-research.ai/configuration/api/get-list-domains/');
            studyData.dominios = domainsResponse.data || [];
        } catch (error) {
            console.log('No se encontraron dominios:', error.message);
        }
        
        // 6. Módulos activos
        try {
            const modulesResponse = await axios.get(`https://api.cheetah-research.ai/configuration/get_modules/${studyId}`);
            studyData.modulos = modulesResponse.data || [];
        } catch (error) {
            console.log('No se encontraron módulos:', error.message);
        }
        
        // 7. Preguntas sugeridas
        try {
            const questionsResponse = await axios.get(`https://api.cheetah-research.ai/configuration/get_questions/${studyId}`);
            studyData.preguntas = questionsResponse.data || [];
        } catch (error) {
            console.log('No se encontraron preguntas:', error.message);
        }
        
        // 8. Preguntas por defecto
        try {
            const defaultQuestionsResponse = await axios.get(`https://api.cheetah-research.ai/configuration/getDefaultQuestions/${studyId}`);
            studyData.preguntasPorDefecto = defaultQuestionsResponse.data || [];
        } catch (error) {
            console.log('No se encontraron preguntas por defecto:', error.message);
        }
        
    } catch (error) {
        throw new Error('Error al obtener los datos del estudio: ' + error.message);
    }
    
    return studyData;
}

// Función para crear el nuevo estudio
async function crearNuevoEstudio(studyData, token) {
    try {
        const nuevoTitulo = studyData.titulo + ' - COPIA';
        
        const data = {
            title: nuevoTitulo,
            target: studyData.mercadoObjetivo,
            objective: studyData.objetivos,
            prompt: studyData.prompt
        };
        
        const response = await axios.post('https://api.cheetah-research.ai/configuration/createStudy/', data, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const nuevoStudyId = response.data.study_id;
        
        // Configurar colores del nuevo estudio
        if (studyData.colorPrincipal || studyData.colorSecundario) {
            const colorData = new FormData();
            if (studyData.colorPrincipal) colorData.append('primary_color', studyData.colorPrincipal);
            if (studyData.colorSecundario) colorData.append('secondary_color', studyData.colorSecundario);
            
            await axios.post(`https://api.cheetah-research.ai/configuration/set_colors/${nuevoStudyId}`, colorData);
        }
        
        return nuevoStudyId;
        
    } catch (error) {
        throw new Error('Error al crear el nuevo estudio: ' + error.message);
    }
}

// Función para duplicar todos los componentes del estudio
async function duplicarComponentesEstudio(studyIdOriginal, nuevoStudyId, token, studyData) {
    try {
        // 1. Duplicar encuestador
        if (studyData.nombreEncuestador) {
            const interviewerData = new FormData();
            interviewerData.append('interviewerName', studyData.nombreEncuestador);
            interviewerData.append('interviewerTone', studyData.tonoEncuestador);
            interviewerData.append('interviewerGreeting', studyData.saludoEncuestador);
            interviewerData.append('importantObservation', studyData.observacionesImportantes);
            interviewerData.append('study_id', nuevoStudyId);
            
            if (studyData.fotoEncuestador) {
                // Convertir base64 a blob si es necesario
                if (typeof studyData.fotoEncuestador === 'string' && studyData.fotoEncuestador.startsWith('data:')) {
                    const response = await fetch(studyData.fotoEncuestador);
                    const blob = await response.blob();
                    interviewerData.append('interviewerProfilePicture', blob, 'profile.jpg');
                } else {
                    interviewerData.append('interviewerProfilePicture', studyData.fotoEncuestador);
                }
            }
            
            await axios.post('https://api.cheetah-research.ai/configuration/addInterviewer/', interviewerData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        
        // 2. Duplicar encuesta
        if (studyData.encuesta && Object.keys(studyData.encuesta).length > 0) {
            const surveyData = new FormData();
            surveyData.append('questions', JSON.stringify(studyData.encuesta));
            
            await axios.post(`https://api.cheetah-research.ai/configuration/createQuestion/${nuevoStudyId}/`, surveyData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        
        // 3. Duplicar filtros
        if (studyData.filtros && studyData.filtros.length > 0) {
            const filtersData = new FormData();
            filtersData.append('filters', JSON.stringify(studyData.filtros));
            
            await axios.post(`https://api.cheetah-research.ai/configuration/filters/${nuevoStudyId}`, filtersData);
        }
        
        // 4. Duplicar dominios autorizados
        if (studyData.dominios && studyData.dominios.length > 0) {
            for (const dominio of studyData.dominios) {
                try {
                    const domainData = new FormData();
                    domainData.append('domain', dominio);
                    domainData.append('study_id', nuevoStudyId);
                    
                    await axios.post('https://api.cheetah-research.ai/configuration/api/add-domain/', domainData);
                } catch (error) {
                    console.log('Error al duplicar dominio:', dominio, error.message);
                }
            }
        }
        
        // 5. Duplicar módulos activos
        if (studyData.modulos && studyData.modulos.length > 0) {
            const modulesData = new FormData();
            modulesData.append('modules', JSON.stringify(studyData.modulos));
            
            await axios.post(`https://api.cheetah-research.ai/configuration/modules/${nuevoStudyId}`, modulesData);
        }
        
        // 6. Duplicar preguntas sugeridas
        if (studyData.preguntas && studyData.preguntas.length > 0) {
            const suggestedQuestionsData = {
                suggested_questions: studyData.preguntas.map(q => ({
                    question: q.question,
                    status: q.status || 1
                }))
            };
            
            await axios.post(`https://api.cheetah-research.ai/configuration/suggested_questions/${nuevoStudyId}`, suggestedQuestionsData, {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // 7. Duplicar preguntas por defecto
        if (studyData.preguntasPorDefecto && studyData.preguntasPorDefecto.length > 0) {
            const defaultQuestionsData = {
                default_questions: studyData.preguntasPorDefecto.map(q => ({
                    question: q.question,
                    status: q.status || 1
                }))
            };
            
            await axios.post(`https://api.cheetah-research.ai/configuration/updateDefaultQuestions/${nuevoStudyId}/`, defaultQuestionsData, {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
    } catch (error) {
        throw new Error('Error al duplicar los componentes del estudio: ' + error.message);
    }
}

// Agregar el event listener cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const btnDuplicar = document.getElementById('DuplicarEstudioBtn');
    if (btnDuplicar) {
        btnDuplicar.addEventListener('click', duplicarEstudio);
    }
});

// También agregar el event listener si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        const btnDuplicar = document.getElementById('DuplicarEstudioBtn');
        if (btnDuplicar) {
            btnDuplicar.addEventListener('click', duplicarEstudio);
        }
    });
} else {
    const btnDuplicar = document.getElementById('DuplicarEstudioBtn');
    if (btnDuplicar) {
        btnDuplicar.addEventListener('click', duplicarEstudio);
    }
}
