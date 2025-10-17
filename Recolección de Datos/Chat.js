let imgPP;
let hash = 0;
let shouldBlockAfterCompletion = false; // Variable para rastrear si debe bloquearse al terminar

// Función para determinar si el estudio requiere textos en inglés
function isEnglishStudy(study_id) {
    return study_id === '68b75b285cbd2fb848ff7c81';
}

//Color Change: getColores
function setColorsFromAPI(study_id) {
    const url = 'https://api.cheetah-research.ai/configuration/info_study/' + study_id;
    return axios.get(url)
        .then(response => ({
            color1: response.data.primary_color,
            color2: response.data.secondary_color
        }))

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

document.addEventListener('DOMContentLoaded', async function() {
    const study_id = new URLSearchParams(window.location.search).get('id');
    const colors = await setColorsFromAPI(study_id);
    if (colors) {
        applyColors(colors);
    }
});

//Función inicializar Chat
function initializePage() {
    const study_id = new URLSearchParams(window.location.search).get('id');
    if (study_id) {
        // console.log('ID de estudio:', study_id);
        loadInterviewer(study_id);
    } else {
        console.error('No se encontró el parámetro id en la URL.');
    }
}

//Cambiar size del Type-Box con Input y Window resize
document.addEventListener('DOMContentLoaded', (event) => {
    const messageInput = document.getElementById('Message-Input');
    let initHeight = messageInput.scrollHeight;
    let maxHeight = initHeight * 2;
    //Función cambiar size del Type-Box
    function messageInput_resize() {
        messageInput.style.height = initHeight + 'px';
        if (messageInput.scrollHeight > initHeight) {
            let newHeight = messageInput.scrollHeight;
            //Calcular newHeight
            if (newHeight > maxHeight) {//El height no puede pasarse de maxHeight 
                newHeight = maxHeight;
            }
            //Cambiar height
            messageInput.style.height = newHeight + 'px';
            messageInput.style.transform = `translateY(${initHeight - newHeight}px)`;//Crece hacia arriba 
        } else if (messageInput.scrollHeight === initHeight) {
            messageInput.style.transform = `translateY(0px)`;//Al vaciarse el Type-Box lo regresa a la normalidad
        }
    }
    //Función cambiar size del Type-Box al cambiar size de Ventana
    function messageInput_resizeWindow() {
        //Re-calcular nuevos valores
        initHeight = messageInput.parentElement.offsetHeight;
        maxHeight = initHeight * 2;
        messageInput.style.height = initHeight + 'px';

        let newHeight = messageInput.scrollHeight;
        //Calcular newHeight
        if (newHeight > maxHeight) {//El height no puede pasarse de maxHeight
            newHeight = maxHeight;
        }
        //Cambiar height
        messageInput.style.height = newHeight + 'px';
        messageInput.style.transform = `translateY(${initHeight - newHeight}px)`;//Verifica la posición correcta del Type-Box
    }
    //Resize al escribir
    messageInput.addEventListener('input', messageInput_resize);
    //Resize al cambiar tamaño de Ventana
    window.addEventListener('resize', messageInput_resizeWindow);
});

//Enviar mensaje al presionar enter
document.getElementById('Message-Input').addEventListener('keydown', function (event) {
    const imageIcon = document.getElementById('imageIcon');
    const imageInput = document.getElementById('imageInput');

    if (!(event.key === 'Enter' && event.shiftKey) && !(event.key === 'Enter' && event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        const message = this.value.trim();
        const imageSrc = imageInput.src;

        if (message || imageInput.style.display !== 'none') {
            if (imageInput.style.display !== 'none') {
                sendMessage(message, imageSrc);
                imageInput.src = '';
                imageIcon.style.display = 'flex';
                imageInput.style.display = 'none';
            } else {
                sendMessage(message, null);
            }
            this.value = '';
            this.style.height = `100%`;
            this.style.transform = `translateY(0px)`;
        }
    }
});

//Enviar mensaje al presionar botón de enviar
document.getElementById('btSend').addEventListener('click', function () {
    let messageInput = document.getElementById('Message-Input');
    const imageIcon = document.getElementById('imageIcon');
    const imageInput = document.getElementById('imageInput');
    const message = messageInput.value.trim();
    const imageSrc = imageInput.src;

    if (message || imageInput.style.display !== 'none') {
        if (imageInput.style.display !== 'none') {
            sendMessage(message, imageSrc);
            imageInput.src = '';
            imageIcon.style.display = 'flex';
            imageInput.style.display = 'none';
        } else {
            sendMessage(message, null);
        }
        messageInput.value = '';
        messageInput.style.height = `100%`;
        messageInput.style.transform = `translateY(0px)`;
    }
});

//Función elegir imagen al presionar botón de imagen
document.getElementById('btIMG').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    const imageIcon = document.getElementById('imageIcon');
    const imageInput = document.getElementById('imageInput');
    fileInput.click();

    fileInput.addEventListener('change', function () {
        const selectedFile = fileInput.files[0];

        if (selectedFile) {
            imageIcon.style.display = 'none';
            imageInput.style.display = 'flex';

            const reader = new FileReader();
            reader.onload = function (e) {
                imageInput.src = e.target.result;
            };
            reader.readAsDataURL(selectedFile);
        }
    });
});

