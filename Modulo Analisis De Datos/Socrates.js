let imgPP;
let hash = 0;

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
                this.value = '';
                imageInput.src = '';
                imageIcon.style.display = 'flex';
                imageInput.style.display = 'none';
            } else {
                sendMessage(message, null);
                this.value = '';
            }
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
            messageInput.value = '';
            imageInput.src = '';
            imageIcon.style.display = 'flex';
            imageInput.style.display = 'none';
        } else {
            sendMessage(message, null);
            messageInput.value = '';
        }
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
    // let messages = localStorage.getItem('preguntas');
    // let preguntasArreglo = JSON.parse(messages);
    // let sendApi = preguntasArreglo[contador] + '|' + message;
    // contaWeight++;

    //Variables para display de Espera de Respuesta
    let loadingGif = document.getElementById('LoadingGif');
    let loadingMsg = document.getElementById('Typing-Msg');

    //Crear mensaje (formato de Entrevistado)
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
    card.style.borderColor = '#BDC3C9';
    card.style.background = 'var(--bs-CR-white)';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body text-break text-center d-flex flex-column p-2';

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
    h4.style.fontFamily = "'League Spartan', sans-serif";
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

    //Procesar y Enviar Respuesta como Encuestador
    const url = 'https://api.cheetah-research.ai/analysis/communicateS/';

    axios.post(url, { prompt: message, hash: hash }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((response) => {
        const data = response.data;
        if (data.response.includes('LISTO')) {
            const farewellMessage = `Hola,
            \n\nGracias por tomarte el tiempo para completar nuestra encuesta. Tus respuestas son muy valiosas para nosotros y nos ayudarán a mejorar nuestros servicios.
            \n\nSi tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.
            \n\n¡Que tengas un excelente día!]`;

            getMessage(farewellMessage, null);
            loadingMsg.style.display = 'none';
        } else {
            
            getMessage(data.response, null);
            loadingMsg.style.display = 'none';
            console.log(data);
        }

    }).catch((error) => {
        console.log('Error:', error);
    });

    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //     }
    // }).then((response) => {
    //     const data = response.data;
    //     console.log(data);
    //     localStorage.setItem('preguntaAtcual', response.data.response);

    //     let messageeee = localStorage.getItem('preguntaAtcual')
    //     if (contaWeight == 3) {
    //         contador++;
    //         contaWeight = 0;
    //         getMessage(messageeee, null);
    //     }else{
    //         if (messageeee.includes(preguntasArreglo[contador])) {
    //             console.log('pregunta', preguntasArreglo[contador]);
    //             let messageeee = preguntasArreglo[contador];
    //             getMessage(messageeee, null);
    //         }else{
    //             getMessage(messageeee, null);
    //         }
    //     }

    // }).catch((error) => {
    //     console.log('Error:', error);
    // });
}

//Función para recibir un mensaje de encuestador
function getMessage(message, imageSrc) {
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
    card.style.borderColor = '#C2681A';
    card.style.background = 'var(--bs-CR-orange-2)';

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
    p.className = 'text-break text-start d-flex order-2 card-text';
    p.style.color = '#f0f0f0';
    p.style.fontFamily = "'IBM Plex Sans', sans-serif";
    p.style.marginBottom = "6px";
    /*
    p.textContent = message;
    p.innerHTML = message.replace(/\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));//registra el newline y espacios
    */
   //manejo del mensaje con marked
    p.innerHTML = marked(message);

    const h4 = document.createElement('h4');
    h4.className = 'd-flex align-self-start justify-content-end order-3 card-subtitle text-end';
    h4.style.marginTop = '0px';
    h4.style.color = '#555155';
    h4.style.fontFamily = "'League Spartan', sans-serif";
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

//Función Cargar Encuesta
function load() {
    const preguntas = [];
    const url = 'https://api.cheetah-research.ai/analysis/startS/';

    const study_id = new URLSearchParams(window.location.search).get('id');
    console.log(study_id);
    axios.post(url, { study_id: study_id }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((response) => {
        const data = response.data;
        hash = data.hash;

        console.log(data);

        //Bot Status - Conectado
        document.getElementById('Bot-Status').innerText = 'Conectado';

    }).catch((error) => {
        console.log('Error:', error);
    });
}

//Función Cargar Entrevistador
function loadInterviewer() {
    const nombre = 'Socrates';
    const imagen = 'assets/img/Socrates.png';
    const interviewerGreeting = `Saludos, buscador de verdades. Soy Sócrates, tu guía en este viaje hacia el conocimiento. A través del arte de la dialéctica, juntos desentrañaremos los misterios ocultos en los datos que nos rodean, pues es por medio del diálogo y la reflexión profunda que alcanzamos la verdadera sabiduría. Pregunta sin temor, y hallaremos respuestas que iluminen el camino hacia la comprensión.`;

    const formContainerI = document.getElementById('overlay');

    document.getElementById('Bot-Name').innerText = nombre;
    const formContainer = document.createElement('div');

    formContainer.innerHTML = `
        <div id="overlayContent" class="text-wrap">
            <img src="${imagen}" alt="Imagen del encuestador" style="width: 100px; height: 100px; border-radius: 50%;">
            <p id="greeting"">
            ${interviewerGreeting}
            </p>
            <button id="AceptarChat" class="btn" style="margin: 10px 10px 0 0;background: var(--bs-CR-black);">Iniciar</button>
        </div>
        `;

    imgPP = imagen;

    //Imagen del Bot para Espera de Respuesta
    let TM_BotIMG = document.getElementById('typingMessage_BotIMG');
    TM_BotIMG.src = imgPP;

    document.getElementById('overlay').innerHTML = formContainer.innerHTML;

    document.getElementById('AceptarChat').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('overlay').style.display = 'none';
        load();
    });
}


//que a la hora de cerrar la ventana pregunte si se desea salir
window.addEventListener('beforeunload', function (event) {
    // Mensaje que se mostrará en la ventana emergente
    const url = 'https://api.cheetah-research.ai/analysis/stopS/';

    axios.post(url, { hash: hash }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((response) => {
        const data = response.data;
    }).catch((error) => {
        console.log('Error:', error);
    });


    const confirmationMessage = "¿Estás seguro que deseas salir? No se guardarán los cambios.";

    // Establece el mensaje de confirmación
    (event || window.event).returnValue = confirmationMessage; // Para navegadores modernos
    return confirmationMessage; // Para navegadores más antiguos

    // Nota: Los navegadores modernos pueden ignorar el mensaje y mostrar un texto genérico.
});
