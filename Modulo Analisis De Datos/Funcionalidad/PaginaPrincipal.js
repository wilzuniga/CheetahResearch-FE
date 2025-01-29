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
            <p>Para acceder a esta información, necesitas un código de acceso. Por favor, ingresa el código de acceso que te proporcionaron. Si no posees un OTP, selecciona el botón "Solicitar OTP" para obtener uno.</p>
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

           <button onclick="solicitarOTP('${study_id}')" style="
                padding: 10px;
                border-radius: 5px;
                margin: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
            ">Solicitar OTP</button>



        </div>
    `;


}


function solicitarOTP(study_id) {
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
            <p>Por favor, ingresa tu correo electrónico para solicitar el OTP.</p>
            <input type="email" id="emailInput" placeholder="Correo electrónico" style="
                width: 75%;
                padding: 10px;
                border-radius: 5px;
                margin: 10px;
            ">

            <button onclick="enviarOTP('${study_id}')" style="
                padding: 10px;
                border-radius: 5px;
                margin: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
            ">Solicitar</button>
            
        </div>
    `;
    /*
    
    */
}

function enviarOTP(study_id) {
    const email = document.getElementById('emailInput').value;
    if (email) {
        const url = 'https://api.cheetah-research.ai/configuration/api/generate-otp-withmail/';
        
        // Preparar el cuerpo de la solicitud como un objeto JSON
        const body = {
            mongo_studio_id: study_id,
            recipients: [email] // Convertir a un arreglo, ya que el endpoint espera un array
        };

        // Usar axios para enviar la solicitud con el encabezado adecuado
        axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response.data);
            const data = response.data;
            let status = data.success;
            if (status === 'OTP email sent successfully') {
                alert('El código OTP ha sido enviado a tu correo electrónico.');
                otp(study_id);
            } else {
                alert('Ocurrió un error al enviar el código OTP. Por favor, inténtalo de nuevo.');
                otp(study_id);
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            alert('Ocurrió un error al enviar el código OTP. Por favor, inténtalo de nuevo.');
        });
    } else {
        alert('Por favor, ingresa un correo electrónico válido.');
    }
}