//Enviar un mensaje como entrevistador
function sendMessage(message, imageSrc) {
    //BUSCAR SI INCLUYE LA PALABRA "LISTO" Y REEMPLAZARLA POR PERFECTO



    //Variables para display de Espera de Respuesta
    let loadingGif = document.getElementById('LoadingGif');
    let loadingMsg = document.getElementById('Typing-Msg');

    //Crear y enviar mensaje (formato Entrevistado)
    const Feed = document.getElementById('Feed');//Validar Feed Vacío
    const emptyFeed = document.getElementById('Empty-Feed');
    if (Feed.style.display === 'none') {
        emptyFeed.style.display = 'none';
        Feed.style.display = 'flex';
    }

    let options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',

        hour: '2-digit',
        minute: '2-digit',

        hour12: true
    };

    const messageList = document.getElementById('Message-List');
    const li = document.createElement('li');
    li.className = 'd-flex justify-content-end my-3';

    const card = document.createElement('div');
    card.className = 'card d-inline-block';
    card.style.maxWidth = '80%';
    card.style.borderRadius = '15px';
    card.style.borderBottomRightRadius = '0px';
    card.style.borderBottomWidth = 'medium';
    card.style.background = 'var(--bs-CR-white)';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body text-break text-center d-flex flex-column p-2';

    const img = document.createElement('img');
    if (imageSrc) {

        img.className = 'img-fluid d-flex order-1 mx-auto mb-2'
        img.src = imageSrc;
        img.style.maxHeight = '18rem';
        img.style.height = 'auto';
        img.style.minHeight = '9rem';
        img.style.paddingLeft = '0px';
        cardBody.appendChild(img);
    }

    const p = document.createElement('p');
    p.className = 'card-text text-start text-break d-flex order-2';
    p.style.color = '#212529';
    p.style.marginBottom = '3px';
    p.textContent = message;
    p.innerHTML = message.replace(/\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));//registra el newline y espacios

    const h4 = document.createElement('h4');
    h4.className = 'd-flex justify-content-end order-3 card-subtitle text-end';
    h4.style.marginTop = '0px';
    h4.style.color = '#5d647b';
    h4.style.fontFamily = "League Spartan";
    h4.textContent = new Intl.DateTimeFormat('es-419', options).format(new Date());
    h4.textContent = h4.textContent.replace('a.\u00A0m.', 'AM').replace('p.\u00A0m.', 'PM');

    cardBody.appendChild(p);
    cardBody.appendChild(h4);
    card.appendChild(cardBody);
    li.appendChild(card);
    messageList.appendChild(li);
    loadingGif.src = './assets/img/Loading%20Dots.gif';//Animación se resetea
    loadingMsg.style.display = 'flex';

    //Scroll automático hacia abajo cuando se envía un mensaje nuevo
    const scrollPanel = document.getElementById('Feed-BG');
    scrollPanel.scrollTop = scrollPanel.scrollHeight;

    //Mensaje de espera de respuesta queda abajo
    messageList.insertBefore(loadingMsg, null);

    message = message.replace(/LISTO/g, 'Perfecto');
    message = message.replace(/listo/g, 'perfecto');
    message = message.replace(/Listo/g, 'Perfecto');
    message = message.replace(
        "En agradecimiento por su participación se le hará entrega de un incentivo, el cual para ser acreedor al premio debe llegar hasta al final de la conversación.",
        ""
    );
    

    //Procesar y Enviar Respuesta como Encuestador
    const url = 'https://api.cheetah-research.ai/chatbot/communicate/';

    axios.post(url, { prompt: message, hash: hash }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((response) => {
        const data = response.data;
        if (data.response.includes('LISTO')) {
            const study_id = new URLSearchParams(window.location.search).get('id');
            let farewellMessage;
            
            if (study_id === '68b75b285cbd2fb848ff7c81') {
                farewellMessage = `Great! Thanks again for your time.\n💡 We'll keep you updated on how Cheetah Research AI is reshaping the future of market research.\nOne of our team members will reach out to you shortly to continue the conversation.\n🚀 Talk soon!`;
            } else if (study_id === '68b75b285cbd2fb848ff7c82') {
                farewellMessage = `Gracias por conversar. Compartiré tu experiencia con el equipo para seguir mejorando!!`;
            } else {   
                farewellMessage = `Gracias por tomarte el tiempo para completar nuestra encuesta. Tus respuestas son muy valiosas para nosotros y nos ayudarán a mejorar nuestros servicios.\n\nSi tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.\n\n¡Que tengas un excelente día!`;
            }

            getMessage(farewellMessage, null);
            loadingMsg.style.display = 'none';
            endChat();
            
            // Bloquear el estudio en este dispositivo si debe hacerlo (modo kiosko desactivado)
            if (shouldBlockAfterCompletion) {
                blockStudy(study_id);
                console.log('Estudio bloqueado en este dispositivo');
                shouldBlockAfterCompletion = false; // Reset
            }

            const url = 'https://api.cheetah-research.ai/chatbot/logs/';

            axios.post(url, { hash: hash, study_id: study_id }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response) => {

            }
            ).catch((error) => {
                console.log('Error:', error);
            });

        } else if (data.response.includes('NO SIRVE')) {
            const study_id = new URLSearchParams(window.location.search).get('id');
            let farewellMessage;
            
            if (isEnglishStudy(study_id)) {
                farewellMessage = `Sorry, you don't meet the requirements for this study!\n\nThank you very much!\n\nHave a great day!`;
            } else {
                farewellMessage = `¡Lo sentimos no cumples con los requisitos para este estudio!\n\n¡Muchas Gracias !\n\n¡Que tengas un excelente día!`;
            }
            
            getMessage(farewellMessage, null);
            loadingMsg.style.display = 'none';
            endChat();
            
            // Bloquear el estudio en este dispositivo si debe hacerlo (modo kiosko desactivado)
            if (shouldBlockAfterCompletion) {
                blockStudy(study_id);
                console.log('Estudio bloqueado en este dispositivo (no cumple requisitos)');
                shouldBlockAfterCompletion = false; // Reset
            }

        
        }else {
            //eliminar todo el contenido entre [] en el mensaje
            data.response = data.response.replace(/\[.*?\]/g, '');
            console.log('Respuesta del encuestador:', data.response);
            
            if ('file_path' in data) {
                if ('url' in data) {
                    getMessage(data.response, data.file_path, data.url);
                } else {
                    getMessage(data.response, data.file_path, null);
                }
            } else {
                if ('url' in data) {
                    getMessage(data.response, null, data.url);
                } else {
                    getMessage(data.response, null, null);
                }
            }
            loadingMsg.style.display = 'none';
        }

    }).catch((error) => {
        console.log('Error:', error);
        const study_id = new URLSearchParams(window.location.search).get('id');
        let errorMessage;
        
        if (isEnglishStudy(study_id)) {
            errorMessage = 'Would you like to add anything else to your response?';
        } else {
            errorMessage = '¿Deseas agregar algo mas a tu respuesta?';
        }
        
        getMessage(errorMessage, null);
        loadingMsg.style.display = 'none';
    });
}

