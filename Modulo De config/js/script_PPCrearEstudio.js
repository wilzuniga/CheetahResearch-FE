


function disableNavItems() {
    const navItems = [
        'CreacionDeEncuestadorLNK',
        'CreacionDeEncuestaLNK',
        'LanzarEncuestaLNK',
        'InformacionDeEstudioLNK',
        'VisualizacionDeResultadosLNK'
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
        'CreacionDeEncuestadorLNK',
        'InformacionDeEstudioLNK',
        ];

    navItems.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('disabled');
            element.classList.add('enabled');
        }
    });
}

function CE_DeactivateNavBy(){
    console.log('Verificando si se activan los botones');
    if(localStorage.getItem('selectedStudyId') != null){
        console.log('Study id:', localStorage.getItem('selectedStudyId'));
        enableNavItems();
    }else{
        disableNavItems();
    }
}

//FORMULARIO DE CREACION DE ESTUDIO
function createStudyForm() {
    const title = '<h2 style="color: var(--bs-emphasis-color);font-weight: bold;font-family: \'hedliner\', sans-serif;">Creación de Estudio</h2>';

    const tituloDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Titulo del Estudio</p>
            <input class="form-control" type="text" id="TituloDelEstudioTXT" name="Titulo" placeholder="Titulo" style="font-family: 'IBM Plex Sans'; border-radius: 3px">
        </div>`;

    const mercadoObjetivo = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Mercado Objetivo</p>
            <input class="form-control" type="text" id="MercadoObjetivoTXT" name="Mercado Objetivo" placeholder="Mercado Objetivo" style="font-family: 'IBM Plex Sans'; border-radius: 3px">
        </div>`;

    const objetivosDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Objetivos del Estudio</p>
            <input class="form-control" type="text" id="ObjetivosDelEstudioTXT" name="Objetivos del Estudio" placeholder="Objetivos generales del estudio, separados por comas (&quot;,&quot;)" style="font-family: 'IBM Plex Sans'; border-radius: 3px">
        </div>`;

    const promptDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Prompt del Estudio</p>
            <textarea class="form-control" id="PromptGeneralTXT" name="Prompt del Estudio" rows="6" placeholder="Ingresa el prompt general de la encuesta" style="font-family: 'IBM Plex Sans', sans-serif; box-shadow: inset 5px 5px 9px 1px #6d6d6d; color: #072934; border-radius: 3px"></textarea>
        </div>`;

    const submitButton = `
        <div style="width: 250px;font-family: 'hedliner', sans-serif;">
            <button class="btn btn-primary d-block w-100" id="CrearEstudioBtn" type="button" style="font-weight: bold;font-size: 20px;border-radius: 3px;font-family: 'hedliner', sans-serif;">Crear Estudio</button>
        </div>`;

    const form = `
        <form class="p-3 p-xl-4" method="post" style="font-family: 'hedliner', sans-serif;">
            ${tituloDelEstudio}
            ${mercadoObjetivo}
            ${objetivosDelEstudio}
            ${promptDelEstudio}
            ${submitButton}
        </form>`;

    return title + form;
}

function createFilledStudyForm() {

//crear u¿el formulario lleno sin el boton de crear estudio y en vez de que sea el prompt que sea el  resumen del estudio. Todo con el localstorage selectedStudyData. Solo lectura
    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;

    const title = '<h2 style="color: var(--bs-emphasis-color);font-weight: bold;font-family: \'hedliner\', sans-serif;">Resumen del Estudio</h2>';

    const tituloDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Titulo del Estudio</p>
            <input class="form-control" type="text" id="TituloDelEstudioTXT" name="Titulo" placeholder="Titulo" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.tituloDelEstudio}" >
        </div>`;

    const mercadoObjetivo = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Mercado Objetivo</p>
            <input class="form-control" type="text" id="MercadoObjetivoTXT" name="Mercado Objetivo" placeholder="Mercado Objetivo" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.mercadoObjetivo}" >
        </div>`;

    const objetivosDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Objetivos del Estudio</p>
            <input class="form-control" type="text" id="ObjetivosDelEstudioTXT" name="Objetivos del Estudio" placeholder="Objetivos generales del estudio, separados por comas (&quot;,&quot;)" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.objetivosDelEstudio}" >
        </div>`;

    const promptDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Prompt del Estudio</p>
            <textarea class="form-control" id="PromptGeneralTXT" name="Prompt del Estudio" rows="6" placeholder="Ingresa el prompt general de la encuesta" style="font-family: 'IBM Plex Sans', sans-serif; box-shadow: inset 5px 5px 9px 1px #6d6d6d; color: #072934; border-radius: 3px" >${selectedStudyData.Resumen}</textarea>
        </div>`;

    const submitButton = `
    <div style="width: 250px;font-family: 'hedliner', sans-serif;">
        <button class="btn btn-primary d-block w-100" id="UpdateEstudio" type="button" style="font-weight: bold;font-size: 20px;border-radius: 3px;font-family: 'hedliner', sans-serif;">Actualizar Estudio</button>
    </div>`;

    console.log(studyData);


    const form = `
        <form class="p-3 p-xl-4" method="post" style="font-family: 'hedliner', sans-serif;">
            ${tituloDelEstudio}
            ${mercadoObjetivo}
            ${objetivosDelEstudio}
            ${promptDelEstudio}
            ${submitButton}
        </form>`;

    return title + form;


}

