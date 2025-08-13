function disableNavItems() {

}

function enableNavItems() {

}

function CE_DeactivateNavBy(){
    // console.log('Verificando si se activan los botones');
    if(sessionStorage.getItem('selectedStudyId') != null){
        // console.log('Study id:', sessionStorage.getItem('selectedStudyId'));
        enableNavItems();
    }else{
        disableNavItems();
    }
}

//FORMULARIO DE CREACION DE ESTUDIO
function createStudyForm() {
    const title = '<h2 style="color: var(--bs-emphasis-color);font-weight: bold;font-family: \'hedliner\', sans-serif;" data-i18n="CreacionDeEstudio.title">Creación de Estudio</h2>';

    const tituloDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hStudyTitle">Titulo del Estudio</p>
            <input class="form-control" type="text" id="TituloDelEstudioTXT" name="Titulo" data-i18n-placeholder="CreacionDeEstudio.inStudyTitle" style="font-family: 'IBM Plex Sans'; border-radius : 13px">
        </div>`
    ;

    const mercadoObjetivo = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hTargetAudience">Mercado Objetivo</p>
            <input class="form-control" type="text" id="MercadoObjetivoTXT" name="Mercado Objetivo" data-i18n-placeholder="CreacionDeEstudio.inTargetAudience" style="font-family: 'IBM Plex Sans'; border-radius : 13px">
        </div>`
    ;

    const objetivosDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hStudyObjectives">Objetivos del Estudio</p>
            <input class="form-control" type="text" id="ObjetivosDelEstudioTXT" name="Objetivos del Estudio" data-i18n-placeholder="CreacionDeEstudio.inStudyObjectives" style="font-family: 'IBM Plex Sans'; border-radius : 13px">
        </div>`
    ;

    const promptDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hPrompt">Prompt del Estudio</p>
            <textarea class="form-control" id="PromptGeneralTXT" name="Prompt del Estudio" rows="6" data-i18n-placeholder="CreacionDeEstudio.inPrompt" style="font-family: 'IBM Plex Sans', sans-serif;  color: #072934; border-radius : 13px"></textarea>
        </div>`
    ;

    const colorInput1 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.color1">Color Principal del Estudio</p>
            <input type="color" class="form-control" id="colorInput1" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius : 13px" value="#C0601C">
        </div>`
    ;

    const colorInput2 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.color2">Color Secundario del Estudio</p>
            <input type="color" class="form-control" id="colorInput2" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius : 13px" value="#212121">
        </div>`
    ;

    const setDefaultColorButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="setDefaultColorButton" type="button" style="font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.btDefaultColors">Colores Default</button>
        </div>`
    ;
    const saveColorsButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="saveColorsButton" type="button" style="font-family: 'hedliner', sans-serif;  background-color:var(--bs-CR-orange-2);" data-i18n="CreacionDeEstudio.btSaveColors">Guardar Colores</button>
        </div>`
    ;
    const colorButtonsContainer = `
        <div class="d-flex justify-content-between mb-3" style="font-family: 'hedliner', sans-serif;">
            ${saveColorsButton}
            ${setDefaultColorButton}
        </div>`
    ;//Aparecen horizontalmente

    const submitButton = `
        <div style="width: 250px;font-family: 'hedliner', sans-serif;">
            <button class="btn btn-primary d-block w-100" id="CrearEstudioBtn" type="button" style="font-weight: bold;font-size: 20px;border-radius : 13px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.btCreate">Crear Estudio</button>
        </div>`
    ;

    const form = `
        <form class="p-3 p-xl-4" method="post" style="font-family: 'hedliner', sans-serif;">
            ${tituloDelEstudio}
            ${mercadoObjetivo}
            ${objetivosDelEstudio}
            ${promptDelEstudio}
            ${colorInput1}
            ${colorInput2}
            ${colorButtonsContainer}
            ${submitButton}
        </form>`;

    return title + form;
}