//Función para decodificar caracteres Unicode
function decodeUnicode(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });
}

//Función para recibir un mensaje de encuestador
function getMessage(message, imageSrc, link) {
    // Decodificar caracteres Unicode en el mensaje
    message = decodeUnicode(message);
    
    const Feed = document.getElementById('Feed'); // Validar Feed Vacío
    const emptyFeed = document.getElementById('Empty-Feed');
    if (Feed.style.display === 'none') {
        emptyFeed.style.display = 'none';
        Feed.style.display = 'flex';
    }

    let options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const messageList = document.getElementById('Message-List');
    const li = document.createElement('li');
    li.className = 'd-flex my-3';

    const BotIMG_Div = document.createElement('div');
    BotIMG_Div.className = 'BotIMG-Div d-flex justify-content-end align-items-center align-content-center align-self-end';
    BotIMG_Div.style.width = '50px';
    BotIMG_Div.style.height = '100%';
    BotIMG_Div.style.paddingRight = '2px';
    BotIMG_Div.style.paddingLeft = '0px';

    const BotIMG_Cont = document.createElement('div');
    BotIMG_Cont.className = 'BotIMG-Cont text-truncate d-flex justify-content-center align-items-center align-content-center';
    BotIMG_Cont.style.background = '#d1d1d1';

    const BotIMG = document.createElement('img');
    BotIMG.src = imgPP;
    BotIMG.style.maxHeight = '100%';

    const card = document.createElement('div');
    card.className = 'card d-inline-block';
    card.style.maxWidth = '75%';
    card.style.borderRadius = '15px';
    card.style.borderBottomLeftRadius = '0px';
    card.style.borderBottomWidth = 'medium';
    card.style.background = 'var(--bs-CR-orange-2)';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body text-break text-center d-flex flex-column p-2';

    if (imageSrc) {
        const ruta = "https://cheetahresearch.s3.amazonaws.com/" + imageSrc;
        const img = document.createElement('img');
        img.className = 'img-fluid d-flex order-1 mx-auto mb-2';
        img.src = ruta;
        img.style.maxHeight = '18rem';
        img.style.height = 'auto';
        img.style.minHeight = '9rem';
        img.style.paddingLeft = '0px';
        cardBody.appendChild(img);
    }

    if (link) {
        const anchor = document.createElement('a');
        anchor.className = 'text-start text-break d-flex order-2';
        anchor.style.fontFamily = "League Spartan";
        anchor.style.marginBottom = "6px";
        anchor.href = `https://${link}`;
        anchor.textContent = `${link}`;
        anchor.target = '_blank';
        cardBody.appendChild(anchor);
    }

    // Procesar el mensaje como Markdown
    const messageDiv = document.createElement('div');
    messageDiv.className = 'text-start card-text'; // Alineación a la izquierda
    messageDiv.style.fontSize = '18px'; // Ajuste del tamaño de fuente
    messageDiv.style.lineHeight = '1.5'; // Espaciado entre líneas para mejor legibilidad
    messageDiv.style.color = '#FFFFFF'; // Color del texto

    try {
        let unescapedMessage = message.replace(/\\n/g, '\n');

        let processedMessage = unescapedMessage.replace(/\n/g, '<br>');
        processedMessage = processedMessage.replace(/\[.*?\]/g, '');


        
        // Mostrar en el HTML
        messageDiv.innerHTML = processedMessage;

        console.log('Mensaje procesado:', processedMessage); // Para depuración
    } catch (error) {
        console.error('Error procesando Markdown:', error);
        messageDiv.textContent = message; // Fallback al texto plano
    }

    cardBody.appendChild(messageDiv);

    const h4 = document.createElement('h4');
    h4.className = 'd-flex align-self-start justify-content-end order-3 card-subtitle text-end';
    h4.style.marginTop = '0px';
    h4.style.color = '#555155';
    h4.style.fontFamily = "League Spartan";
    h4.textContent = new Intl.DateTimeFormat('es-419', options).format(new Date());
    h4.textContent = h4.textContent.replace('a.\u00A0m.', 'AM').replace('p.\u00A0m.', 'PM');

    BotIMG_Cont.appendChild(BotIMG);
    BotIMG_Div.appendChild(BotIMG_Cont);
    cardBody.appendChild(h4);
    card.appendChild(cardBody);
    li.appendChild(BotIMG_Div);
    li.appendChild(card);
    messageList.appendChild(li);

    // Scroll automático hacia abajo cuando se envía un mensaje nuevo
    const scrollPanel = document.getElementById('Feed-BG');
    scrollPanel.scrollTop = scrollPanel.scrollHeight;

    // Mensaje de espera de respuesta queda abajo
    const loadingMsg = document.getElementById('Typing-Msg');
    messageList.insertBefore(loadingMsg, null);
}