function appendStudyForm() {
    const formContainer = document.getElementById('form-containerStudy');
    formContainer.innerHTML = createStudyForm();

    document.getElementById('CrearEstudioBtn').addEventListener('click', () => {
        const studyData = CaptureAndPostformdta();
        console.log(studyData);
        alert('Estudio creado exitosamente');
    });
}

function appendFilledStudyForm() {

    document.getElementById('UpdateEstudio').addEventListener('click', () => {
        const studyData = UpdateAndPostformdta();
        //actualizar el estudio salvado en localstorage
        localStorage.setItem('selectedStudyData', JSON.stringify(studyData));
        console.log(studyData);
        alert('Estudio actualizado exitosamente');
    });
}

function StudysaveToLocStrg() {
    localStorage.setItem('tituloDelEstudio', document.getElementById('TituloDelEstudioTXT').value);
    localStorage.setItem('mercadoObjetivo', document.getElementById('MercadoObjetivoTXT').value);
    localStorage.setItem('objetivosDelEstudio', document.getElementById('ObjetivosDelEstudioTXT').value);
    localStorage.setItem('promptDelEstudio', document.getElementById('PromptGeneralTXT').value);
}

function deleteFromLocStrg() {
    //verificar si se esta en PaginaPrincipal.html o CreacionDeEstudio.html
    if(window.location.href.includes('home')){
        console.log('Borrando datos del estudio');
        localStorage.removeItem('tituloDelEstudio');
        localStorage.removeItem('mercadoObjetivo');
        localStorage.removeItem('objetivosDelEstudio');
        localStorage.removeItem('promptDelEstudio');
        localStorage.removeItem('nombreEncuestador');
        localStorage.removeItem('tonoEncuestador');
        localStorage.removeItem('observacionesImportantes');
        localStorage.removeItem('saludoEncuestador');
        localStorage.removeItem('preguntas');

        localStorage.removeItem('selectedStudyId');
        localStorage.removeItem('selectedStudyData');
    }
}


function CaptureAndPostformdta() {
    const tituloDelEstudio = document.getElementById('TituloDelEstudioTXT').value;
    const mercadoObjetivo = document.getElementById('MercadoObjetivoTXT').value;
    const objetivosDelEstudio = document.getElementById('ObjetivosDelEstudioTXT').value;
    const promptDelEstudio = document.getElementById('PromptGeneralTXT').value;
    //StudysaveToLocStrg();
    //operacion POST, CON FORM DATA
    const url = 'https://api.cheetah-research.ai/configuration/createStudy/';
    const data = new FormData();
    data.append('title', tituloDelEstudio);
    data.append('target', mercadoObjetivo);
    data.append('objective', objetivosDelEstudio);
    data.append('prompt', promptDelEstudio);

    axios.post(url, data)
        .then(response => {
            alert('Estudio creado exitosamente');
            localStorage.setItem('selectedStudyId', response.data.study_id);
            localStorage.setItem('selectedStudyData', JSON.stringify(response.data));
            
            CE_DeactivateNavBy();

        }
        )
        .catch(error => {
            console.error('Error al crear el estudio:', error);
        });

    return {
        tituloDelEstudio,
        mercadoObjetivo,
        objetivosDelEstudio,
        promptDelEstudio
    };

}

