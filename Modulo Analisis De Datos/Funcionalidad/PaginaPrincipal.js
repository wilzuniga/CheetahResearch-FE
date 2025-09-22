// agregarCard.js

otpValidado = false;

// ============ Sistema de Tarjetas ============

// Iconos SVG
const CARD_ICONS = {
    objetivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"></circle></svg>',
    mercado: '<svg viewBox="0 0 24 24" class="ico-person" fill="currentColor" stroke="none"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path></svg>',
    fecha: '<svg viewBox="0 0 24 24" class="ico-calendar" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" fill="none"></rect><path d="M16 3v4M8 3v4M3 10h18" fill="none"></path><path d="M8 15h4" fill="none"></path></svg>',
    resumen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 7-7"></path><path d="M21 10V3h-7"/></svg>',
    def: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>'
};

// Detecta color acento desde elementos existentes
function detectAccentColor() {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--bs-CR-orange').trim();
    if (accentColor) {
        const match = accentColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
        }
        // Si es hex
        const hexMatch = accentColor.match(/#([0-9A-Fa-f]{6})/);
        if (hexMatch) {
            const hex = hexMatch[1];
            return {
                r: parseInt(hex.substr(0, 2), 16),
                g: parseInt(hex.substr(2, 2), 16),
                b: parseInt(hex.substr(4, 2), 16)
            };
        }
    }
    // Fallback
    return { r: 16, g: 185, b: 129 };
}

// Genera el CSS de las tarjetas
function generateCardStyles(accentColor) {
    const { r, g, b } = accentColor;
    return `
        <style>
            .cr-bullet-grid { 
                display: grid !important; 
                grid-template-columns: 1fr !important; 
                gap: 12px !important; 
                margin: 12px 0 !important; 
                padding: 0 !important; 
            }
            .cr-bullet-card { 
                background: #eef1f5; 
                border: 1px solid #dfe3ea; 
                border-radius: 12px; 
                padding: 12px 14px !important;
                box-shadow: 0 2px 6px rgba(0,0,0,.05); 
                display: flex; 
                gap: 10px; 
                align-items: flex-start;
                transition: background-color .15s, box-shadow .15s, transform .15s, border-color .15s; 
            }
            .cr-bullet-ico { 
                width: 35px; 
                height: 35px; 
                flex: 0 0 35px; 
                display: grid; 
                place-items: center; 
                background: #fff;
                border: 1px solid rgba(${r},${g},${b},0.25); 
                border-radius: 8px; 
                color: rgb(${r}, ${g}, ${b}); 
            }
            .cr-bullet-ico svg { 
                width: 20px; 
                height: 20px; 
                color: inherit;
            }
            .cr-bullet-ico svg * { 
                stroke: currentColor !important; 
            }
            .cr-bullet-ico svg *:not([fill="none"]) { 
                fill: currentColor !important; 
            }
            .cr-bullet-ttl { 
                margin: 0; 
                font-size: 24px; 
                line-height: 1.25; 
                font-weight: 800; 
                color: #0f1115;
            }
            .cr-bullet-txt { 
                margin: 4px 0 0; 
                font-size: 17px; 
                line-height: 1.42; 
                color: #1f2430;
            }
            .cr-resumen-list { 
                margin: 6px 0 0 18px; 
                padding: 0; 
                list-style: disc; 
                font-size: 17px; 
                line-height: 1.45; 
                color: #1f2430;
            }
            .cr-resumen-list li { 
                margin: 2px 0;
            }
            .cr-bullet-card:hover {
                background: rgba(${r},${g},${b},0.24) !important;
                border-color: rgba(${r},${g},${b},${Math.min(0.24*1.6,1)}) !important;
                box-shadow: 0 4px 10px rgba(0,0,0,.06) !important;
                transform: translateY(-1px);
            }
            .study-title {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
                color: #0f1115;
            }
        </style>
    `;
}

