

//FORMULARIO DE CREACION DE ENCUESTADOR
// Función para crear el formulario del encuestador dinámicamente
function createSurveyerForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h2 style="color: var(--bs-emphasis-color); font-weight: bold; font-family: 'IBM Plex Sans', sans-serif;">Crear Encuestador</h2>
        <form class="p-3 p-xl-4" method="post" style="font-family: 'IBM Plex Sans', sans-serif;">
            <div class="mb-3">
                <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'IBM Plex Sans', sans-serif;">Seleccionar Imagen</p>
                <input class="form-control" type="file" name="FileInput">
            </div>
            <div class="mb-3">
                <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'IBM Plex Sans', sans-serif;">Nombre del Encuestador</p>
                <input class="form-control" type="text" id="NombreEncuestadorTXT" name="Nombre" placeholder="Nombre">
            </div>
            <div class="mb-3">
                <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'IBM Plex Sans', sans-serif;">Tono Encuestador</p>
                <input class="form-control" type="text" id="TonoEncuestadorTXT" name="Tono Encuestador" placeholder="Ingresa el tono en el cual hablará el encuestador">
            </div>
            <div class="mb-3">
                <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'IBM Plex Sans', sans-serif;">Observaciones importantes</p>
                <input class="form-control" type="text" id="ObservacionesImportantesTXT" name="Observaciones Importantes" placeholder="Observaciones importantes al Encuestador">
            </div>
            <div class="mb-3">
                <p style="font-size: 20px; color: var(--bs-emphasis-color); margin-bottom: 5px; font-family: 'IBM Plex Sans', sans-serif;">Saludo</p>
                <textarea class="form-control" id="SaludoEncuestadorTXT" name="message" rows="6" placeholder="Ingresa el saludo del encuestador"></textarea>
            </div>
            <div style="width: 250px;">
                <button class="btn btn-primary d-block w-100" id="CrearEncuestadorBtn" type="submit" style="font-weight: bold; font-size: 20px; border-radius: 10px;">Crear Encuestador</button>
            </div>
        </form>
    `;
    return formContainer;
}

// Función para agregar el formulario al contenedor
function appendSurveyerForm() {
    const formContainer = document.getElementById('form-containerSurveyer');
    const surveyerForm = createSurveyerForm();
    formContainer.appendChild(surveyerForm);
}


// Función para capturar y guardar datos del formulario del encuestador
function captureSurveyerFormData() {
    const nombreEncuestador = document.getElementById('NombreEncuestadorTXT').value;
    const tonoEncuestador = document.getElementById('TonoEncuestadorTXT').value;
    const observacionesImportantes = document.getElementById('ObservacionesImportantesTXT').value;
    const saludoEncuestador = document.getElementById('SaludoEncuestadorTXT').value;
    const fileInput = document.querySelector('input[type="file"]');

    //operacion POST, CON FORM DATa y hacer que los componentes ya no sean modificables
    const url = 'http://34.201.10.223:3000/addInterviewer/';
    const data = new FormData();
    data.append('interviewerName', nombreEncuestador);
    data.append('interviewerProfilePicture', fileInput.files[0]);
    data.append('interviewerTone', tonoEncuestador);
    data.append('interviewerGreeting', saludoEncuestador);
    data.append('importantObservation', observacionesImportantes);
    data.append('study_id', localStorage.getItem('selectedStudyId'));

    axios.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
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
    console.log(localStorage.getItem('nombreEncuestador'));
    console.log(localStorage.getItem('tonoEncuestador'));
    console.log(localStorage.getItem('observacionesImportantes'));
    console.log(localStorage.getItem('saludoEncuestador'));
    console.log('Encuestador creado exitosamente');
}


window.onload = () => {
    CSrvyr_DeactivateNavBy();
    appendSurveyerForm();

    document.getElementById('CrearEncuestadorBtn').addEventListener('click', (event) => {
        event.preventDefault();
        captureSurveyerFormData();
    });
}


function disableNavItems() {
    const navItems = [
        'CreacionDeEncuestaLNK',
        'LanzarEncuestaLNK',
        'VisualizacionDeResultadosLNK',
        ];

    navItems.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('disabled');
        }
    });
}

function enableNavItems() {
    const navItems = [
        'CreacionDeEncuestaLNK',
        ];

    navItems.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('disabled');
            element.classList.add('enabled');
        }
    });
}

function CSrvyr_DeactivateNavBy(){
    console.log('Verificando si se activan los botones');
    if(localStorage.getItem('nombreEncuestador') != null){
        enableNavItems();
        console.log('Activando botones');
    }else{
        disableNavItems();
        console.log('Desactivando botones');
    }
}

