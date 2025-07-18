function llenar() {
    //Idioma
    const lang = localStorage.getItem('language') || 'es';
    setLanguage(lang);
    
    const studyDataJSON = localStorage.getItem('selectedStudyData');
    
    if (!studyDataJSON) {
        console.error('No se encontró el estudio seleccionado en localStorage.');
        return;
    }

    const studyData = JSON.parse(studyDataJSON);

    const selectedStudyData = {
        tituloDelEstudio: studyData.title || 'Título no disponible',
        mercadoObjetivo: studyData.marketTarget || 'Mercado no disponible',
        objetivosDelEstudio: studyData.studyObjectives || 'Objetivos no disponibles',
        Resumen: studyData.prompt || 'Resumen no disponible',
    };

    const nombreProyectoLbl = document.getElementById('nombreProyectoLbl');
    if (nombreProyectoLbl) {
        nombreProyectoLbl.innerText = selectedStudyData.tituloDelEstudio;
    } else {
        console.error('Elemento con ID "nombreProyectoLbl" no encontrado.');
    }

    const url = 'https://api.cheetah-research.ai/chatbot/download_logs/';
    const formData = new FormData();
    const studyId = localStorage.getItem('selectedStudyId');
    if (!studyId) {
        console.error('No se encontró "selectedStudyId" en localStorage.');
        return;
    }
    formData.append('study_id', studyId);
    setColorsFromAPI(studyId);//Setea colores

    // Evento para manejar la descarga cuando se hace clic en el botón
    const downloadLogsButton = document.getElementById('DescargarTranscrptBtn');
    if (downloadLogsButton) {
        downloadLogsButton.addEventListener('click', () => {
            axios.post(url, formData)
            .then((response) => {
                const downloadUrl = response.data.url;
                // Sanitizar el nombre del archivo
                const sanitizedTitle = selectedStudyData.tituloDelEstudio.replace(/\s+/g, '_').replace(/[\/\\?*:|"<>]/g, '');
                const filename = 'transcript_' + sanitizedTitle + '.csv';
                // Crear un enlace temporal para la descarga
                const tempLink = document.createElement('a');
                tempLink.href = downloadUrl;
                tempLink.download = filename; // Usar el nombre sanitizado
                tempLink.style.display = 'none'; // Ocultar el enlace
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            })
            .catch((error) => {
                console.error('Error al realizar la solicitud:', error);
            });
        });
    } else {
        console.error('Elemento con ID "DescargarTranscrptBtn" no encontrado.');
    }

    /**
     * DELETE /configuration/files/<study_id>

{
  "status": "success",
  "message": "Successfully deleted 1 files from <>",
  "deleted_count": 1
}

boton BorrarBtn

     */

    // Evento para manejar la eliminación de archivos cuando se hace clic en el botón
    const deleteButton = document.getElementById('BorrarBtn');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const studyId = localStorage.getItem('selectedStudyId');
            if (!studyId) {
                console.error('No se encontró "selectedStudyId" en localStorage.');
                return;
            }

            // Confirmación antes de eliminar
            const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar los archivos de este estudio? Esta acción no se puede deshacer.');
            if (!confirmDelete) {
                return;
            }

            axios.delete(`https://api.cheetah-research.ai/configuration/files/${studyId}`)
                .then((response) => {
                    const deletedCount = response.data.deleted_count || 0;
                    alert(`Se eliminaron correctamente ${deletedCount} archivo(s).`);
                    console.log('Respuesta de eliminación:', response.data);
                    // Aquí puedes manejar la respuesta de la API según sea necesario
                })
                .catch((error) => {
                    console.error('Error al realizar la solicitud:', error);
                });
        });
    } else {
        console.error('Elemento con ID "BorrarBtn" no encontrado.');
    }

    //descargar transcripciones de backup con boton DescargarTranscrptBtnBckup y con link https://api.cheetah-research.ai/chatbot/download_logs_bckup/
    const downloadLogsButtonBckup = document.getElementById('DescargarTranscrptBtnBckup');
    if (downloadLogsButtonBckup) {
        downloadLogsButtonBckup.addEventListener('click', () => {
            axios.post('https://api.cheetah-research.ai/chatbot/download_logs_backup/', formData)
            .then((response) => {
                const downloadUrl = response.data.url;
                // Sanitizar el nombre del archivo
                const sanitizedTitle = selectedStudyData.tituloDelEstudio.replace(/\s+/g, '_').replace(/[\/\\?*:|"<>]/g, '');
                const filename = 'transcript_' + sanitizedTitle + '.csv';
                // Crear un enlace temporal para la descarga
                const tempLink = document.createElement('a');
                tempLink.href = downloadUrl;
                tempLink.download = filename; // Usar el nombre sanitizado
                tempLink.style.display = 'none'; // Ocultar el enlace
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);

            })
            .catch((error) => {
                console.error('Error al realizar la solicitud:', error);
            });
        });
    }else {
        console.error('Elemento con ID "DescargarTranscrptBtn" no encontrado.');
    }


    //DescargarLogOTPBckup CON EL LINK /configuration/api/download_log_otp/
    const downloadLogsButtonOTP = document.getElementById('DescargarLogOTPBtn');
    if (downloadLogsButtonOTP) {
        downloadLogsButtonOTP.addEventListener('click', () => {
            axios.post('https://api.cheetah-research.ai/configuration/api/download_log_otp/', formData)
            .then((response) => {
                const content = response.data;
                // Sanitizar el nombre del archivo
                const sanitizedTitle = selectedStudyData.tituloDelEstudio.replace(/\s+/g, '_').replace(/[\/\\?*:|"<>]/g, '');
                const filename = 'logOTP_' + sanitizedTitle + '.csv';

                // Usar la función de descarga compartida si está disponible
                if (window.csvUtils && window.csvUtils.downloadCSV) {
                    window.csvUtils.downloadCSV(content, filename);
                } else {
                    // Fallback al método original
                    // Función para escapar caracteres especiales en CSV
                    function escapeCSV(text) {
                        if (text === null || text === undefined) return '';
                        // Convertir a string y escapar comillas dobles
                        let escaped = String(text).replace(/"/g, '""');
                        // Reemplazar saltos de línea con espacios
                        escaped = escaped.replace(/\n/g, ' ').replace(/\r/g, ' ');
                        return escaped;
                    }

                    // Agregar BOM para UTF-8 si el contenido no lo tiene ya
                    let csvContent = content;
                    if (!content.startsWith('\uFEFF')) {
                        csvContent = '\uFEFF' + content;
                    }

                    // Descargar archivo usando un Blob
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = window.URL.createObjectURL(blob);
                    const tempLink = document.createElement('a');
                    tempLink.href = url;
                    tempLink.download = filename;
                    tempLink.style.display = 'none'; // Ocultar el enlace
                    document.body.appendChild(tempLink); // Agregar el enlace al DOM
                    tempLink.click();
                    document.body.removeChild(tempLink); // Eliminar el enlace temporal
                    window.URL.revokeObjectURL(url); // Liberar recursos
                }


            })
            .catch((error) => {
                console.error('Error al realizar la solicitud:', error);
            });
        });
    }else {
        console.error('Elemento con ID "DescargarLogOTPBtn" no encontrado.');
    }  
    
    //get numero de encuestas con https://api.cheetah-research.ai/chatbot/survey_count/ y ponerlo en EncuestasLBL
    const surveyCountLabel = document.getElementById('EncuestasLBL');
    if (surveyCountLabel) {
        axios.post('https://api.cheetah-research.ai/chatbot/survey_count/', formData)
        .then((response) => {
            const surveyCount = response.data.survey_count;
            surveyCountLabel.innerText = `${surveyCount}`;
        })
        .catch((error) => {
            console.error('Error al realizar la solicitud:', error);
        });
    } else {
        console.error('Elemento con ID "EncuestasLBL" no encontrado.');
    }

    const token = localStorage.getItem('token');
    const studyIdForSurveys = localStorage.getItem('selectedStudyId');
    const surveyTableBody = document.getElementById('tablaEncuestas');
    const surveyNavContainer = document.getElementById('divEncuestas');

    let surveyData = [];

    function updateSurveyTable() {
        if (surveyData.length > 0 && surveyNavContainer) {
            surveyNavContainer.style.display = 'block';
            
            // Limpiar tabla
            surveyTableBody.innerHTML = '';
            
            // Generar filas de la tabla
            surveyData.forEach((survey, index) => {
                const row = document.createElement('tr');
                
                // Número de encuesta
                const tdNumero = document.createElement('td');
                tdNumero.textContent = index + 1;
                tdNumero.style.fontWeight = 'bold';
                row.appendChild(tdNumero);
                
                // ID
                const tdId = document.createElement('td');
                tdId.textContent = survey.id;
                row.appendChild(tdId);
                
                // Respuesta con botón "Leer Más"
                const tdRespuesta = document.createElement('td');
                tdRespuesta.style.position = 'relative';
                
                // Contenedor para el texto
                const textoContainer = document.createElement('div');
                textoContainer.id = `texto-${index}`;
                
                // Texto truncado inicial
                const textoTruncado = document.createElement('span');
                textoTruncado.id = `texto-truncado-${index}`;
                textoTruncado.textContent = survey.transcription.length > 100 
                    ? survey.transcription.substring(0, 100) + '...' 
                    : survey.transcription;
                textoContainer.appendChild(textoTruncado);
                
                // Texto completo (oculto inicialmente)
                const textoCompleto = document.createElement('span');
                textoCompleto.id = `texto-completo-${index}`;
                textoCompleto.textContent = survey.transcription;
                textoCompleto.style.display = 'none';
                textoContainer.appendChild(textoCompleto);
                
                tdRespuesta.appendChild(textoContainer);
                
                // Botón "Leer Más" (solo si el texto es largo)
                if (survey.transcription.length > 100) {
                    const btnLeerMas = document.createElement('button');
                    btnLeerMas.className = 'btn btn-link btn-sm';
                    btnLeerMas.id = `btn-leer-mas-${index}`;
                    btnLeerMas.textContent = 'Leer Más';
                    btnLeerMas.style.fontSize = '12px';
                    btnLeerMas.style.padding = '2px 8px';
                    btnLeerMas.style.marginTop = '5px';
                    btnLeerMas.style.color = 'var(--bs-CR-orange)';
                    
                    btnLeerMas.addEventListener('click', () => {
                        // Colapsar todos los otros textos expandidos
                        surveyData.forEach((_, otherIndex) => {
                            if (otherIndex !== index) {
                                const otherTruncado = document.getElementById(`texto-truncado-${otherIndex}`);
                                const otherCompleto = document.getElementById(`texto-completo-${otherIndex}`);
                                const otherBtn = document.getElementById(`btn-leer-mas-${otherIndex}`);
                                
                                if (otherTruncado && otherCompleto && otherBtn) {
                                    otherTruncado.style.display = 'inline';
                                    otherCompleto.style.display = 'none';
                                    otherBtn.textContent = 'Leer Más';
                                }
                            }
                        });
                        
                        // Toggle del texto actual
                        const textoTruncado = document.getElementById(`texto-truncado-${index}`);
                        const textoCompleto = document.getElementById(`texto-completo-${index}`);
                        const btn = document.getElementById(`btn-leer-mas-${index}`);
                        
                        if (textoTruncado.style.display !== 'none') {
                            // Expandir
                            textoTruncado.style.display = 'none';
                            textoCompleto.style.display = 'inline';
                            btn.textContent = 'Leer Menos';
                        } else {
                            // Colapsar
                            textoTruncado.style.display = 'inline';
                            textoCompleto.style.display = 'none';
                            btn.textContent = 'Leer Más';
                        }
                    });
                    
                    tdRespuesta.appendChild(btnLeerMas);
                }
                
                row.appendChild(tdRespuesta);
                
                // Botón eliminar
                const tdAcciones = document.createElement('td');
                const btnEliminar = document.createElement('button');
                btnEliminar.className = 'btn btn-danger btn-sm';
                btnEliminar.innerHTML = '<i class="icon ion-trash-a"></i>';
                btnEliminar.title = 'Eliminar encuesta';
                btnEliminar.style.fontSize = '14px';
                
                btnEliminar.addEventListener('click', () => {
                    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la encuesta ${index + 1}?`);
                    if (confirmDelete) {
                        const deleteUrl = `https://api.cheetah-research.ai/configuration/delete_survey_answer/${studyIdForSurveys}/${survey.id}`;
                        axios.post(deleteUrl, {}, {
                            headers: {
                                'Authorization': `Token ${token}`
                            }
                        }).then(() => {
                            alert('Encuesta eliminada exitosamente.');
                            surveyData.splice(index, 1);
                            updateSurveyTable();
                        }).catch(error => {
                            console.error('Error al eliminar la encuesta:', error);
                            alert('Error al eliminar la encuesta.');
                        });
                    }
                });
                
                tdAcciones.appendChild(btnEliminar);
                row.appendChild(tdAcciones);
                
                surveyTableBody.appendChild(row);
            });
        } else if (surveyNavContainer) {
            surveyNavContainer.style.display = 'none';
        }
    }

    if (surveyNavContainer) {
        surveyNavContainer.style.display = 'none';
    }

    if (studyIdForSurveys && token) {
        const getSurveysUrl = `https://api.cheetah-research.ai/configuration/get_surveys/${studyIdForSurveys}`;
        
        axios.post(getSurveysUrl, {}, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(response => {
            const surveys = response.data;
            if (surveys && typeof surveys === 'object' && !Array.isArray(surveys)) {
                surveyData = Object.keys(surveys).map(key => ({
                    id: key,
                    transcription: surveys[key]
                }));
            }
            
            updateSurveyTable();
        }).catch(error => {
            console.error('Error al obtener las transcripciones de las encuestas:', error);
            if (surveyTableBody) {
                surveyTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Error al cargar las encuestas.</td></tr>';
            }
            if (surveyNavContainer) {
                surveyNavContainer.style.display = 'block';
            }
        });
    }
}

//Colores
function setColorsFromAPI(studyId) {
    const url = 'https://api.cheetah-research.ai/configuration/info_study/' + studyId;
    return axios.get(url)
        .then(response => {
            const colors = {
                color1: response.data.primary_color,
                color2: response.data.secondary_color
            };

            applyColors(colors);

            return colors;
        })
        .catch(error => {
            console.error('Error capturando colores desde API:', error);
            return { color1: null, color2: null };
        });
}

function applyColors(colors) {//Colors es un array
    if (colors.color1) {
        document.documentElement.style.setProperty('--bs-CR-orange', colors.color1);

        document.documentElement.style.setProperty('--bs-CR-orange-2', brightColorVariant(colors.color1));
    }
    if (colors.color2) {
        document.documentElement.style.setProperty('--bs-CR-gray', colors.color2);

        document.documentElement.style.setProperty('--bs-CR-gray-dark', darkColorVariant(colors.color2));
    }
}
function darkColorVariant (color) {
    return adjustColor(color, -10);
}
function brightColorVariant (color) {
    return adjustColor(color, 10);
}
function adjustColor(color, percent) {//Funcion loca de chatsito
    const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16).slice(1).toUpperCase()}`;
}

window.onload = llenar;