//Funciones cambiar colores de botones al soltar botón (móviles)
document.getElementById('btIMG-Cont').addEventListener('touchstart', function () {
    this.style.background = 'var(--bs-CR-orange-2)';
    this.style.transition = '0s ease-in-out';
});
document.getElementById('btIMG-Cont').addEventListener('touchend', function () {
    this.style.background = 'transparent';
    this.style.transition = '0.2s ease-in-out';
});

document.getElementById('btSend-Cont').addEventListener('touchstart', function () {
    btSend = document.getElementById('btSend');
    btSend.style.color = '#929292';
    this.style.background = 'var(--bs-CR-black)';
    this.style.transition = '0s ease-in-out';
});
document.getElementById('btSend-Cont').addEventListener('touchend', function () {
    btSend = document.getElementById('btSend');
    btSend.style.color = 'var(--bs-gray-dark)';
    this.style.backgroundColor = 'var(--bs-CR-orange)';
    this.style.transition = '0.2s ease-in-out';
});

document.getElementById('btIMG').addEventListener('touchstart', function () {
    this.style.color = 'var(--bs-CR-gray-dark)';
    this.style.transition = '0s ease-in-out';
});
document.getElementById('btIMG').addEventListener('touchend', function () {
    this.style.color = 'var(--bs-CR-orange)';
    this.style.transition = '0.2s ease-in-out';
});