function createFilledStudyForm() {

    //crear u¿el formulario lleno sin el boton de crear estudio y en vez de que sea el prompt que sea el  resumen del estudio. Todo con el sessionStorage selectedStudyData. Solo lectura
    const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
        color1DelEstudio: studyData.primary_color,
        color2DelEstudio: studyData.secondary_color
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;

    const title = `<h2 style="color: var(--bs-emphasis-color);font-weight: bold;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.summaryTitle">Resumen del Estudio</h2>`;

    const tituloDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hStudyTitle">Titulo del Estudio</p>
            <input class="form-control" type="text" id="TituloDelEstudioTXT" name="Titulo" data-i18n-placeholder="CreacionDeEstudio.inStudyTitle" style="font-family: 'IBM Plex Sans'; border-radius : 13px" value="${selectedStudyData.tituloDelEstudio}">
        </div>`
    ;

    const mercadoObjetivo = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hTargetAudience">Mercado Objetivo</p>
            <input class="form-control" type="text" id="MercadoObjetivoTXT" name="Mercado Objetivo" data-i18n-placeholder="CreacionDeEstudio.inTargetAudience" style="font-family: 'IBM Plex Sans'; border-radius : 13px" value="${selectedStudyData.mercadoObjetivo}">
        </div>`
    ;

    const objetivosDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hStudyObjectives">Objetivos del Estudio</p>
            <input class="form-control" type="text" id="ObjetivosDelEstudioTXT" name="Objetivos del Estudio" data-i18n-placeholder="CreacionDeEstudio.inStudyObjectives" style="font-family: 'IBM Plex Sans'; border-radius : 13px" value="${selectedStudyData.objetivosDelEstudio}">
        </div>`
    ;

    const promptDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.hPrompt">Prompt del Estudio</p>
            <textarea class="form-control" id="PromptGeneralTXT" name="Prompt del Estudio" rows="6" data-i18n-placeholder="CreacionDeEstudio.inPrompt" style="font-family: 'IBM Plex Sans', sans-serif;  color: #072934; border-radius : 13px" >${selectedStudyData.Resumen}</textarea>
        </div>`
    ;

    const colorInput1 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.color1">Color Principal del Estudio</p>
            <input type="color" class="form-control" id="colorInput1" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius : 13px" value="${selectedStudyData.color1DelEstudio}">
        </div>`
    ;

    const colorInput2 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.color2">Color Secundario del Estudio</p>
            <input type="color" class="form-control" id="colorInput2" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius : 13px" value="${selectedStudyData.color2DelEstudio}">
        </div>`
    ;

    const setDefaultColorButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="setDefaultColorButton" type="button" style="font-family: 'hedliner', sans-serif;" data-i18n="CreacionDeEstudio.btDefaultColors">Colores Default</button>
        </div>`
    ;
    const saveColorsButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="saveColorsButton" type="button" style="font-family: 'hedliner', sans-serif; color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);" data-i18n="CreacionDeEstudio.btSaveColors">Guardar Colores</button>
        </div>`
    ;
    const colorButtonsContainer = `
        <div class="d-flex justify-content-between mb-3" style="font-family: 'hedliner', sans-serif;">
            ${saveColorsButton}
            ${setDefaultColorButton}
        </div>`
    ;//Aparecen horizontalmente

    const submitButton = `
        <div style="width: 250px;font-family: 'hedliner', sans-serif;">
            <button class="btn btn-primary d-block w-100" id="UpdateEstudio" type="button" style="font-weight: bold;font-size: 20px;border-radius : 13px;font-family: 'hedliner', sans-serif; color: var(--bs-CR-gray);background-color: var(--bs-CR-orange);" data-i18n="CreacionDeEstudio.btUpdate">Actualizar Estudio</button>
        </div>`
    ;

    // console.log(studyData);


    const form = `
        <form class="p-3 p-xl-4" method="post" style="font-family: 'hedliner', sans-serif;">
            ${tituloDelEstudio}
            ${mercadoObjetivo}
            ${objetivosDelEstudio}
            ${promptDelEstudio}
            ${colorInput1}
            ${colorInput2}
            ${colorButtonsContainer}
            ${submitButton}
        </form>`
    ;
    
    return title + form;
}

