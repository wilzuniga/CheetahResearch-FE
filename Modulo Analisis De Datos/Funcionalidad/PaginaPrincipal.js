// agregarCard.js

function otp(study_id) {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
        <div id="overlayContent" style="
            height: auto;
            background-color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 10px;
            text-align: center;
            text-color: black;
            padding: 20px;
        ">
            <p>Para acceder a esta información, necesitas un código de acceso. Por favor, ingresa el código de acceso que te proporcionaron.</p>
            <input type="text" id="otpInput" style="
                width: 75%;
                padding: 10px;
                border-radius: 5px;
                margin: 10px;
            ">
            <button onclick="verificarOTP('${study_id}')" style="
                padding: 10px;
                border-radius: 5px;
                margin: 10px;
                background-color: #c0601c;
                color: white;
                border: none;
                cursor: pointer;
            ">Verificar</button>
        </div>
    `;
}


function verificarLink(study_id) {
    const VerifURL = 'https://api.cheetah-research.ai/configuration/info_study/' + study_id;
    
    return axios.get(VerifURL)
        .then(response => {
            console.log(response.data);
            const data = response.data;
            let studyStatus = data.studyStatus;
            
            if(studyStatus == 0) {
                return false;
            } else if(studyStatus == 1) {
                return false;
            } else {
                return true;
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            return false;
        });
}

function verificarOTP(study_id) {

    const otpInput = document.getElementById('otpInput').value;
    const url = 'https://api.cheetah-research.ai/configuration/validate-otp/'

    formData = new FormData();
    formData.append('mongo_studio_id', study_id);
    formData.append('otp', otpInput);

    axios.post(url, formData)
        .then(response => {
            console.log(response.data);
            const data = response.data;
            let status = data.status;
            if(status == 'success') {
                return true;
            } else {
                alert('Código incorrecto. Por favor, inténtalo de nuevo.');
                return false;
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}


function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');
    if (study_id) {
        console.log('ID de estudio:', study_id);
        contenido(study_id);
    } else {
        console.error('No se encontró el parámetro id en la URL.');
        //show overlay
        showOverlay();
    }
}


async function contenido(study) {

    const linkDisponible = await verificarLink(study);

    if (linkDisponible) {
        const otpValidado  = await otp(study);
        if(otpValidado) {
            hideOverlay();

            var div = document.getElementById("contentCard_PaginaOverview");

            formData = new FormData();
            formData.append('filter', 'General');
            formData.append('module', 'general');
            formData.append('sub_module', 'narrative');
            const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
            axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                const coso = marked(data);      
                div.innerHTML = coso;                      

                console.log(data);
            })
            .catch(function (error) {
                div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        } else {
            //Mostrar mensaje de error
            console.log('Mostrar mensaje de error');
        }        
    } else {
        showOverlay();
    }
}

//Link Desactivado
//poner un cuadrito pequeño con bordes redondeados que diga que el link está desactivado
function linkDesactivado() {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
        <div id="overlayContent" style="
            height: auto;
            background-color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 25px;
            text-align: center;
            text-color: black;
            padding: 20px;
        ">
            <p>Parece que el enlace ya no está disponible. Si necesitas acceder a esta información, no dudes en contactarnos, ¡estamos aquí para ayudarte a resolverlo!</p>
        </div>
    `;

    removeLinks();
}  



function removeLinks() {
    var link = document.getElementById('socrates-link');
    var link2 = document.getElementById('analis-link');
    var link3 = document.getElementById('home-link');
    var link4 = document.getElementById('home-link2');

    // Remueve los atributos href de cada enlace
    link.removeAttribute('href');
    link2.removeAttribute('href');
    link3.removeAttribute('href');
    link4.removeAttribute('href');
}



function showOverlay() {    
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block'; // Muestra el overlay
    linkDesactivado();
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none'; // Oculta el overlay
}





