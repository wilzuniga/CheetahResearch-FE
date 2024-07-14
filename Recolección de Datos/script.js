//Enviar mensaje al presionar enter
document.getElementById('Message-Input').addEventListener('keydown', function (event) {
    const imageIcon = document.getElementById('imageIcon');
    const imageInput = document.getElementById('imageInput');

    if (!(event.key === 'Enter' && event.shiftKey) && !(event.key === 'Enter' && event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        const message = this.value.trim();
        const imageSrc = imageInput.src;

        if (message || imageSrc) {
            if (imageInput.style.display !== 'none') {
                sendMessage(message, imageSrc);
                imageInput.src = '';
                imageIcon.style.display = 'flex';
                imageInput.style.display = 'none';
                this.value = '';
            } else {
                sendMessage(message, null);
                this.value = '';
            }
        }
    }
});

//Enviar mensaje al presionar botón de enviar
document.getElementById('btSend').addEventListener('click', function () {
    const imageIcon = document.getElementById('imageIcon');
    const imageInput = document.getElementById('imageInput');
    messageInput = document.getElementById('Message-Input');
    const message = messageInput.value.trim();
    const imageSrc = imageInput.src;

    if (message || imageSrc) {
        if (imageInput.style.display !== 'none') {
            sendMessage(message, imageSrc);
            imageInput.src = '';
            imageIcon.style.display = 'flex';
            imageInput.style.display = 'none';
            messageInput.value = '';
        } else {
            sendMessage(message, null);
            messageInput.value = '';
        }
    }
});

//Recibir mensaje al presionar ctrl+enter (Función de Prueba)
document.getElementById('Message-Input').addEventListener('keydown', function (event) {
    if (!(event.key === 'Enter' && event.shiftKey) && (event.key === 'Enter' && event.ctrlKey)) {
        event.preventDefault();
        const message = this.value.trim();
        const imageSrc = imageInput.src;

        if (message || imageSrc) {
            if (imageInput.style.display !== 'none') {
                getMessage(message, imageSrc);
                imageInput.src = '';
                imageIcon.style.display = 'flex';
                imageInput.style.display = 'none';
                this.value = '';
            } else {
                getMessage(message, null);
                this.value = '';
            }
        }
    }
});

//Función enviar imagen al presionar botón de imagen
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
    const Feed = document.getElementById('Feed');//Validar Feed Vacío
    const emptyFeed = document.getElementById('Empty-Feed');
    if (Feed.style.display === 'none') {
        emptyFeed.style.display = 'none';
        Feed.style.display = 'flex';
    }

    const scrollPanel = document.getElementById('Feed-BG');
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
    li.className = 'd-flex justify-content-end my-2';

    const card = document.createElement('div');
    card.className = 'card d-inline-block';
    card.style.borderRadius = '6px';
    card.style.borderTopRightRadius = '0px';
    card.style.background = '#2e2e2e';

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
    p.className = 'fw-semibold text-start d-flex order-2 card-text';
    p.style.color = '#c0c0c0';
    p.textContent = message;
    p.innerHTML = message.replace(/\n/g, '<br>');//registra el newline

    const h6 = document.createElement('h6');
    h6.className = 'd-flex justify-content-end order-3 card-subtitle text-end';
    h6.style.fontSize = '.75rem';
    h6.style.color = '#aaaaaaa9';
    h6.textContent = new Intl.DateTimeFormat('es-419', options).format(new Date());
    h6.textContent = h6.textContent.replace('a.\u00A0m.', 'AM').replace('p.\u00A0m.', 'PM');

    cardBody.appendChild(p);
    cardBody.appendChild(h6);
    card.appendChild(cardBody);
    li.appendChild(card);
    messageList.appendChild(li);

    //Scroll automático hacia abajo cuando se envía un mensaje nuevo
    scrollPanel.scrollTop = scrollPanel.scrollHeight;
}

//Función para recibir un mensaje de encuestador
function getMessage(message, imageSrc) {
    const Feed = document.getElementById('Feed');//Validar Feed Vacío
    const emptyFeed = document.getElementById('Empty-Feed');
    if (Feed.style.display === 'none') {
        emptyFeed.style.display = 'none';
        Feed.style.display = 'flex';
    }

    const scrollPanel = document.getElementById('Feed-BG');
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
    li.className = 'd-flex my-2';

    const card = document.createElement('div');
    card.className = 'card d-inline-block';
    card.style.borderRadius = '6px';
    card.style.borderTopLeftRadius = '0px';
    card.style.background = '#2e2e2e';

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
    p.className = 'fw-semibold text-start d-flex order-2 card-text';
    p.style.color = '#c0c0c0';
    p.textContent = message;
    p.innerHTML = message.replace(/\n/g, '<br>');//registra el newline

    const h6 = document.createElement('h6');
    h6.className = 'd-flex justify-content-end order-3 card-subtitle text-end';
    h6.style.fontSize = '.75rem';
    h6.style.color = '#aaaaaaa9';
    h6.textContent = new Intl.DateTimeFormat('es-419', options).format(new Date());
    h6.textContent = h6.textContent.replace('a.\u00A0m.', 'AM').replace('p.\u00A0m.', 'PM');

    cardBody.appendChild(p);
    cardBody.appendChild(h6);
    card.appendChild(cardBody);
    li.appendChild(card);
    messageList.appendChild(li);

    //Scroll automático hacia abajo cuando se envía el mensaje nuevo
    scrollPanel.scrollTop = scrollPanel.scrollHeight;
}



