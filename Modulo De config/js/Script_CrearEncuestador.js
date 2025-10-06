//FORMULARIO DE CREACION DE ENCUESTADOR
// Función para crear el formulario del encuestador dinámicamente
function createSurveyerForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <div style="font-family: 'hedliner', sans-serif; padding: 20px;">
            <div class="form-section">
                <h2 class="section-title" style="color: var(--bs-emphasis-color); font-weight: bold; font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.createTitle">Crear Encuestador</h2>
            </div>
            
            <div class="form-section">
                <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.selectImg">Seleccionar Imagen</p>
                <input class="form-control" type="file" name="FileInput" accept="image/*">
                <small class="form-text text-muted" style="margin-top: 8px; display: block;">Selecciona una imagen para el perfil del encuestador</small>
            </div>
            
            <div class="form-section">
                <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hInterviewerName">Nombre del Encuestador</p>
                <input class="form-control" type="text" id="NombreEncuestadorTXT" name="Nombre" data-i18n-placeholder="CrearEncuestador.inInterviewerName" style="font-family: 'IBM Plex Sans';" placeholder="Ingresa el nombre del encuestador">
            </div>
            
            <div class="form-section">
                <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hTone">Tono del encuestador y sugerencias relevantes</p>
                <textarea class="form-control" id="TonoEncuestadorTXT" name="Tono Encuestador" rows="4" data-i18n-placeholder="CrearEncuestador.inTone" style="font-family: 'IBM Plex Sans';" placeholder="Describe el tono y estilo de comunicación del encuestador"></textarea>
            </div>
            
            <div class="form-section">
                <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hObservations">Observaciones importantes</p>
                <textarea class="form-control" id="ObservacionesImportantesTXT" name="Observaciones Importantes" rows="4" data-i18n-placeholder="CrearEncuestador.inObservations" style="font-family: 'IBM Plex Sans';" placeholder="Agrega observaciones importantes para el encuestador"></textarea>
            </div>
            
            <div class="form-section">
                <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hGreeting">Saludo</p>
                <textarea class="form-control" id="SaludoEncuestadorTXT" name="message" rows="6" data-i18n-placeholder="CrearEncuestador.inGreeting" style="font-family: 'IBM Plex Sans';" placeholder="Escribe el saludo inicial que usará el encuestador"></textarea>
            </div>
            
            <div class="form-section" style="text-align: center;">
                <button class="btn btn-primary d-block" id="CrearEncuestadorBtn" type="submit" style="font-weight: bold; font-size: 16px; font-family: 'hedliner', sans-serif; min-width: 200px;" data-i18n="CrearEncuestador.btCreate">
                    <i class="fas fa-user-plus" style="margin-right: 8px;"></i>
                    Crear Encuestador
                </button>
            </div>
        </div>
        `;
    return formContainer;
}

function createSurveyerFormReadOnly() {
    const formContainer = document.createElement('div');
    url = 'https://api.cheetah-research.ai/configuration/getInterviewer/';

    axios.post(url, { study_id: sessionStorage.getItem('selectedStudyId') }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(response => {
        const data = response.data;
        formContainer.innerHTML = `
            <div style="font-family: 'hedliner', sans-serif; padding: 20px;">
                <div class="form-section">
                    <h2 class="section-title" style="color: var(--bs-emphasis-color); font-weight: bold; font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.title">Encuestador</h2>
                </div>
                
                <div class="form-section">
                    <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hImg">Imagen del Encuestador</p>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${data.interviewerProfilePicture}" alt="Imagen del encuestador" class="interviewer-image">
                    </div>
                    <input class="form-control" type="file" name="FileInput" id="FileInputEdit" accept="image/*" style="margin-top: 10px;">
                    <small class="form-text text-muted" style="margin-top: 8px; display: block;" data-i18n="CrearEncuestador.changeImageHint">Selecciona una nueva imagen para cambiar la actual (opcional)</small>
                </div>
                
                <div class="form-section">
                    <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hInterviewerName">Nombre del Encuestador</p>
                    <input class="form-control" type="text" id="NombreEncuestadorTXT" name="Nombre" data-i18n-placeholder="CrearEncuestador.inInterviewerName" value="${data.interviewerName}" style="font-family: 'IBM Plex Sans';">
                </div>
                
                <div class="form-section">
                    <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hTone">Tono del encuestador y sugerencias relevantes</p>
                    <textarea class="form-control" id="TonoEncuestadorTXT" name="Tono Encuestador" rows="4" data-i18n-placeholder="CrearEncuestador.inTone" style="font-family: 'IBM Plex Sans';">${data.interviewerTone}</textarea>
                </div>
                
                <div class="form-section">
                    <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hObservations">Observaciones importantes</p>
                    <textarea class="form-control" id="ObservacionesImportantesTXT" name="Observaciones Importantes" rows="4" data-i18n-placeholder="CrearEncuestador.inObservations" style="font-family: 'IBM Plex Sans';">${data.importantObservation}</textarea>
                </div>
                
                <div class="form-section">
                    <p style="font-family: 'hedliner', sans-serif;" data-i18n="CrearEncuestador.hGreeting">Saludo</p>
                    <textarea class="form-control" id="SaludoEncuestadorTXT" name="message" rows="6" data-i18n-placeholder="CrearEncuestador.inGreeting" style="font-family: 'IBM Plex Sans';">${data.interviewerGreeting}</textarea>
                </div>
                
                <div class="form-section" style="text-align: center;">
                    <button class="btn btn-primary d-block" id="ActualizarEncuestadorBtn" type="button" style="font-weight: bold; font-size: 16px; font-family: 'hedliner', sans-serif; min-width: 200px;" data-i18n="CrearEncuestador.btUpdate">
                        <i class="fas fa-sync-alt" style="margin-right: 8px;"></i>
                        Actualizar Encuestador
                    </button>
                </div>
            </div>
        `;

        document.getElementById('ActualizarEncuestadorBtn').addEventListener('click', (event) => {
            event.preventDefault();
            updateSurveyerFormData(data);
        });
    })
    .catch(error => {
        console.error(error);
    });

    enableNavItems();

    return formContainer;
}

function updateSurveyerFormData(data) {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    const nombreEncuestador = document.getElementById('NombreEncuestadorTXT').value;
    const tonoEncuestador = document.getElementById('TonoEncuestadorTXT').value;
    const saludoEncuestador = document.getElementById('SaludoEncuestadorTXT').value;
    const fileInputEdit = document.getElementById('FileInputEdit');
    const observacionesImportantes = document.getElementById('ObservacionesImportantesTXT').value;

    const url = 'https://api.cheetah-research.ai/configuration/updateInterviewer/';

    const data0 = new FormData();
    data0.append('interviewerName', nombreEncuestador);
    data0.append('interviewerTone', tonoEncuestador);
    data0.append('interviewerGreeting', saludoEncuestador);
    data0.append('importantObservation', observacionesImportantes);
    data0.append('_id', sessionStorage.getItem('selectedStudyId'));
    
    // Agregar la nueva imagen si se seleccionó una
    if (fileInputEdit && fileInputEdit.files && fileInputEdit.files[0]) {
        data0.append('interviewerProfilePicture', fileInputEdit.files[0]);
    }

    for (let pair of data0.entries()) {
        // console.log(pair[0]+ ': ' + pair[1]);
    }

    axios.post(url, data0, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {

        // console.log(response);
        //Alert coso guardado
        alert(getNestedTranslation(translations[lang], 'CrearEncuestador.wUpdated'));

    })
    .catch(error => {
        console.error(error);
    });

    // Guardar en sessionStorage
    sessionStorage.setItem('nombreEncuestador', nombreEncuestador);
    sessionStorage.setItem('tonoEncuestador', tonoEncuestador);
    sessionStorage.setItem('observacionesImportantes', observacionesImportantes);
    sessionStorage.setItem('saludoEncuestador', saludoEncuestador);

    
    CSrvyr_DeactivateNavBy();


}



// Función para agregar el formulario al contenedor
async function appendSurveyerForm() {
    const url = 'https://api.cheetah-research.ai/configuration/getInterviewer/';
    const study_id = sessionStorage.getItem('selectedStudyId');
    try {
        const response = await axios.post(url, { study_id: sessionStorage.getItem('selectedStudyId') }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        const data = response.data;
        const formContainer = document.getElementById('form-containerSurveyer');

        if (data.interviewerName != null) {
            const surveyerForm = createSurveyerFormReadOnly();
            formContainer.appendChild(surveyerForm);
        } else {
            const surveyerForm = createSurveyerForm();
            formContainer.appendChild(surveyerForm);
            document.getElementById('CrearEncuestadorBtn').addEventListener('click', (event) => {
                event.preventDefault();
                captureSurveyerFormData();
            });
        }
        setColorsFromAPI(study_id);//Setea colores
    } catch (error) {
        const formContainer = document.getElementById('form-containerSurveyer');
        const surveyerForm = createSurveyerForm();
        formContainer.appendChild(surveyerForm);
        document.getElementById('CrearEncuestadorBtn').addEventListener('click', (event) => {
            event.preventDefault();
            captureSurveyerFormData();
        });
        }
}



// Función para capturar y guardar datos del formulario del encuestador
function captureSurveyerFormData() {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    const nombreEncuestador = document.getElementById('NombreEncuestadorTXT').value;
    const tonoEncuestador = document.getElementById('TonoEncuestadorTXT').value;
    const observacionesImportantes = document.getElementById('ObservacionesImportantesTXT').value;
    const saludoEncuestador = document.getElementById('SaludoEncuestadorTXT').value;
    const fileInput = document.querySelector('input[type="file"]');

    //operacion POST, CON FORM DATa y hacer que los componentes ya no sean modificables
    const url = 'https://api.cheetah-research.ai/configuration/addInterviewer/';
    
    const data = new FormData();
    data.append('interviewerName', nombreEncuestador);
    data.append('interviewerProfilePicture', fileInput.files[0]);
    data.append('interviewerTone', tonoEncuestador);
    data.append('interviewerGreeting', saludoEncuestador);
    data.append('importantObservation', observacionesImportantes);
    data.append('study_id', sessionStorage.getItem('selectedStudyId'));

    for (let pair of data.entries()) {
        // console.log(pair[0]+ ': ' + pair[1]);
    }


    axios.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        // console.log(response);
        //enviar mensaje para confirmar que se creo el encuestador
        alert(getNestedTranslation(translations[lang], 'CrearEncuestador.wCreated'));
    })
    .catch(error => {
        console.error(error);
        alert(getNestedTranslation(translations[lang], 'CrearEncuestador.wCreate'));
    });

    // Guardar en sessionStorage
    sessionStorage.setItem('nombreEncuestador', nombreEncuestador);
    sessionStorage.setItem('tonoEncuestador', tonoEncuestador);
    sessionStorage.setItem('observacionesImportantes', observacionesImportantes);
    sessionStorage.setItem('saludoEncuestador', saludoEncuestador);

    //hacer el formulario solo lectura y que cada que se cargue la pagina regresen los datos
    document.getElementById('NombreEncuestadorTXT').readOnly = true;
    document.getElementById('TonoEncuestadorTXT').readOnly = true;
    document.getElementById('ObservacionesImportantesTXT').readOnly = true;
    document.getElementById('SaludoEncuestadorTXT').readOnly = true;
    document.getElementById('CrearEncuestadorBtn').disabled = true;
    document.querySelector('input[type="file"]').disabled = true;

    CSrvyr_DeactivateNavBy();

    //log
    // console.log(sessionStorage.getItem('nombreEncuestador'));
    // console.log(sessionStorage.getItem('tonoEncuestador'));
    // console.log(sessionStorage.getItem('observacionesImportantes'));
    // console.log(sessionStorage.getItem('saludoEncuestador'));
    // console.log('Encuestador creado exitosamente');
}


window.onload = () => {
    //Idioma
    const lang = sessionStorage.getItem('language') || 'es';
    setLanguage(lang);
    
    CSrvyr_DeactivateNavBy();
    appendSurveyerForm();
}


function disableNavItems() {

}

function enableNavItems() {

}

function CSrvyr_DeactivateNavBy(){
    const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;


    // console.log('Verificando si se activan los botones');
    if(sessionStorage.getItem('nombreEncuestador') != null){
        enableNavItems();
        // console.log('Activando botones');
    }else{
        disableNavItems();
        // console.log('Desactivando botones');
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