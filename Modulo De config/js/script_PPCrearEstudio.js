


function disableNavItems() {

}

function enableNavItems() {

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
        </div>`
    ;

    const mercadoObjetivo = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Mercado Objetivo</p>
            <input class="form-control" type="text" id="MercadoObjetivoTXT" name="Mercado Objetivo" placeholder="Mercado Objetivo" style="font-family: 'IBM Plex Sans'; border-radius: 3px">
        </div>`
    ;

    const objetivosDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Objetivos del Estudio</p>
            <input class="form-control" type="text" id="ObjetivosDelEstudioTXT" name="Objetivos del Estudio" placeholder="Objetivos generales del estudio, separados por comas (&quot;,&quot;)" style="font-family: 'IBM Plex Sans'; border-radius: 3px">
        </div>`
    ;

    const promptDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Prompt del Estudio</p>
            <textarea class="form-control" id="PromptGeneralTXT" name="Prompt del Estudio" rows="6" placeholder="Ingresa el prompt general de la encuesta" style="font-family: 'IBM Plex Sans', sans-serif;  color: #072934; border-radius: 3px"></textarea>
        </div>`
    ;

    const colorInput1 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Color Principal del Estudio</p>
            <input type="color" class="form-control" id="colorInput1" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="#C0601C">
        </div>`
    ;

    const colorInput2 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Color Secundario del Estudio</p>
            <input type="color" class="form-control" id="colorInput2" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="#404040">
        </div>`
    ;

    const setDefaultColorButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="setDefaultColorButton" type="button" style="font-family: 'hedliner', sans-serif;">Colores Default</button>
        </div>`
    ;
    const saveColorsButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="saveColorsButton" type="button" style="font-family: 'hedliner', sans-serif;  background-color:var(--bs-CR-orange-2);">Guardar Colores</button>
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
            <button class="btn btn-primary d-block w-100" id="CrearEstudioBtn" type="button" style="font-weight: bold;font-size: 20px;border-radius: 3px;font-family: 'hedliner', sans-serif;">Crear Estudio</button>
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

    //crear u¿el formulario lleno sin el boton de crear estudio y en vez de que sea el prompt que sea el  resumen del estudio. Todo con el localstorage selectedStudyData. Solo lectura
    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
        color1DelEstudio: studyData.primary_color,
        color2DelEstudio: studyData.secondary_color
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;

    const title = '<h2 style="color: var(--bs-emphasis-color);font-weight: bold;font-family: \'hedliner\', sans-serif;">Resumen del Estudio</h2>';

    const tituloDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Titulo del Estudio</p>
            <input class="form-control" type="text" id="TituloDelEstudioTXT" name="Titulo" placeholder="Titulo" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.tituloDelEstudio}" >
        </div>`
    ;

    const mercadoObjetivo = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Mercado Objetivo</p>
            <input class="form-control" type="text" id="MercadoObjetivoTXT" name="Mercado Objetivo" placeholder="Mercado Objetivo" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.mercadoObjetivo}" >
        </div>`
    ;

    const objetivosDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Objetivos del Estudio</p>
            <input class="form-control" type="text" id="ObjetivosDelEstudioTXT" name="Objetivos del Estudio" placeholder="Objetivos generales del estudio, separados por comas (&quot;,&quot;)" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.objetivosDelEstudio}" >
        </div>`
    ;

    const promptDelEstudio = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Prompt del Estudio</p>
            <textarea class="form-control" id="PromptGeneralTXT" name="Prompt del Estudio" rows="6" placeholder="Ingresa el prompt general de la encuesta" style="font-family: 'IBM Plex Sans', sans-serif;  color: #072934; border-radius: 3px" >${selectedStudyData.Resumen}</textarea>
        </div>`
    ;

    const colorInput1 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Color del Estudio</p>
            <input type="color" class="form-control" id="colorInput1" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.color1DelEstudio}">
        </div>`
    ;

    const colorInput2 = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <p style="font-size: 20px;color: var(--bs-emphasis-color);margin-bottom: 5px;font-family: 'hedliner', sans-serif;">Color Secundario del Estudio</p>
            <input type="color" class="form-control" id="colorInput2" name="Color del Estudio" style="font-family: 'IBM Plex Sans'; border-radius: 3px" value="${selectedStudyData.color2DelEstudio}">
        </div>`
    ;

    const setDefaultColorButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="setDefaultColorButton" type="button" style="font-family: 'hedliner', sans-serif;">Colores Default</button>
        </div>`
    ;
    const saveColorsButton = `
        <div class="mb-3" style="font-family: 'hedliner', sans-serif;">
            <button class="btn btn-secondary" id="saveColorsButton" type="button" style="font-family: 'hedliner', sans-serif; background-color:var(--bs-CR-orange-2);">Guardar Colores</button>
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
            <button class="btn btn-primary d-block w-100" id="UpdateEstudio" type="button" style="font-weight: bold;font-size: 20px;border-radius: 3px;font-family: 'hedliner', sans-serif;">Actualizar Estudio</button>
        </div>`
    ;

    console.log(studyData);


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
    const formContainer = document.getElementById('form-containerStudy');
    formContainer.innerHTML = createStudyForm();

    document.getElementById('CrearEstudioBtn').addEventListener('click', () => {
        const studyData = CaptureAndPostformdta();
        console.log(studyData);
        alert('Estudio creado exitosamente');
        //guardar en localsotrage el estudio creado
        localStorage.setItem('selectedStudyData', JSON.stringify(studyData));
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

    //Color Change: Colores Default
    document.getElementById('setDefaultColorButton').addEventListener('click', () => {
        document.getElementById('colorInput1').value = '#C0601C';
        document.getElementById('colorInput2').value = '#404040';
    });

    //Color Change: Guardar Colores
    document.getElementById('saveColorsButton').addEventListener('click', saveColorsToStudy);
}

function StudysaveToLocStrg() {//Funcion de prueba
    localStorage.setItem('tituloDelEstudio', document.getElementById('TituloDelEstudioTXT').value);
    localStorage.setItem('mercadoObjetivo', document.getElementById('MercadoObjetivoTXT').value);
    localStorage.setItem('objetivosDelEstudio', document.getElementById('ObjetivosDelEstudioTXT').value);
    localStorage.setItem('promptDelEstudio', document.getElementById('PromptGeneralTXT').value);
    localStorage.setItem('color1DelEstudio', document.getElementById('colorInput1').value);
    localStorage.setItem('color2DelEstudio', document.getElementById('colorInput2').value);
}

function deleteFromLocStrg() {
    //verificar si se esta en PaginaPrincipal.html o CreacionDeEstudio.html
    if(window.location.href.includes('home')){
        console.log('Borrando datos del estudio');
        localStorage.removeItem('tituloDelEstudio');
        localStorage.removeItem('mercadoObjetivo');
        localStorage.removeItem('objetivosDelEstudio');
        localStorage.removeItem('promptDelEstudio');
        localStorage.removeItem('color1DelEstudio');
        localStorage.removeItem('color2DelEstudio');
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
    
    const token = localStorage.getItem('token');
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        alert('Estudio creado exitosamente');
        localStorage.setItem('selectedStudyId', response.data.study_id);
        localStorage.setItem('selectedStudyData', JSON.stringify(response.data));
    
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
    const tituloDelEstudio = document.getElementById('TituloDelEstudioTXT').value;
    const mercadoObjetivo = document.getElementById('MercadoObjetivoTXT').value;
    const objetivosDelEstudio = document.getElementById('ObjetivosDelEstudioTXT').value;
    const promptDelEstudio = document.getElementById('PromptGeneralTXT').value;
    
    const token = localStorage.getItem('token');
    const studyId = localStorage.getItem('selectedStudyId');
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        alert('Estudio actualizado exitosamente');
        localStorage.setItem('selectedStudyData', JSON.stringify(response.data));
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
    if(window.location.href.includes('https://www.cheetah-research.ai/configuration/study/')){
        if(localStorage.getItem('selectedStudyId') == null){
            console.log('Study id:', localStorage.getItem('selectedStudyId'));
            CE_DeactivateNavBy();
            appendStudyForm();
        }else{
            const formContainer = document.getElementById('form-containerStudy');
            formContainer.innerHTML = createFilledStudyForm();       
            appendFilledStudyForm();  
            setColorsFromAPI();//Setea en LocalStorage los colores
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
    document.getElementById('colorInput1').value = localStorage.getItem('color1DelEstudio');
    document.getElementById('colorInput2').value = localStorage.getItem('color2DelEstudio');
}

function loadStudies() { //Carga los estudios en la Main Page
    //const url = 'https://api.cheetah-research.ai/configuration/get_studies/'; get studies trae todos los estudios de la db

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id'); // Asegurate de haber guardado esto al hacer login
    
    const url = `https://api.cheetah-research.ai/configuration/get_studies_by_user_id/${userId}/`;
    
    axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        const studies = response.data;
    
        // Invertir el orden de los estudios
        const reversedStudies = studies.reverse();
    
        const listGroup = document.getElementById('listgrouptudies');
    
        reversedStudies.forEach(study => {
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
    small.textContent = formattedDate;
    a.appendChild(small);

    // Guardar el study id en localStorage y los datos en un json al hacer clic
    a.addEventListener('click', () => {
        localStorage.setItem('selectedStudyId', study._id);
        localStorage.setItem('selectedStudyData', JSON.stringify(study));
    });

    return a;
}

// Color Change
function saveColorsToStudy() {
    const studyId = localStorage.getItem('selectedStudyId');
    const primaryColor = document.getElementById('colorInput1').value;
    const secondaryColor = document.getElementById('colorInput2').value;

    const url = `https://api.cheetah-research.ai/configuration/set_colors/${studyId}`;
    const data = new FormData();
    data.append('primary_color', primaryColor);
    data.append('secondary_color', secondaryColor);

    axios.post(url, data)
        .then(response => {
            alert('Colores guardados exitosamente');
            console.log(response.data);
            setColorsLocally(primaryColor, secondaryColor);
        })
        .catch(error => {
            console.error('Error al guardar los colores:', error);
        });
}

function setColorsFromAPI() {
    const url = 'https://api.cheetah-research.ai/configuration/info_study/' + localStorage.getItem('selectedStudyId');
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

function setColorsLocally(color1, color2) {
    const selectedStudyData = JSON.parse(localStorage.getItem('selectedStudyData')) || {};
    selectedStudyData.primary_color = color1;
    selectedStudyData.secondary_color = color2;
    localStorage.setItem('selectedStudyData', JSON.stringify(selectedStudyData));
}