//Función Cargar Encuesta
function load(study_id) {
    const preguntas = [];
    const url = 'https://api.cheetah-research.ai/chatbot/start/';

    axios.post(url, { study_id: study_id }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((response) => {
        const data = response.data;
        hash = data.hash;

        getMessage(data.response, null);

    }).catch((error) => {
        console.log('Error:', error);
    });
}

// Función para verificar si un estudio está bloqueado en este dispositivo
function isStudyBlocked(study_id) {
    const blockKey = `study_block_${study_id}`;
    const blockData = localStorage.getItem(blockKey);
    
    if (!blockData) {
        return false; // No hay bloqueo
    }
    
    try {
        const { timestamp } = JSON.parse(blockData);
        const now = new Date().getTime();
        const blockDurationInMs = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
        
        // Verificar si han pasado los días configurados
        if (now - timestamp >= blockDurationInMs) {
            // Ya pasó el tiempo, eliminar el bloqueo
            localStorage.removeItem(blockKey);
            return false;
        }
        
        // Aún no ha pasado el tiempo
        return true;
    } catch (error) {
        console.error('Error al verificar bloqueo:', error);
        // Si hay error parseando, eliminar el dato corrupto
        localStorage.removeItem(blockKey);
        return false;
    }
}

// Función para bloquear un estudio en este dispositivo
function blockStudy(study_id) {
    const blockKey = `study_block_${study_id}`;
    const blockData = {
        timestamp: new Date().getTime(),
        study_id: study_id
    };
    localStorage.setItem(blockKey, JSON.stringify(blockData));
}

// Función para obtener el tiempo restante de bloqueo
function getRemainingBlockTime(study_id) {
    const blockKey = `study_block_${study_id}`;
    const blockData = localStorage.getItem(blockKey);
    
    if (!blockData) {
        return 0;
    }
    
    try {
        const { timestamp } = JSON.parse(blockData);
        const now = new Date().getTime();
        const blockDurationInMs = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
        const elapsed = now - timestamp;
        const remaining = blockDurationInMs - elapsed;
        
        return remaining > 0 ? remaining : 0;
    } catch (error) {
        return 0;
    }
}

// Función para formatear tiempo restante en formato legible
function formatRemainingTime(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days} día${days > 1 ? 's' : ''} y ${remainingHours} hora${remainingHours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hora${hours !== 1 ? 's' : ''} y ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
}

function verificarLink(study_id) {
    const VerifURL = 'https://api.cheetah-research.ai/configuration/info_study/' + study_id;
    
    return axios.get(VerifURL)
        .then(response => {
            // console.log(response.data);
            const data = response.data;
            let studyStatus = data.studyStatus;
            
            // Verificar primero el estado del estudio
            if(studyStatus == 0) {
                return { available: false, reason: 'status' };
            } else if(studyStatus == 2) {
                return { available: false, reason: 'status' };
            }
            
            // Verificar isKiosk
            if (data.isKiosk === true) {
                // Si es true, la encuesta se hace con normalidad sin bloqueo
                shouldBlockAfterCompletion = false;
                return { available: true, reason: 'kiosk' };
            } else if (data.isKiosk === false) {
                // Si es false, verificar si está bloqueado en este dispositivo
                if (isStudyBlocked(study_id)) {
                    // Ya está bloqueado, no se puede hacer
                    const remainingTime = getRemainingBlockTime(study_id);
                    shouldBlockAfterCompletion = false;
                    return { 
                        available: false, 
                        reason: 'blocked',
                        remainingTime: remainingTime 
                    };
                } else {
                    // No está bloqueado, PERMITIR ENTRAR pero marcar para bloquear al terminar
                    shouldBlockAfterCompletion = true;
                    return { 
                        available: true, 
                        reason: 'non-kiosk',
                        willBlockAfter: true 
                    };
                }
            }
            
            // Si isKiosk no está definido, permitir por defecto (compatibilidad)
            shouldBlockAfterCompletion = false;
            return { available: true, reason: 'default' };
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            return { available: false, reason: 'error' };
        });
}


//Función Cargar Entrevistador
async function loadInterviewer(study_id) {
    const verificacion = await verificarLink(study_id);

    if (verificacion.available) {
        const url = "https://api.cheetah-research.ai/configuration/getInterviewer/";

        axios.post(url, { study_id: study_id }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
            const data = response.data;
            const nombre = data.interviewerName;
            imgPP = data.interviewerProfilePicture;

            document.getElementById('Bot-Name').innerText = nombre;
            const formContainer = document.createElement('div');

            // Determinar el texto del botón según el idioma del estudio
            const buttonText = isEnglishStudy(study_id) ? 'Start Chat' : 'Iniciar Chat';
            
            formContainer.innerHTML = `
            <div id="overlayContent" class="text-wrap">
                <img src="${imgPP}" alt="Imagen del encuestador" style="width: 100px; height: 100px; border-radius: 50%;">
                <p id="greeting">
                ${data.interviewerGreeting}
                </p>
                <button id="AceptarChat" class="btn" style="margin: 10px 10px 0 0;background: var(--bs-CR-black);">${buttonText}</button>
            </div>
            `;

            // Imagen del Bot para Espera de Respuesta
            const TM_BotIMG = document.getElementById('typingMessage_BotIMG');
            TM_BotIMG.src = imgPP;

            document.getElementById('overlay').innerHTML = formContainer.innerHTML;

            document.getElementById('AceptarChat').addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('overlay').style.display = 'none';
                load(study_id);
            });

        }).catch(error => {
            console.error(error);
        });
    } else {
        const formContainer = document.createElement('div');
        let unavailableMessage;
        let messageIcon = '⚠️';
        
        // Determinar el mensaje según la razón del bloqueo
        if (verificacion.reason === 'blocked') {
            // Ya está bloqueado
            messageIcon = '🚫';
            
            if (isEnglishStudy(study_id)) {
                unavailableMessage = `You have already completed this survey from this device.`;
            } else {
                unavailableMessage = `Ya has completado esta encuesta desde este dispositivo.`;
            }
        } else {
            // Razón de status o error
            if (isEnglishStudy(study_id)) {
                unavailableMessage = `It seems the link is no longer available. If you need to access this information, don't hesitate to contact us, we're here to help you resolve it!`;
            } else {
                unavailableMessage = `Parece que el enlace ya no está disponible. Si necesitas acceder a esta información, no dudes en contactarnos, ¡estamos aquí para ayudarte a resolverlo!`;
            }
        }
        
        formContainer.innerHTML = `
            <div id="overlayContent" class="text-wrap" style="text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">${messageIcon}</div>
                <p style="font-size: 16px; line-height: 1.5;">${unavailableMessage}</p>
            </div>
        `;

        document.getElementById('overlay').innerHTML = formContainer.innerHTML;
    }
}


//Función para deshabilitar Chat al terminarlo
function endChat() {
    const study_id = new URLSearchParams(window.location.search).get('id');
    const messageInput = document.getElementById("Message-Input");
    const loadingMsg = document.getElementById("Typing-Msg");
    const btSend = document.getElementById("btSend");
    const btIMG = document.getElementById("btIMG");

    // Mostrar placeholder en inglés o español según el estudio
    if (isEnglishStudy(study_id)) {
        messageInput.placeholder = "Thanks for responding!";
    } else {
        messageInput.placeholder = "¡Gracias por responder!";
    }
    
    loadingMsg.style.display = 'none';
    messageInput.disabled = true;
    btSend.disabled = true;
    btIMG.disabled = true;

    messageInput.parentElement.style.background = 'transparent';
    messageInput.style.background = 'transparent';
    messageInput.style.boxShadow = 'none';
    btSend.style.color = 'var(--bs-CR-gray)';
    btIMG.style.color = 'var(--bs-CR-gray)';
}
