// agregarCard.js

otpValidado  = false;


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

    let otpInput = document.getElementById('otpInput').value;
    //quitarle los espacios a la cadena
    otpInput = otpInput.replace(/\s/g, '');
    const url = 'https://api.cheetah-research.ai/configuration/api/validate-otp/'

    formData = new FormData();
    formData.append('mongo_studio_id', study_id);
    formData.append('otp', otpInput);

    axios.post(url, formData)
        .then(response => {
            console.log(response.data);
            const data = response.data;
            let status = data.status;
            if(status == 'success') {
                otpValidado = true;
                contenido(study_id);
                //guardar en sesion que el otp fue validado
                localStorage.setItem('otpValidado', true);
            } else {
                alert('Código incorrecto. Por favor, inténtalo de nuevo.');
                otpValidado = false;

            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            alert('Código incorrecto. Por favor, inténtalo de nuevo.');
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
    let linkDisponible = false;

    // Verificar si existe en localStorage la variable de sesión
    otpValidado = localStorage.getItem('otpValidado');
    if (otpValidado) {
        linkDisponible = true;
    } else {
        linkDisponible = await verificarLink(study);
    }

    if (linkDisponible) {
        otpValidado = localStorage.getItem('otpValidado');
        if (otpValidado) {
            // Si es día 30 del mes, se borra la variable de sesión
            const d = new Date();
            const dia = d.getDate();
            if (dia === 30) {
                localStorage.removeItem('otpValidado');
            }

            hideOverlay();

            const div = document.getElementById("contentCard_PaginaOverview");
            const url = "https://api.cheetah-research.ai/configuration/info_study/" + study;

            axios.get(url)
                .then(function (response) {
                    const data = response.data;
                    console.log(data);

                    // Generar HTML dinámico usando los datos del objeto
                    const htmlContent = `
                        <h2>${data.title}</h2>
                        <p><strong>Objetivo del Estudio:</strong> ${data.studyObjectives}</p>
                        <p><strong>Mercado Objetivo:</strong> ${data.marketTarget}</p>
                        <p><strong>Fecha del Estudio:</strong> ${new Date(data.studyDate).toLocaleDateString()}</p>
                        <p><strong>Estatus del Estudio:</strong> ${data.studyStatus}</p>
                        <p><strong>Resumen:</strong> ${data.prompt}</p>
                    `;

                    div.innerHTML = htmlContent;
                })
                .catch(function (error) {
                    div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                    console.error(error);
                });
        } else {
            otp(study);
            if (otpValidado) {
                hideOverlay();

                const div = document.getElementById("contentCard_PaginaOverview");
                const url = "https://api.cheetah-research.ai/configuration/info_study/" + study;

                axios.get(url)
                    .then(function (response) {
                        const data = response.data;

                        // Generar HTML dinámico usando los datos del objeto
                        const htmlContent = `
                            <h2>${data.title}</h2>
                            <p><strong>Objetivo del Estudio:</strong> ${data.studyObjectives}</p>
                            <p><strong>Mercado Objetivo:</strong> ${data.marketTarget}</p>
                            <p><strong>Fecha del Estudio:</strong> ${new Date(data.studyDate).toLocaleDateString()}</p>
                            <p><strong>Estatus del Estudio:</strong> ${data.studyStatus}</p>
                            <p><strong>Resumen:</strong> ${data.prompt}</p>
                        `;

                        div.innerHTML = htmlContent;
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.error(error);
                    });
            }
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