function UpdateAndPostformdta() {
    const tituloDelEstudio = document.getElementById('TituloDelEstudioTXT').value;
    const mercadoObjetivo = document.getElementById('MercadoObjetivoTXT').value;
    const objetivosDelEstudio = document.getElementById('ObjetivosDelEstudioTXT').value;
    const promptDelEstudio = document.getElementById('PromptGeneralTXT').value;
    //StudysaveToLocStrg();
    //operacion POST, CON FORM DATA
    const url = 'https://api.cheetah-research.ai/configuration/updateStudy/' + localStorage.getItem('selectedStudyId');
    const data = new FormData();
    data.append('title', tituloDelEstudio);
    data.append('target', mercadoObjetivo);
    data.append('objective', objetivosDelEstudio);
    data.append('prompt', promptDelEstudio);

    axios.post(url, data)
        .then(response => {
            alert('Estudio actualizado exitosamente');
            localStorage.setItem('selectedStudyData', JSON.stringify(response.data));
        }
        )
        .catch(error => {
            console.error('Error al actualizar el estudio:', error);
        });

    return {
        tituloDelEstudio,
        mercadoObjetivo,
        objetivosDelEstudio,
        promptDelEstudio
    };

}

// Llama a la función cuando la página se carga completamente
window.addEventListener('DOMContentLoaded', (event) => {
    if(window.location.href.includes('https://www.cheetah-research.ai/configuration/study/')){
        if(localStorage.getItem('selectedStudyId') == null){
            console.log('Study id:', localStorage.getItem('selectedStudyId'));
            CE_DeactivateNavBy();
            appendStudyForm();
        }else{
            const formContainer = document.getElementById('form-containerStudy');
            formContainer.innerHTML = createFilledStudyForm();       
            appendFilledStudyForm();  
        }
    }else if(window.location.href.includes('home')){

        console.log('Study id:', localStorage.getItem('selectedStudyId'));

        loadStudies();
    }
});

function ApendStudies(){
    document.getElementById('TituloDelEstudioTXT').value = localStorage.getItem('tituloDelEstudio');
    document.getElementById('MercadoObjetivoTXT').value = localStorage.getItem('mercadoObjetivo');
    document.getElementById('ObjetivosDelEstudioTXT').value = localStorage.getItem('objetivosDelEstudio');
    document.getElementById('PromptGeneralTXT').value = localStorage.getItem('promptDelEstudio');
}

function loadStudies() {
    const url = 'https://api.cheetah-research.ai/configuration/get_studies/';

    axios.get(url)
        .then(response => {
            console.log(response.data);
            const studies = response.data;
            const listGroup = document.getElementById('listgrouptudies');
        

            studies.forEach(study => {
                const studyElement = createStudyElement(study);
                listGroup.appendChild(studyElement);
            });
        })
        .catch(error => {
            console.error('Error al cargar los estudios:', error);
        });
}

function createStudyElement(study) {
    console.log('Study');
    const a = document.createElement('a');
    a.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
    a.href = 'https://www.cheetah-research.ai/configuration/study/';
    a.style.fontFamily = "'hedliner', sans-serif";

    const div1 = document.createElement('div');
    div1.classList.add('d-flex', 'w-100', 'justify-content-between');

    const h5 = document.createElement('h5');
    h5.classList.add('mb-1');
    h5.style.fontFamily = "'hedliner', sans-serif";
    h5.textContent = study.title;

    const span = document.createElement('span');
    span.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
    span.style.fontFamily = "'hedliner', sans-serif";
    span.style.borderRadius = '2px';
    //COLOR DE LA ETIQUETA HEX C0601C
    span.style.color = '#FFFFFF';
    span.textContent = study.marketTarget;

    div1.appendChild(h5);
    div1.appendChild(span);
    a.appendChild(div1);

    const p = document.createElement('p');
    p.classList.add('mb-1');
    p.style.fontFamily = "'hedliner', sans-serif";
    p.textContent = study.studyObjectives;
    a.appendChild(p);

    const small = document.createElement('small');
    small.classList.add('text-muted');
    small.style.fontFamily = "'hedliner', sans-serif";
    // Formatear la fecha
    const studyDate = new Date(study.studyDate);
    const formattedDate = `${studyDate.toLocaleDateString()} ${studyDate.toLocaleTimeString()}`;
    small.textContent = formattedDate;
    a.appendChild(small);

    // Guardar el study id en localStorage y los datos en un json al hacer clic
    a.addEventListener('click', () => {
        localStorage.setItem('selectedStudyId', study._id);
        localStorage.setItem('selectedStudyData', JSON.stringify(study));
    });

    return a;
}