// Genera las tarjetas del estudio
function generateStudyCards(estudio) {
    const accentColor = detectAccentColor();
    const styles = generateCardStyles(accentColor);
    
    // Preparar datos de las tarjetas
    const cardData = [
        {
            title: 'Objetivo del Estudio',
            titleKey: 'Overview.sStudyObjectives',
            content: estudio.studyObjectives,
            icon: CARD_ICONS.objetivo
        },
        {
            title: 'Mercado Objetivo',
            titleKey: 'Overview.sTargetAudience', 
            content: estudio.marketTarget,
            icon: CARD_ICONS.mercado
        },
        {
            title: 'Fecha del Estudio',
            titleKey: 'Overview.sStudyDate',
            content: new Date(estudio.studyDate).toLocaleDateString(),
            icon: CARD_ICONS.fecha
        },
        {
            title: 'Resumen',
            titleKey: 'Overview.sStudySummary',
            content: estudio.prompt,
            icon: CARD_ICONS.resumen,
            isResumen: true
        }
    ];

    // Generar HTML de las tarjetas
    const cardsHTML = cardData.map(card => {
        let contentHTML;
        if (card.isResumen && card.content) {
            // Convertir resumen en lista de viñetas
            const sentences = card.content.replace(/\s+/g, ' ').trim()
                .split(/(?<=\S)\.(?:\s+|$)/)
                .map(t => t.trim())
                .filter(Boolean)
                .map(t => t.endsWith('.') ? t : t + '.');
            
            if (sentences.length > 1) {
                contentHTML = `<ul class="cr-resumen-list">${sentences.map(s => `<li>${s}</li>`).join('')}</ul>`;
            } else {
                contentHTML = `<p class="cr-bullet-txt">${card.content}</p>`;
            }
        } else {
            contentHTML = `<p class="cr-bullet-txt">${card.content}</p>`;
        }

        return `
            <div class="cr-bullet-card">
                <div class="cr-bullet-ico">${card.icon}</div>
                <div>
                    <h3 class="cr-bullet-ttl" data-i18n="${card.titleKey}">${card.title}</h3>
                    ${contentHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        ${styles}
        <div class="study-content">
            <h2 class="study-title">${estudio.title}</h2>
            <div class="cr-bullet-grid">
                ${cardsHTML}
            </div>
        </div>
    `;
}


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
            border-radius : 13px;
            text-align: center;
            text-color: black;
            padding: 20px;
        ">
            <p data-i18n="Overview.warningOTP">Para acceder a esta información, necesitas un código de acceso. Por favor, ingresa el código de acceso que te proporcionaron. Si no posees un OTP, selecciona el botón "Solicitar OTP" para obtener uno.</p>
            <input type="text" id="otpInput" style="
                width: 75%;
                padding: 10px;
                border-radius : 13px;
                margin: 10px;
            ">
            <button onclick="verificarOTP('${study_id}')" style="
                padding: 10px;
                border-radius : 13px;
                margin: 10px;
                background-color: #c0601c;
                color: white;
                border: none;
                cursor: pointer;
            " data-i18n="Overview.btVerifyOTP">Verificar</button>

           <button onclick="solicitarOTP('${study_id}')" style="
                padding: 10px;
                border-radius : 13px;
                margin: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
            " data-i18n="Overview.btRequestOTP">Solicitar OTP</button>



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
            border-radius : 13px;
            text-align: center;
            text-color: black;
            padding: 20px;
        ">
            <p data-i18n="Overview.sMailOTP">Por favor, ingresa tu correo electrónico para solicitar el OTP.</p>
            <input type="email" id="emailInput" data-i18n-placeholder="Overview.inMailOTP" style="
                width: 75%;
                padding: 10px;
                border-radius : 13px;
                margin: 10px;
            ">

            <button onclick="enviarOTP('${study_id}')" style="
                padding: 10px;
                border-radius : 13px;
                margin: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
            " data-i18n="Overview.btRequestOTP">Solicitar</button>
            
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

        console.log('Enviando OTP a:', body.recipients);
        console.log('ID de estudio:', study_id);

        // Usar axios para enviar la solicitud con el encabezado adecuado
        axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // console.log(response.data);
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
            border-radius : 13px;
            text-align: center;
            color: black;
            padding: 20px;
        ">
             <h1 data-i18n="Overview.overlayTitle">AVISO LEGAL</h1>
             <p><strong data-i18n="Overview.s1Overlay">Sobre el Contenido:</strong></p>
                <p data-i18n="Overview.desc1Overlay">
                    Los datos recopilados y presentados en este estudio son confidenciales y propiedad exclusiva del cliente. 
                    El acceso está restringido por un código distribuido solo a usuarios autorizados. 
                    Cualquier reproducción total o parcial, distribución a terceros o modificación de este contenido fuera de esta plataforma será responsabilidad del cliente.
                </p>
                
                <p><strong data-i18n="Overview.s2Overlay">Sobre la Plataforma:</strong></p>
                <p data-i18n="Overview.desc2Overlay">
                    Todos los elementos metodológicos, análisis, diseño, estructura y presentación de resultados en la plataforma Cheetah Research 
                    son propiedad intelectual de Marketing Total y protegidos por la ley de Derechos de Autor y Derechos Conexos. 
                    No deben ser objeto de plagio, reproducción, muestra o utilización por otro proveedor, ejecutor, contratista, 
                    ni transmisión a terceros o cualquier otro uso no previsto.
                </p>
                
                <p data-i18n="Overview.desc3Overlay">
                    Al acceder al reporte, los usuarios aceptan cumplir con estas condiciones y dan por entendidas las responsabilidades 
                    de cualquier infracción que pueda surgir del uso indebido de la información o la plataforma.
                </p>
            <button id="verifyButton" style="
                padding: 10px;
                border-radius : 13px;
                margin: 10px;
                background-color: var(--bs-CR-orange);
                color: var(--bs-CR-gray);
                border: none;
                cursor: pointer;
            " data-i18n="Overview.btAccept">Acceder Al Reporte</button>
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

    // console.log("El botón fue presionado, continuando...");
    

    contenido(study_id);
}




function verificarLink(study_id) {
    const VerifURL = 'https://api.cheetah-research.ai/configuration/info_study/' + study_id;
    
    return axios.get(VerifURL)
        .then(response => {
            // console.log(response.data);
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
            // console.log(response.data);
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
    // console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');

    if (study_id) {
        // console.log('ID de estudio:', study_id);
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
                        // Generar HTML dinámico usando los datos del objeto con sistema de tarjetas
                        const htmlContent = generateStudyCards(estudioActual);

                        div.innerHTML = htmlContent;
                    } else {
                        div.innerHTML = `<p data-i18n="Overview.eRequestedStudy">No se encontró el estudio solicitado.</p>`;
                    }
                })
                .catch(function (error) {
                    div.innerHTML = `<p data-i18n="Overview.eLoadStudies">Ocurrió un error al cargar los estudios.</p>`;
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
                            // Generar HTML dinámico usando los datos del objeto con sistema de tarjetas
                            const htmlContent = generateStudyCards(estudioActual);

                            div.innerHTML = htmlContent;
                        } else {
                            div.innerHTML = `<p data-i18n="Overview.eRequestedStudy">No se encontró el estudio solicitado.</p>`;
                        }
                    })
                    .catch(function (error) {
                        div.innerHTML = `<p data-i18n="Overview.eLoadStudies">Ocurrió un error al cargar los estudios.</p>`;
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
            border-radius : 13px;
            text-align: center;
            text-color: black;
            padding: 20px;
        ">
            <p data-i18n="Overview.eUnavailableLink">Parece que el enlace ya no está disponible. Si necesitas acceder a esta información, no dudes en contactarnos, ¡estamos aquí para ayudarte a resolverlo!</p>
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