function appendStudyForm() {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    const formContainer = document.getElementById('form-containerStudy');
    formContainer.innerHTML = createStudyForm();

    document.getElementById('CrearEstudioBtn').addEventListener('click', () => {
        const studyData = CaptureAndPostformdta();
        // console.log(studyData);
        alert(getNestedTranslation(translations[lang], 'CreacionDeEstudio.wStudyCreated'));
        //guardar en localsotrage el estudio creado
        sessionStorage.setItem('selectedStudyData', JSON.stringify(studyData));
    });
}

function appendFilledStudyForm() {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma

    document.getElementById('UpdateEstudio').addEventListener('click', () => {
        const studyData = UpdateAndPostformdta();
        //actualizar el estudio salvado en sessionStorage
        sessionStorage.setItem('selectedStudyData', JSON.stringify(studyData));
        // console.log(studyData);
        alert(getNestedTranslation(translations[lang], 'CreacionDeEstudio.wStudyUpdated'));
    });

    //Color Change: Colores Default
    document.getElementById('setDefaultColorButton').addEventListener('click', () => {
        document.getElementById('colorInput1').value = '#C0601C';
        document.getElementById('colorInput2').value = '#212121';
    });

    //Color Change: Guardar Colores
    document.getElementById('saveColorsButton').addEventListener('click', saveColorsToStudy);
}

function StudysaveToLocStrg() {//Funcion de prueba
    sessionStorage.setItem('tituloDelEstudio', document.getElementById('TituloDelEstudioTXT').value);
    sessionStorage.setItem('mercadoObjetivo', document.getElementById('MercadoObjetivoTXT').value);
    sessionStorage.setItem('objetivosDelEstudio', document.getElementById('ObjetivosDelEstudioTXT').value);
    sessionStorage.setItem('promptDelEstudio', document.getElementById('PromptGeneralTXT').value);
    sessionStorage.setItem('color1DelEstudio', document.getElementById('colorInput1').value);
    sessionStorage.setItem('color2DelEstudio', document.getElementById('colorInput2').value);
}

function deleteFromLocStrg() {
    //verificar si se esta en PaginaPrincipal.html o CreacionDeEstudio.html
    if(window.location.href.includes('home')){
        // console.log('Borrando datos del estudio');
        sessionStorage.removeItem('tituloDelEstudio');
        sessionStorage.removeItem('mercadoObjetivo');
        sessionStorage.removeItem('objetivosDelEstudio');
        sessionStorage.removeItem('promptDelEstudio');
        sessionStorage.removeItem('color1DelEstudio');
        sessionStorage.removeItem('color2DelEstudio');
        sessionStorage.removeItem('nombreEncuestador');
        sessionStorage.removeItem('tonoEncuestador');
        sessionStorage.removeItem('observacionesImportantes');
        sessionStorage.removeItem('saludoEncuestador');
        sessionStorage.removeItem('preguntas');

        sessionStorage.removeItem('selectedStudyId');
        sessionStorage.removeItem('selectedStudyData');
    }
}