async function LegalDisclaimer(study_id) {
    
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
            color: black;
            padding: 20px;
        ">
             <h1>AVISO LEGAL</h1>
             <p><strong>Sobre el Contenido:</strong></p>
                <p>
                    Los datos recopilados y presentados en este estudio son confidenciales y propiedad exclusiva del cliente. 
                    El acceso está restringido por un código distribuido solo a usuarios autorizados. 
                    Cualquier reproducción total o parcial, distribución a terceros o modificación de este contenido fuera de esta plataforma será responsabilidad del cliente.
                </p>
                
                <p><strong>Sobre la Plataforma:</strong></p>
                <p>
                    Todos los elementos metodológicos, análisis, diseño, estructura y presentación de resultados en la plataforma Cheetah Research 
                    son propiedad intelectual de Marketing Total y protegidos por la ley de Derechos de Autor y Derechos Conexos. 
                    No deben ser objeto de plagio, reproducción, muestra o utilización por otro proveedor, ejecutor, contratista, 
                    ni transmisión a terceros o cualquier otro uso no previsto.
                </p>
                
                <p>
                    Al acceder al reporte, los usuarios aceptan cumplir con estas condiciones y dan por entendidas las responsabilidades 
                    de cualquier infracción que pueda surgir del uso indebido de la información o la plataforma.
                </p>
            <button id="verifyButton" style="
                padding: 10px;
                border-radius: 5px;
                margin: 10px;
                background-color: #c0601c;
                color: white;
                border: none;
                cursor: pointer;
            ">Acceder Al Reporte</button>
        </div>
    `;

    // Esperar a que el botón sea presionado
    await new Promise(resolve => {
        const button = document.getElementById('verifyButton');
        button.addEventListener('click', () => {
            resolve(); // Resuelve la promesa cuando se hace clic en el botón
            contenido(study_id);
        });
    });

    console.log("El botón fue presionado, continuando...");
    

    contenido(study_id);
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


async function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');

    if (study_id) {
        console.log('ID de estudio:', study_id);
        await LegalDisclaimer(study_id);

    } else {
        console.error('No se encontró el parámetro id en la URL.');
        // Muestra overlay si no hay study_id
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
            const url = "https://api.cheetah-research.ai/configuration/get_studies/";

            axios.get(url)
                .then(function (response) {
                    const estudios = response.data;

                    // Encontrar el estudio actual
                    const estudioActual = estudios.find(estudio => estudio._id === study);

                    if (estudioActual) {
                        // Generar HTML dinámico usando los datos del objeto
                        const htmlContent = `
                            <style>
                                .study-title {
                                    font-size: 2rem;
                                    font-weight: bold;
                                    margin-bottom: 10px;
                                }
                                .study-section {
                                    font-size: 1.2rem;
                                    margin-bottom: 8px;
                                }
                                .study-section strong {
                                    font-size: 1.3rem;
                                }
                                .study-content {
                                    margin-bottom: 15px;
                                }
                            </style>
                            <div class="study-content">
                                <h2 class="study-title">${estudioActual.title}</h2>
                                <p class="study-section"><strong>Objetivo del Estudio:</strong> ${estudioActual.studyObjectives}</p>
                                <p class="study-section"><strong>Mercado Objetivo:</strong> ${estudioActual.marketTarget}</p>
                                <p class="study-section"><strong>Fecha del Estudio:</strong> ${new Date(estudioActual.studyDate).toLocaleDateString()}</p>
                                <p class="study-section"><strong>Resumen:</strong> ${estudioActual.prompt}</p>
                            </div>
                        `;

                        div.innerHTML = htmlContent;
                    } else {
                        div.innerHTML = "<p>No se encontró el estudio solicitado.</p>";
                    }
                })
                .catch(function (error) {
                    div.innerHTML = "<p>Ocurrió un error al cargar los estudios.</p>";
                    console.error(error);
                });
        } else {
            otp(study);
            if (otpValidado) {
                hideOverlay();

                const div = document.getElementById("contentCard_PaginaOverview");
                const url = "https://api.cheetah-research.ai/configuration/get_studies/";

                axios.get(url)
                    .then(function (response) {
                        const estudios = response.data;

                        // Encontrar el estudio actual
                        const estudioActual = estudios.find(estudio => estudio._id === study);

                        if (estudioActual) {
                            // Generar HTML dinámico usando los datos del objeto
                            const htmlContent = `
                                <style>
                                    .study-title {
                                        font-size: 2rem;
                                        font-weight: bold;
                                        margin-bottom: 10px;
                                    }
                                    .study-section {
                                        font-size: 1.2rem;
                                        margin-bottom: 8px;
                                    }
                                    .study-section strong {
                                        font-size: 1.3rem;
                                    }
                                    .study-content {
                                        margin-bottom: 15px;
                                    }
                                </style>
                                <div class="study-content">
                                    <h2 class="study-title">${estudioActual.title}</h2>
                                    <p class="study-section"><strong>Objetivo del Estudio:</strong> ${estudioActual.studyObjectives}</p>
                                    <p class="study-section"><strong>Mercado Objetivo:</strong> ${estudioActual.marketTarget}</p>
                                    <p class="study-section"><strong>Fecha del Estudio:</strong> ${new Date(estudioActual.studyDate).toLocaleDateString()}</p>
                                    <p class="study-section"><strong>Resumen:</strong> ${estudioActual.prompt}</p>
                                </div>
                            `;

                            div.innerHTML = htmlContent;
                        } else {
                            div.innerHTML = "<p>No se encontró el estudio solicitado.</p>";
                        }
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>Ocurrió un error al cargar los estudios.</p>";
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
            border-radius: 10px;
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





