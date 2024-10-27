let imgPP;
let hash = 0;

//Función inicializar Chat
function initializePage() {
    const study_id = new URLSearchParams(window.location.search).get('id');
    if (study_id) {
        console.log('ID de estudio:', study_id);
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


    //Procesar y Enviar Respuesta como Encuestador
    const url = 'https://api.cheetah-research.ai/chatbot/communicate/';

    axios.post(url, { prompt: message, hash: hash }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((response) => {
        const data = response.data;
        if (data.response.includes('LISTO')) {
            const farewellMessage = `Gracias por tomarte el tiempo para completar nuestra encuesta. Tus respuestas son muy valiosas para nosotros y nos ayudarán a mejorar nuestros servicios.\n\nSi tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.\n\n¡Que tengas un excelente día!`;

            getMessage(farewellMessage, null);
            loadingMsg.style.display = 'none';
            const study_id = new URLSearchParams(window.location.search).get('id');
            endChat()

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

        } else {
            //eliminar todo el contenido entre [] en el mensaje
            data.response = data.response.replace(/\[.*?\]/g, '');
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
        getMessage('Lo siento, no pude entender tu respuesta. Por favor, inténtalo de nuevo.', null);
        loadingMsg.style.display = 'none';
    });
}

//Función para recibir un mensaje de encuestador
function getMessage(message, imageSrc, link) {
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
        ruta = "https://cheetahresearch.s3.amazonaws.com/" + imageSrc;
        const img = document.createElement('img');
        img.className = 'img-fluid d-flex order-1 mx-auto mb-2'
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

    const p = document.createElement('p');
    p.className = 'text-break text-start d-flex order-2 card-text';
    p.style.color = '#f0f0f0';
    p.style.marginBottom = "6px";
    p.textContent = message;
    p.innerHTML = message.replace(/\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));//registra el newline y espacios

    const h4 = document.createElement('h4');
    h4.className = 'd-flex align-self-start justify-content-end order-3 card-subtitle text-end';
    h4.style.marginTop = '0px';
    h4.style.color = '#555155';
    h4.style.fontFamily = "League Spartan";
    h4.textContent = new Intl.DateTimeFormat('es-419', options).format(new Date());
    h4.textContent = h4.textContent.replace('a.\u00A0m.', 'AM').replace('p.\u00A0m.', 'PM');

    BotIMG_Cont.appendChild(BotIMG);

    BotIMG_Div.appendChild(BotIMG_Cont);

    cardBody.appendChild(p);
    cardBody.appendChild(h4);
    card.appendChild(cardBody);

    li.appendChild(BotIMG_Div);
    li.appendChild(card);

    messageList.appendChild(li);

    //Scroll automático hacia abajo cuando se envía un mensaje nuevo
    const scrollPanel = document.getElementById('Feed-BG');
    scrollPanel.scrollTop = scrollPanel.scrollHeight;

    //Mensaje de espera de respuesta queda abajo
    let loadingMsg = document.getElementById('Typing-Msg');
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

function verificarLink() {
    const VerifURL = 'https://api.cheetah-research.ai/configuration/info_study/' + localStorage.getItem('selectedStudyId');
    
    return axios.get(VerifURL)
        .then(response => {
            console.log(response.data);
            const data = response.data;
            let studyStatus = data.studyStatus;
            
            if(studyStatus == 0) {
                document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - No Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - No Activo';
                console.log('El enlace ya no está disponible 1');
                return false;
            } else if(studyStatus == 2 || studyStatus == 3) {
                document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - No Activo';
                console.log('El enlace ya no está disponible 2');
                return false;
            } else {
                console.log('El enlace está activo');
                return true;
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            return false;
        });
}


//Función Cargar Entrevistador
function loadInterviewer(study_id) {
    console.log(verificarLink());

    if(verificarLink() ){
    
        const url = "https://api.cheetah-research.ai/configuration/getInterviewer/";

        axios.post(url, { study_id: study_id }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
            const data = response.data;
            const nombre = data.interviewerName;
            const imagen = data.interviewerProfilePicture;

            document.getElementById('Bot-Name').innerText = nombre;
            const formContainer = document.createElement('div');



            formContainer.innerHTML = `
            <div id="overlayContent" class="text-wrap">
                <img src="${data.interviewerProfilePicture}" alt="Imagen del encuestador" style="width: 100px; height: 100px; border-radius: 50%;">
                <p id="greeting">
                ${data.interviewerGreeting}
                </p>
                <button id="AceptarChat" class="btn" style="margin: 10px 10px 0 0;background: var(--bs-CR-black);">Iniciar Chat</button>
            </div>
            `;

            imgPP = data.interviewerProfilePicture;

            //Imagen del Bot para Espera de Respuesta
            let TM_BotIMG = document.getElementById('typingMessage_BotIMG');
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
    }else{
        const formContainer = document.createElement('div');
        formContainer.innerHTML = `
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

        document.getElementById('overlay').innerHTML = formContainer.innerHTML;

    }
}

//Función para deshabilitar Chat al terminarlo
function endChat() {
    const messageInput = document.getElementById("Message-Input");
    const loadingMsg = document.getElementById("Typing-Msg");
    const btSend = document.getElementById("btSend");
    const btIMG = document.getElementById("btIMG");

    messageInput.placeholder = "¡Gracias por responder!";
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