function CaptureAndPostformdta() {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    const tituloDelEstudio = document.getElementById('TituloDelEstudioTXT').value;
    const mercadoObjetivo = document.getElementById('MercadoObjetivoTXT').value;
    const objetivosDelEstudio = document.getElementById('ObjetivosDelEstudioTXT').value;
    const promptDelEstudio = document.getElementById('PromptGeneralTXT').value;
    
    const token = sessionStorage.getItem('token');
    const url = 'https://api.cheetah-research.ai/configuration/createStudy/';
    
    // Armamos el body como JSON
    const data = {
        title: tituloDelEstudio,
        target: mercadoObjetivo,
        objective: objetivosDelEstudio,
        prompt: promptDelEstudio
    };
    
    // Hacemos el POST con headers explícitos
    axios.post(url, data, {
        headers: {
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        alert(getNestedTranslation(translations[lang], 'CreacionDeEstudio.wStudyCreated'));
        sessionStorage.setItem('selectedStudyId', response.data.study_id);
        sessionStorage.setItem('selectedStudyData', JSON.stringify(response.data));
    
        CE_DeactivateNavBy();
    })
    .catch(error => {
        console.error('Error al crear el estudio:', error);
    });
    
    return {
        tituloDelEstudio,
        mercadoObjetivo,
        objetivosDelEstudio,
        promptDelEstudio,
    };
    
}

function UpdateAndPostformdta() {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    const tituloDelEstudio = document.getElementById('TituloDelEstudioTXT').value;
    const mercadoObjetivo = document.getElementById('MercadoObjetivoTXT').value;
    const objetivosDelEstudio = document.getElementById('ObjetivosDelEstudioTXT').value;
    const promptDelEstudio = document.getElementById('PromptGeneralTXT').value;
    
    const token = sessionStorage.getItem('token');
    const studyId = sessionStorage.getItem('selectedStudyId');
    const url = `https://api.cheetah-research.ai/configuration/updateStudy/${studyId}`;
    
    // Armamos el body como JSON
    const data = {
        title: tituloDelEstudio,
        target: mercadoObjetivo,
        objective: objetivosDelEstudio,
        prompt: promptDelEstudio
    };
    
    // Hacemos el POST con los headers adecuados
    axios.post(url, data, {
        headers: {
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        alert(getNestedTranslation(translations[lang], 'CreacionDeEstudio.wStudyUpdated'));
        sessionStorage.setItem('selectedStudyData', JSON.stringify(response.data));
    })
    .catch(error => {
        console.error('Error al actualizar el estudio:', error);
    });
    
    return {
        tituloDelEstudio,
        mercadoObjetivo,
        objetivosDelEstudio,
        promptDelEstudio,
    };
    
}

// Llama a la función cuando la página se carga completamente
window.addEventListener('DOMContentLoaded', (event) => {
    // Limpiar el searchBar
    const searchBar = document.getElementById('studySearchBar');
    if (searchBar) searchBar.value = '';

    if(window.location.href.includes('https://www.cheetah-research.ai/configuration/study/')){
        if(sessionStorage.getItem('selectedStudyId') == null){//PaginaPrincipal
            console.log('Study id:', sessionStorage.getItem('selectedStudyId'));
            CE_DeactivateNavBy();
            appendStudyForm();
        }else{//CreacionDeEstudio
            //Idioma
            const lang = sessionStorage.getItem('language') || 'es';
            setLanguage(lang);

            const formContainer = document.getElementById('form-containerStudy');
            formContainer.innerHTML = createFilledStudyForm();       
            appendFilledStudyForm();  
            setColorsFromAPI();//Setea colores en sessionStorage y en la interfaz
        }
    }else if(window.location.href.includes('home')){

        console.log('Study id:', sessionStorage.getItem('selectedStudyId'));
        loadStudies();
    }
});

function ApendStudies(){
    document.getElementById('TituloDelEstudioTXT').value = sessionStorage.getItem('tituloDelEstudio');
    document.getElementById('MercadoObjetivoTXT').value = sessionStorage.getItem('mercadoObjetivo');
    document.getElementById('ObjetivosDelEstudioTXT').value = sessionStorage.getItem('objetivosDelEstudio');
    document.getElementById('PromptGeneralTXT').value = sessionStorage.getItem('promptDelEstudio');
    document.getElementById('colorInput1').value = sessionStorage.getItem('color1DelEstudio');
    document.getElementById('colorInput2').value = sessionStorage.getItem('color2DelEstudio');
}

function loadStudies() { //Carga los estudios en la Main Page

    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('user_id'); // Asegurate que no sea NaN
    
    const url = `https://api.cheetah-research.ai/configuration/get_studies_by_user_id/${userId}/`;
    
    axios.get(url, {
        headers: {
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // console.log(response.data);
        const studies = response.data;
    
        // Invertir el orden de los estudios
        const reversedStudies = studies.reverse();
        renderStudies(reversedStudies);// Mostrar estudios inicialmente
    
        // Mostrar los estudios con el searchBar
        const searchBar = document.getElementById('studySearchBar');
        if (searchBar) {
            searchBar.addEventListener('input', function() {
                const query = this.value
                                  .toLowerCase()
                                  .normalize('NFD').replace(/[\u0300-\u036f]/g, '');// Quita acento

                const filtered = reversedStudies.filter(study =>
                    study.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query)
                    || (study._id && study._id.toLowerCase().includes(query))//Búsqueda por ID
                );
                renderStudies(filtered);
            });
        }
    })
    .catch(error => {
        console.error('Error al cargar los estudios:', error);
    });
    
}

// Mostrar los estudios en MainPage
function renderStudies(studies) {
    const listGroup = document.getElementById('listgrouptudies');
    listGroup.innerHTML = '';
    studies.forEach(study => {
        const studyElement = createStudyElement(study);
        listGroup.appendChild(studyElement);
    });
}

function createStudyElement(study) {
    // console.log('Study');
    const a = document.createElement('a');
    a.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
    a.href = 'https://www.cheetah-research.ai/configuration/study/';
    a.style.fontFamily = "'hedliner', sans-serif";

    const div1 = document.createElement('div');
    div1.classList.add('d-flex', 'w-100', 'justify-content-between');

    const h5 = document.createElement('h5');
    h5.classList.add('mb-1');
    h5.style.fontFamily = "'hedliner', sans-serif";
    h5.style.fontWeight = 'bold';
    h5.textContent = study.title;

    const span = document.createElement('span');
    span.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
    span.style.fontFamily = "'hedliner', sans-serif";
    span.style.borderRadius = '2px';
    // COLOR DE LA ETIQUETA HEX C0601C
    span.style.color = '#FFFFFF';

    // Truncar el texto si es demasiado largo
    const maxLength = 110; // Máximo número de caracteres permitidos
    if (study.marketTarget.length > maxLength) {
        span.textContent = study.marketTarget.substring(0, maxLength) + '...';
    } else {
        span.textContent = study.marketTarget;
    }

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
    small.textContent = `Creado el: ${formattedDate}`;
    a.appendChild(small);

    // Guardar el study id en sessionStorage y los datos en un json al hacer clic
    a.addEventListener('click', () => {
        sessionStorage.setItem('selectedStudyId', study._id);
        sessionStorage.setItem('selectedStudyData', JSON.stringify(study));
    });

    return a;
}

// Color Change
function saveColorsToStudy() {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    const studyId = sessionStorage.getItem('selectedStudyId');
    const primaryColor = document.getElementById('colorInput1').value;
    const secondaryColor = document.getElementById('colorInput2').value;

    const url = `https://api.cheetah-research.ai/configuration/set_colors/${studyId}`;
    const data = new FormData();
    data.append('primary_color', primaryColor);
    data.append('secondary_color', secondaryColor);

    axios.post(url, data)
        .then(response => {
            alert(getNestedTranslation(translations[lang], 'CreacionDeEstudio.wColorsSaved'));
            // console.log(response.data);
            setColorsLocally(primaryColor, secondaryColor);
        })
        .catch(error => {
            console.error('Error al guardar los colores:', error);
        });
}



function setColorsLocally(color1, color2) {
    //Aplicar los colores en interfaz
    applyColors({ color1, color2 });

    //Enviar colores a Chatbot
    const selectedStudyData = JSON.parse(sessionStorage.getItem('selectedStudyData')) || {};
    selectedStudyData.primary_color = color1;
    selectedStudyData.secondary_color = color2;
    sessionStorage.setItem('selectedStudyData', JSON.stringify(selectedStudyData));
}

//Colores
function setColorsFromAPI() {
    const studyId = sessionStorage.getItem('selectedStudyId');
    const url = 'https://api.cheetah-research.ai/configuration/info_study/' + studyId;
    return axios.get(url)
        .then(response => {
            const colors = {
                color1: response.data.primary_color,
                color2: response.data.secondary_color
            };


            //Setear colores en Local Storage
            setColorsLocally(colors.color1, colors.color2);

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