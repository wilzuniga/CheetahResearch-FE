document.addEventListener('DOMContentLoaded', () => {
    const agregarPreguntaBtn = document.getElementById('AgregarPreguntaBtn');
    const preguntaTXT = document.getElementById('PreguntaTXT');
    const pesoTXT = document.getElementById('PesoTXT');
    const anexoPregunta = document.getElementById('AnexoPregunta');
    const anexoPreguntaURL = document.getElementById('AnexoPreguntaURL');
    const preguntaLST = document.getElementById('PreguntaLST');
    const pesoLST = document.getElementById('PesoLST');
    const anexoLST = document.getElementById('AnexoLST');
    const listGroup = document.querySelector('.list-group');

    agregarPreguntaBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        const pregunta = preguntaTXT.value;
        const peso = pesoTXT.value;
        const anexo = anexoPregunta.files.length > 0 ? anexoPregunta.files[0].name : anexoPreguntaURL.value;

        if (pregunta && peso) {
            const newListItem = document.createElement('a');
            newListItem.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
            newListItem.href = '#';
            newListItem.style.fontFamily = "'IBM Plex Sans', sans-serif";

            const newDiv = document.createElement('div');
            newDiv.classList.add('d-flex', 'w-100', 'justify-content-between');
            newDiv.style.fontFamily = "'IBM Plex Sans', sans-serif";

            const newH5 = document.createElement('h5');
            newH5.classList.add('mb-1');
            newH5.style.fontFamily = "'IBM Plex Sans', sans-serif";
            newH5.textContent = pregunta;

            const newSpan = document.createElement('span');
            newSpan.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
            newSpan.style.fontFamily = "'IBM Plex Sans', sans-serif";
            newSpan.textContent = peso;

            const newSmall = document.createElement('small');
            newSmall.classList.add('text-muted');
            newSmall.style.fontFamily = "'IBM Plex Sans', sans-serif";
            newSmall.textContent = anexo;

            newDiv.appendChild(newH5);
            newDiv.appendChild(newSpan);
            newListItem.appendChild(newDiv);
            newListItem.appendChild(newSmall);
            listGroup.appendChild(newListItem);

            // Clear input fields
            preguntaTXT.value = '';
            pesoTXT.value = '';
            anexoPregunta.value = '';
            anexoPreguntaURL.value = '';
        } else {
            alert('Por favor, ingresa tanto la pregunta como el peso.');
        }
    });
});


function guardarPreguntas() {
    const listItems = document.querySelectorAll('.list-group-item');
    const preguntas = [];

    const formData = new FormData();

    listItems.forEach((item, index) => {
        const question = item.querySelector('h5').textContent;
        const weight = item.querySelector('span').textContent;
        let url;

        if (item.querySelector('small').textContent !== '') {
            url = item.querySelector('small').textContent;
        } else {
            url = '';
        }

        // Supongamos que tienes un input file en cada item para subir archivos
        const fileInput = item.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
            formData.append(index, fileInput.files[0]);
        }

        //FEEDBACKQUESTIONS aca se guarda un arreglo con las preguntas de seguimiento
        const followUpQuestions = item.querySelector('ul').children;
        const feedback_questions = [];
        for (let i = 0; i < followUpQuestions.length; i++) {
            feedback_questions.push(followUpQuestions[i].textContent);
            console.log(followUpQuestions[i].textContent);
        }

        preguntas.push({
            question,
            url,
            weight,
            feedback_questions,
        });
    });

    console.log(preguntas) ;
    formData.append('questions', JSON.stringify(preguntas));
    
    const url = 'http://ec2-44-203-206-68.compute-1.amazonaws.com/createQuestion/' + localStorage.getItem('selectedStudyId') + '/' ;

    axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });

    // GUARDAR ENLOCAL STORAGE
    localStorage.setItem('preguntas', JSON.stringify(preguntas));       


    return preguntas;
}


function disableNavItems() {
    const navItems = [
        'LanzarEncuestaLNK',
        'VisualizacionDeResultadosLNK'
        ];

    navItems.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('disabled');
        }
    });
}

function enableNavItems() {
    const navItems = [
        'LanzarEncuestaLNK',
        ];

    navItems.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('disabled');
            element.classList.add('enabled');
        }
    });
}

