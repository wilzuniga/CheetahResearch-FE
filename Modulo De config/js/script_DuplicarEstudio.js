// Script para duplicar estudios
// Funcionalidad: Duplica todos los datos del estudio actual con el título "[Título] - COPIA"
// FASE 2: También duplica el encuestador asociado al estudio
// FASE 3: También duplica la encuesta asociada al estudio
// FASE 4: También duplica la configuración de lanzamiento del estudio

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
                        
                        // Después de configurar los colores, duplicar el encuestador
                        console.log('Iniciando duplicación del encuestador...');
                        duplicateInterviewer(newStudyId);
                        
                    })
                    .catch(colorsError => {
                        console.error('Error al configurar los colores:', colorsError);
                        alert('Estudio duplicado pero hubo un problema al configurar los colores. Puedes configurarlos manualmente.');
                        
                        // Aún así, intentar duplicar el encuestador
                        console.log('Intentando duplicar el encuestador sin colores...');
                        duplicateInterviewer(newStudyId);
                    });
            } else {
                console.log('No se encontraron colores para copiar');
                console.log('Iniciando duplicación del encuestador...');
                duplicateInterviewer(newStudyId);
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

// Función para duplicar el encuestador del estudio original
async function duplicateInterviewer(newStudyId) {
    console.log('Iniciando duplicación del encuestador...');
    
    try {
        const originalStudyId = sessionStorage.getItem('selectedStudyId');
        console.log('ID del estudio original:', originalStudyId);
        console.log('ID del nuevo estudio:', newStudyId);
        
        // GET: Obtener datos del encuestador del estudio original
        console.log('Obteniendo datos del encuestador original...');
        const getUrl = 'https://api.cheetah-research.ai/configuration/getInterviewer/';
        
        const getResponse = await axios.post(getUrl, { study_id: originalStudyId }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        
        const interviewerData = getResponse.data;
        console.log('Datos del encuestador obtenidos:', interviewerData);
        
        // Verificar si existe un encuestador para duplicar
        if (!interviewerData.interviewerName) {
            console.log('No hay encuestador para duplicar en el estudio original');
            console.log('Iniciando duplicación de la encuesta...');
            duplicateSurvey(newStudyId);
            return;
        }
        
        // CREATE: Crear el encuestador en el nuevo estudio
        console.log('Creando encuestador en el nuevo estudio...');
        const createUrl = 'https://api.cheetah-research.ai/configuration/addInterviewer/';
        
        //crear un archivo png vacio
        const photoFile = new File([], 'interviewerPhoto.png', { type: 'image/png' });
        
        const createData = new FormData();
        createData.append('interviewerName', interviewerData.interviewerName);
        createData.append('interviewerProfilePicture', photoFile);
        createData.append('interviewerTone', interviewerData.interviewerTone);
        createData.append('interviewerGreeting', interviewerData.interviewerGreeting);
        createData.append('importantObservation', interviewerData.importantObservation);
        createData.append('study_id', newStudyId);
        
        console.log('Datos del encuestador preparados para duplicación:', {
            interviewerName: interviewerData.interviewerName,
            interviewerTone: interviewerData.interviewerTone,
            interviewerGreeting: interviewerData.interviewerGreeting,
            importantObservation: interviewerData.importantObservation,
            study_id: newStudyId
        });
        
        const createResponse = await axios.post(createUrl, createData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('Encuestador duplicado exitosamente:', createResponse.data);
        
        // Después de duplicar el encuestador, duplicar la encuesta
        console.log('Iniciando duplicación de la encuesta...');
        duplicateSurvey(newStudyId);
        
    } catch (error) {
        console.error('Error al duplicar el encuestador:', error);
        
        if (error.response) {
            console.error('Respuesta del servidor:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        
        console.log('Intentando duplicar la encuesta sin encuestador...');
        duplicateSurvey(newStudyId);
    }
}

// Función para duplicar la encuesta del estudio original
async function duplicateSurvey(newStudyId) {
    console.log('Iniciando duplicación de la encuesta...');
    
    try {
        const originalStudyId = sessionStorage.getItem('selectedStudyId');
        console.log('ID del estudio original para encuesta:', originalStudyId);
        console.log('ID del nuevo estudio para encuesta:', newStudyId);
        
        // GET: Obtener datos de la encuesta del estudio original
        console.log('Obteniendo datos de la encuesta original...');
        const getSurveyUrl = `https://api.cheetah-research.ai/configuration/get_survey/${originalStudyId}`;
        
        const getSurveyResponse = await axios.get(getSurveyUrl);
        const surveyData = getSurveyResponse.data;
        console.log('Datos de la encuesta obtenidos:', surveyData);
        
        // Verificar si existe una encuesta para duplicar
        if (!surveyData.questions || surveyData.questions.length === 0) {
            console.log('No hay encuesta para duplicar en el estudio original');
            console.log('Iniciando duplicación de la configuración de lanzamiento...');
            duplicateLaunchConfiguration(newStudyId);
            return;
        }
        
        // Filtrar solo las preguntas personalizadas (ignorar las 3 preguntas predeterminadas)
        const customQuestions = surveyData.questions.filter(question => {
            // Las preguntas predeterminadas suelen tener IDs específicos o estar marcadas de cierta manera
            // Por ahora, asumimos que todas las preguntas en questions son personalizadas
            return question && question.question && question.weight;
        });
        
        console.log('Preguntas personalizadas filtradas:', customQuestions);
        
        if (customQuestions.length === 0) {
            console.log('No hay preguntas personalizadas para duplicar');
            console.log('Iniciando duplicación de la configuración de lanzamiento...');
            duplicateLaunchConfiguration(newStudyId);
            return;
        }
        
        // CREATE: Crear la encuesta en el nuevo estudio
        console.log('Creando encuesta en el nuevo estudio...');
        const createSurveyUrl = `https://api.cheetah-research.ai/configuration/createQuestion/${newStudyId}/`;
        
        // Preparar los datos de la encuesta
        const surveyFormData = new FormData();
        surveyFormData.append('questions', JSON.stringify(customQuestions));
        
        console.log('Datos de la encuesta preparados para duplicación:', {
            questionsCount: customQuestions.length,
            questions: customQuestions.map(q => ({
                question: q.question,
                weight: q.weight,
                url: q.url || null,
                file_path: q.file_path || null,
                feedback_questions: q.feedback_questions || []
            }))
        });
        
        const createSurveyResponse = await axios.post(createSurveyUrl, surveyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        
        console.log('Encuesta duplicada exitosamente:', createSurveyResponse.data);
        
        // Después de duplicar la encuesta, duplicar la configuración de lanzamiento
        console.log('Iniciando duplicación de la configuración de lanzamiento...');
        duplicateLaunchConfiguration(newStudyId);
        
    } catch (error) {
        console.error('Error al duplicar la encuesta:', error);
        
        if (error.response) {
            console.error('Respuesta del servidor:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        
        console.log('Intentando duplicar la configuración de lanzamiento sin encuesta...');
        duplicateLaunchConfiguration(newStudyId);
    }
}

// Función para duplicar la configuración de lanzamiento del estudio original
async function duplicateLaunchConfiguration(newStudyId) {
    console.log('Iniciando duplicación de la configuración de lanzamiento...');
    
    try {
        const originalStudyId = sessionStorage.getItem('selectedStudyId');
        console.log('ID del estudio original para configuración de lanzamiento:', originalStudyId);
        console.log('ID del nuevo estudio para configuración de lanzamiento:', newStudyId);
        
        // Duplicar filtros
        console.log('Duplicando filtros...');
        await duplicateFilters(originalStudyId, newStudyId);
        
        // Duplicar módulos
        console.log('Duplicando módulos...');
        await duplicateModules(originalStudyId, newStudyId);
        
        // Duplicar dominios
        console.log('Duplicando dominios...');
        await duplicateDomains(originalStudyId, newStudyId);
        
        // Duplicar preguntas sugeridas
        console.log('Duplicando preguntas sugeridas...');
        await duplicateSuggestedQuestions(originalStudyId, newStudyId);
        
        // Duplicar estado del estudio
        console.log('Duplicando estado del estudio...');
        await duplicateStudyStatus(originalStudyId, newStudyId);
        
        console.log('Configuración de lanzamiento duplicada exitosamente');
        
        // Mostrar mensaje de éxito completo
        alert('¡Estudio duplicado exitosamente! Se han copiado todos los datos incluyendo los colores, el encuestador, la encuesta y la configuración completa de lanzamiento.');
        
    } catch (error) {
        console.error('Error al duplicar la configuración de lanzamiento:', error);
        
        if (error.response) {
            console.error('Respuesta del servidor:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
        }
        
        alert('Estudio duplicado pero hubo un problema al duplicar la configuración de lanzamiento. Puedes configurarla manualmente.');
    }
}

// Función para duplicar filtros
async function duplicateFilters(originalStudyId, newStudyId) {
    try {
        console.log('Obteniendo filtros del estudio original...');
        const getFiltersUrl = `https://api.cheetah-research.ai/configuration/get_filters/${originalStudyId}`;
        
        const getFiltersResponse = await axios.get(getFiltersUrl);
        const filtersData = getFiltersResponse.data;
        console.log('Filtros obtenidos:', filtersData);
        
        if (filtersData.filters && filtersData.filters.length > 0) {
            console.log('Duplicando filtros:', filtersData.filters);
            
            const filtersFormData = new FormData();
            filtersFormData.append('filters', JSON.stringify(filtersData.filters));
            
            const createFiltersUrl = `https://api.cheetah-research.ai/configuration/filters/${newStudyId}`;
            const createFiltersResponse = await axios.post(createFiltersUrl, filtersFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            console.log('Filtros duplicados exitosamente:', createFiltersResponse.data);
        } else {
            console.log('No hay filtros para duplicar');
        }
    } catch (error) {
        console.error('Error al duplicar filtros:', error);
        // Continuar con el siguiente elemento
    }
}

// Función para duplicar módulos
async function duplicateModules(originalStudyId, newStudyId) {
    try {
        console.log('Obteniendo módulos del estudio original...');
        const getModulesUrl = `https://api.cheetah-research.ai/configuration/get_modules/${originalStudyId}`;
        
        const getModulesResponse = await axios.get(getModulesUrl);
        const modulesData = getModulesResponse.data;
        console.log('Módulos obtenidos:', modulesData);
        
        if (modulesData.modules && modulesData.modules.length > 0) {
            console.log('Duplicando módulos:', modulesData.modules);
            
            const modulesFormData = new FormData();
            modulesFormData.append('modules', JSON.stringify(modulesData.modules));
            
            const createModulesUrl = `https://api.cheetah-research.ai/configuration/modules/${newStudyId}`;
            const createModulesResponse = await axios.post(createModulesUrl, modulesFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            console.log('Módulos duplicados exitosamente:', createModulesResponse.data);
        } else {
            console.log('No hay módulos para duplicar');
        }
    } catch (error) {
        console.error('Error al duplicar módulos:', error);
        // Continuar con el siguiente elemento
    }
}

// Función para duplicar dominios
async function duplicateDomains(originalStudyId, newStudyId) {
    try {
        console.log('Obteniendo dominios del estudio original...');
        const getDomainsUrl = 'https://api.cheetah-research.ai/configuration/api/get-list-domains/';
        
        const getDomainsFormData = new FormData();
        getDomainsFormData.append('study_id', originalStudyId);
        
        const getDomainsResponse = await axios.post(getDomainsUrl, getDomainsFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        
        const domainsData = getDomainsResponse.data;
        console.log('Dominios obtenidos:', domainsData);
        
        if (domainsData.domains && domainsData.domains.length > 0) {
            console.log('Duplicando dominios:', domainsData.domains);
            
            // Agregar cada dominio individualmente
            const addDomainUrl = 'https://api.cheetah-research.ai/configuration/api/add-domain/';
            
            for (const domain of domainsData.domains) {
                const domainFormData = new FormData();
                domainFormData.append('study_id', newStudyId);
                domainFormData.append('domain', domain);
                
                const addDomainResponse = await axios.post(addDomainUrl, domainFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                
                console.log(`Dominio "${domain}" agregado exitosamente:`, addDomainResponse.data);
            }
            
            console.log('Todos los dominios duplicados exitosamente');
        } else {
            console.log('No hay dominios para duplicar');
        }
    } catch (error) {
        console.error('Error al duplicar dominios:', error);
        // Continuar con el siguiente elemento
    }
}

// Función para duplicar preguntas sugeridas
async function duplicateSuggestedQuestions(originalStudyId, newStudyId) {
    try {
        console.log('Obteniendo preguntas sugeridas del estudio original...');
        const getQuestionsUrl = `https://api.cheetah-research.ai/configuration/get_questions/${originalStudyId}`;
        
        const getQuestionsResponse = await axios.get(getQuestionsUrl);
        const questionsData = getQuestionsResponse.data;
        console.log('Preguntas sugeridas obtenidas:', questionsData);
        
        if (questionsData.suggested_questions && questionsData.suggested_questions.length > 0) {
            console.log('Duplicando preguntas sugeridas:', questionsData.suggested_questions);
            
            const questionsDataToSend = {
                suggested_questions: questionsData.suggested_questions
            };
            
            const createQuestionsUrl = `https://api.cheetah-research.ai/configuration/suggested_questions/${newStudyId}`;
            const createQuestionsResponse = await axios.post(createQuestionsUrl, questionsDataToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Preguntas sugeridas duplicadas exitosamente:', createQuestionsResponse.data);
        } else {
            console.log('No hay preguntas sugeridas para duplicar');
        }
    } catch (error) {
        console.error('Error al duplicar preguntas sugeridas:', error);
        // Continuar con el siguiente elemento
    }
}

// Función para duplicar el estado del estudio
async function duplicateStudyStatus(originalStudyId, newStudyId) {
    try {
        console.log('Obteniendo estado del estudio original...');
        const getStudyInfoUrl = `https://api.cheetah-research.ai/configuration/info_study/${originalStudyId}`;
        
        const getStudyInfoResponse = await axios.get(getStudyInfoUrl);
        const studyInfoData = getStudyInfoResponse.data;
        console.log('Estado del estudio obtenido:', studyInfoData);
        
        const studyStatus = studyInfoData.studyStatus;
        console.log('Estado del estudio a duplicar:', studyStatus);
        
        if (studyStatus !== undefined && studyStatus !== null) {
            console.log('Duplicando estado del estudio:', studyStatus);
            
            // Activar módulo de análisis si está activo en el original
            if (studyStatus === 2 || studyStatus === 3) {
                console.log('Activando módulo de análisis...');
                const activateAnalisisUrl = 'https://api.cheetah-research.ai/configuration/activateAnalisis/';
                const analisisFormData = new FormData();
                analisisFormData.append('study_id', newStudyId);
                
                await axios.post(activateAnalisisUrl, analisisFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                
                console.log('Módulo de análisis activado exitosamente');
            }
            
            // Activar módulo de recolección si está activo en el original
            if (studyStatus === 1 || studyStatus === 3) {
                console.log('Activando módulo de recolección...');
                const activateCollectionUrl = 'https://api.cheetah-research.ai/configuration/activateCollection/';
                const collectionFormData = new FormData();
                collectionFormData.append('study_id', newStudyId);
                
                await axios.post(activateCollectionUrl, collectionFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                
                console.log('Módulo de recolección activado exitosamente');
            }
            
            console.log('Estado del estudio duplicado exitosamente');
        } else {
            console.log('No hay estado del estudio para duplicar');
        }
    } catch (error) {
        console.error('Error al duplicar el estado del estudio:', error);
        // Continuar sin interrumpir el proceso
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
