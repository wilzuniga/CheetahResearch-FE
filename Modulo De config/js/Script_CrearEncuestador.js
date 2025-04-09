

//FORMULARIO DE CREACION DE ENCUESTADOR
// Función para crear el formulario del encuestador dinámicamente
function createSurveyerForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h2 style="color: var(--bs-emphasis-color); font-weight: bold; font-family: 'hedliner', sans-serif;">Crear Encuestador</h2>
        <form class="p-3 p-xl-4" method="post" style="font-family: 'hedliner', sans-serif;">
            <div class="mb-3">
            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Seleccionar Imagen</p>
            <input class="form-control" type="file" name="FileInput">
            </div>
            <div class="mb-3">
            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Nombre del Encuestador</p>
            <input class="form-control" type="text" id="NombreEncuestadorTXT" name="Nombre" placeholder="Nombre" style="font-family: 'IBM Plex Sans'">
            </div>
            <div class="mb-3">
            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Tono Encuestador</p>
            <input class="form-control" type="text" id="TonoEncuestadorTXT" name="Tono Encuestador" placeholder="Ingresa el tono en el cual hablará el encuestador" style="font-family: 'IBM Plex Sans'">
            </div>
            <div class="mb-3">
            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Observaciones importantes</p>
            <input class="form-control" type="text" id="ObservacionesImportantesTXT" name="Observaciones Importantes" placeholder="Observaciones importantes al Encuestador" style="font-family: 'IBM Plex Sans'">
            </div>
            <div class="mb-3">
            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Saludo</p>
            <textarea class="form-control" id="SaludoEncuestadorTXT" name="message" rows="6" placeholder="Ingresa el saludo del encuestador" style="font-family: 'IBM Plex Sans'"></textarea>
            </div>
            <div style="width: 250px;">
            <button class="btn btn-primary d-block w-100" id="CrearEncuestadorBtn" type="submit" style="font-weight: bold; font-size: 20px; border-radius: 10px;">Crear Encuestador</button>
            </div>
        </form>
        `;
    return formContainer;
}

function createSurveyerFormReadOnly() {
    const formContainer = document.createElement('div');
    url = 'https://api.cheetah-research.ai/configuration/getInterviewer/';

    axios.post(url, { study_id: localStorage.getItem('selectedStudyId') }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(response => {
        // console.log(response);
        const data = response.data;
        formContainer.innerHTML = `
                    <h2 style="color: var(--bs-emphasis-color); font-weight: bold; font-family: 'hedliner', sans-serif;">Encuestador</h2>
                    <form class="p-3 p-xl-4" method="post" style="font-family: 'hedliner', sans-serif;">
                        <div class="mb-3">
                            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Imagen</p>
                            <img src="${data.interviewerProfilePicture}" alt="Imagen del encuestador" style="width: 100px; height: 100px; border-radius: 50%;">
                        </div>
                        <div class="mb-3">
                            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Nombre del Encuestador</p>
                            <input class="form-control" type="text" id="NombreEncuestadorTXT" name="Nombre" placeholder="Nombre" value="${data.interviewerName}" style="font-family: 'IBM Plex Sans'">
                        </div>
                        <div class="mb-3">
                            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Tono Encuestador</p>
                            <input class="form-control" type="text" id="TonoEncuestadorTXT" name="Tono Encuestador" placeholder="Ingresa el tono en el cual hablará el encuestador" value="${data.interviewerTone}" style="font-family: 'IBM Plex Sans'">
                        </div>
                        <div class="mb-3">
                            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Observaciones importantes</p>
                            <input class="form-control" type="text" id="ObservacionesImportantesTXT" name="Observaciones Importantes" placeholder="Observaciones importantes al Encuestador" value="${data.importantObservation}" style="font-family: 'IBM Plex Sans'">
                        </div>
                        <div class="mb-3">
                            <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'hedliner', sans-serif;">Saludo</p>
                            <textarea class="form-control" id="SaludoEncuestadorTXT" name="message" rows="6" placeholder="Ingresa el saludo del encuestador" style="font-family: 'IBM Plex Sans'">${data.interviewerGreeting}</textarea>
                        </div>
                        <div style="width: 250px;">
                            <button class="btn btn-primary d-block w-100" id="ActualizarEncuestadorBtn" type="button" style="font-weight: bold; font-size: 20px; border-radius: 10px;">Actualizar Encuestador</button>
                        </div>
                    </form>
                `;

        document.getElementById('ActualizarEncuestadorBtn').addEventListener('click', (event) => {
            // console.log('Actualizando encuestador');
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
    
    const nombreEncuestador = document.getElementById('NombreEncuestadorTXT').value;
    const tonoEncuestador = document.getElementById('TonoEncuestadorTXT').value;
    const saludoEncuestador = document.getElementById('SaludoEncuestadorTXT').value;
    const fileInput = data.interviewerProfilePicture;
    const observacionesImportantes = document.getElementById('ObservacionesImportantesTXT').value;

    const url = 'https://api.cheetah-research.ai/configuration/updateInterviewer/';

    const data0 = new FormData();
    data0.append('interviewerName', nombreEncuestador);
    data0.append('interviewerTone', tonoEncuestador);
    data0.append('interviewerGreeting', saludoEncuestador);
    data0.append('importantObservation', observacionesImportantes);
    data0.append('_id', localStorage.getItem('selectedStudyId'));

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
        alert('Encuestador actualizado  exitosamente');

    })
    .catch(error => {
        console.error(error);
    });

    // Guardar en localStorage
    localStorage.setItem('nombreEncuestador', nombreEncuestador);
    localStorage.setItem('tonoEncuestador', tonoEncuestador);
    localStorage.setItem('observacionesImportantes', observacionesImportantes);
    localStorage.setItem('saludoEncuestador', saludoEncuestador);

    
    CSrvyr_DeactivateNavBy();


}



// Función para agregar el formulario al contenedor
async function appendSurveyerForm() {
    const url = 'https://api.cheetah-research.ai/configuration/getInterviewer/';

    try {
        const response = await axios.post(url, { study_id: localStorage.getItem('selectedStudyId') }, {
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
    data.append('study_id', localStorage.getItem('selectedStudyId'));

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
        alert('Encuestador creado exitosamente');
    })
    .catch(error => {
        console.error(error);
        alert('Error al crear el encuestador');
    });

    // Guardar en localStorage
    localStorage.setItem('nombreEncuestador', nombreEncuestador);
    localStorage.setItem('tonoEncuestador', tonoEncuestador);
    localStorage.setItem('observacionesImportantes', observacionesImportantes);
    localStorage.setItem('saludoEncuestador', saludoEncuestador);

    //hacer el formulario solo lectura y que cada que se cargue la pagina regresen los datos
    document.getElementById('NombreEncuestadorTXT').readOnly = true;
    document.getElementById('TonoEncuestadorTXT').readOnly = true;
    document.getElementById('ObservacionesImportantesTXT').readOnly = true;
    document.getElementById('SaludoEncuestadorTXT').readOnly = true;
    document.getElementById('CrearEncuestadorBtn').disabled = true;
    document.querySelector('input[type="file"]').disabled = true;

    CSrvyr_DeactivateNavBy();

    //log
    // console.log(localStorage.getItem('nombreEncuestador'));
    // console.log(localStorage.getItem('tonoEncuestador'));
    // console.log(localStorage.getItem('observacionesImportantes'));
    // console.log(localStorage.getItem('saludoEncuestador'));
    // console.log('Encuestador creado exitosamente');
}


window.onload = () => {
    CSrvyr_DeactivateNavBy();
    appendSurveyerForm();  
}


function disableNavItems() {

}

function enableNavItems() {

}

function CSrvyr_DeactivateNavBy(){
    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;


    // console.log('Verificando si se activan los botones');
    if(localStorage.getItem('nombreEncuestador') != null){
        enableNavItems();
        // console.log('Activando botones');
    }else{
        disableNavItems();
        // console.log('Desactivando botones');
    }
}