function CE_DeactivateNavBy(){
    if(localStorage.getItem('preguntas') != null){
        //AGREGAR PREGUNTAS AL LISTADO DE PREGUNTAS
        const preguntas = JSON.parse(localStorage.getItem('preguntas'));
        const listGroup = document.querySelector('.list-group');

        preguntas.forEach((pregunta, index) => {

            const newListItem = document.createElement('div');
            newListItem.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
            newListItem.style.fontFamily = "'IBM Plex Sans', sans-serif";
            
            const newDiv = document.createElement('div');
            newDiv.classList.add('d-flex', 'w-100', 'justify-content-between');

            const newH5 = document.createElement('h5');
            newH5.classList.add('mb-1');
            newH5.textContent = pregunta.question;

            const newSpan = document.createElement('span');
            newSpan.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
            newSpan.textContent = pregunta.weight;

            const newSmall = document.createElement('small');
            newSmall.classList.add('text-muted');
            newSmall.textContent = pregunta.url;

            const followQuestionList = document.createElement('ul');
            followQuestionList.style.color = '#000000';
            followQuestionList.id = 'FollowQuestionList';

            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.marginTop = '10px';

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.innerText = 'Eliminar';
            eliminarBtn.style.marginRight = '10px';
            eliminarBtn.addEventListener('click', () => {
                newListItem.remove();
            });
            buttonsDiv.appendChild(eliminarBtn);

            const addFollowQuestionBTN = document.createElement('button');
            addFollowQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
            addFollowQuestionBTN.innerText = 'Agregar pregunta de Seguimiento';
            addFollowQuestionBTN.style.marginRight = '10px';
            buttonsDiv.appendChild(addFollowQuestionBTN);

            newDiv.appendChild(newH5);
            newDiv.appendChild(newSpan);
            newListItem.appendChild(newDiv);
            newListItem.appendChild(followQuestionList);
            newListItem.appendChild(newSmall);
            newListItem.appendChild(buttonsDiv);

            listGroup.appendChild(newListItem);

            pregunta.feedback_questions.forEach((followUpQuestion) => {
                const listItem = document.createElement('li');
                listItem.textContent = followUpQuestion;
                followQuestionList.appendChild(listItem);
            });

            addFollowQuestionBTN.addEventListener('click', (event) => {

                event.preventDefault();  // Prevent the default form submit behavior

                const overlay = document.getElementById('overlay');
                overlay.innerHTML = `
                    <div id="overlayContent">
                        <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta de seguimiento" style="width: 100%; font-family: 'IBM Plex Sans', sans-serif;" />
                        <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0;">Agregar pregunta</button>
                        <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;">Cerrar</button>
                    </div>
                `;

                // Mostrar el overlay
                overlay.style.display = 'flex';

                // Añadir evento para cerrar el overlay
                document.getElementById('CerrarOverlay').addEventListener('click', () => {
                    overlay.style.display = 'none'; // Ocultar el overlay
                });

                // Añadir evento para agregar la pregunta de seguimiento
                document.getElementById('AgregarPreguntaOverlay').addEventListener('click', () => {
                    const followUpQuestion = document.getElementById('FollowUpQuestionTXT').value;
                    if (followUpQuestion) {
                        const listItem = document.createElement('li');
                        listItem.textContent = followUpQuestion;
                        followQuestionList.appendChild(listItem);
                        document.getElementById('FollowUpQuestionTXT').value = ''; // Limpiar el campo de texto
                        overlay.style.display = 'none'; // Ocultar el overlay
                    } else {
                        alert('Por favor, ingresa una pregunta de seguimiento.');
                    }
                });
            }
            );

        });
        console.log('Preguntas guardadas');
        enableNavItems();
    }else{
        console.log('No hay preguntas guardadas');
        disableNavItems();
    }
}

document.getElementById('GuardarEncuestaBtn').addEventListener('click', (event) => {
    event.preventDefault();
    if(guardarPreguntas().length === 0){
        alert('Por favor, agrega al menos una pregunta antes de guardar la encuesta.');
        return;
    }else{
        console.log('Guardando preguntas');
        CE_DeactivateNavBy();
    }
    alert('Encuesta guardada exitosamente');

});