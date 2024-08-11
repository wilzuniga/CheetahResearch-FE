let questions = [];
let questionsImg = [];

document.addEventListener('DOMContentLoaded', () => {
    const agregarPreguntaBtn = document.getElementById('AgregarPreguntaBtn');
    const preguntaTXT = document.getElementById('PreguntaTXT');
    const pesoTXT = document.getElementById('PesoTXT');
    const anexoPregunta = document.getElementById('AnexoPregunta');
    const anexoPreguntaURL = document.getElementById('AnexoPreguntaURL');
    const listGroup = document.querySelector('.list-group');

    agregarPreguntaBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const pregunta = preguntaTXT.value;
        const peso = pesoTXT.value;
        const anexo = anexoPregunta.files.length > 0 ? anexoPregunta.files[0].name : anexoPreguntaURL.value;

        if (pregunta && peso) {
            // Agregar una nueva pregunta
            const newListItem = document.createElement('div');
            newListItem.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
            newListItem.style.fontFamily = "hedliner";

            const newDiv = document.createElement('div');
            newDiv.classList.add('d-flex', 'w-100', 'justify-content-between');
            newDiv.style.fontFamily = "hedliner";

            const newH5 = document.createElement('h5');
            newH5.classList.add('mb-1');
            newH5.style.fontFamily = "IBM Plex Sans";
            newH5.textContent = pregunta;

            const newSpan = document.createElement('span');
            newSpan.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
            newSpan.style.fontFamily = "hedliner";
            newSpan.textContent = peso;

            const newSmall = document.createElement('small');
            newSmall.classList.add('text-muted');
            newSmall.style.fontFamily = "hedliner";
            newSmall.textContent = anexo || 'No tiene anexo';

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
                const index = Array.from(listGroup.children).indexOf(newListItem);
                questions.splice(index, 1);
                questionsImg = questionsImg.filter(img => img.index !== index);
            });
            buttonsDiv.appendChild(eliminarBtn);

            const editarBtn = document.createElement('button');
            editarBtn.classList.add('btn', 'btn-warning', 'btn-sm');
            editarBtn.innerText = 'Editar';
            editarBtn.style.marginRight = '10px';
            editarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const index = Array.from(listGroup.children).indexOf(newListItem);
                const preguntaActual = questions[index];
                editarPregunta(preguntaActual, newListItem);
            });
            buttonsDiv.appendChild(editarBtn);

            const addFollowQuestionBTN = document.createElement('button');
            addFollowQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
            addFollowQuestionBTN.innerText = 'Agregar pregunta de Seguimiento';
            addFollowQuestionBTN.style.marginRight = '10px';
            addFollowQuestionBTN.addEventListener('click', (event) => {
                event.preventDefault();
                agregarPreguntaSeguimiento(followQuestionList);
            });
            buttonsDiv.appendChild(addFollowQuestionBTN);

            newDiv.appendChild(newH5);
            newDiv.appendChild(newSpan);
            newListItem.appendChild(newDiv);
            newListItem.appendChild(followQuestionList);
            newListItem.appendChild(newSmall);
            newListItem.appendChild(buttonsDiv);

            listGroup.appendChild(newListItem);

            // Añadir la pregunta al array
            if (anexoPregunta.files.length > 0) {
                const file = anexoPregunta.files[0];
                questions.push({ question: pregunta, weight: peso });
                questionsImg.push({ index: questions.length - 1, file: file });
            } else {
                if (anexoPreguntaURL.value != '') {
                    questions.push({ question: pregunta, weight: peso, url: anexo });
                } else {
                    questions.push({ question: pregunta, weight: peso });
                }
            }

            // Limpiar campos de entrada
            preguntaTXT.value = '';
            pesoTXT.value = '';
            anexoPreguntaURL.value = '';
            anexoPregunta.value = '';
        } else {
            alert('Por favor, ingresa tanto la pregunta como el peso.');
        }
    });
});







function guardarPreguntas() {
    const listGroup = document.querySelector('.list-group');    
    const listItems = listGroup.querySelectorAll('.list-group-item');

    listItems.forEach((listItem, index) => {
        const followQuestionList = listItem.querySelector(`#FollowQuestionList_${index}`);
        const followQuestions = followQuestionList.querySelectorAll('li');

        const pregunta = questions[index];
        pregunta.feedback_questions = [];

        followQuestions.forEach((followQuestion) => {
            pregunta.feedback_questions.push(followQuestion.textContent);
        });
    });

    enviarDatos(pregunta);
    console.log(pregunta);
    questions = [];
    questionsImg = [];
}


function enviarDatos(preguntas) {
    const formData = new FormData();
    formData.append('questions', JSON.stringify(preguntas));
    questionsImg.forEach((questionImg) => {
        //formData.append(1, file1); // Archivo asociado a la pregunta con id 1 
        formData.append(questionImg.index + 1, questionImg.file);
    });

    const url = 'https://api.cheetah-research.ai/configuration/createQuestion/' + localStorage.getItem('selectedStudyId') + '/';

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

}



function disableNavItems() {

}

function enableNavItems() {
}

function CE_DeactivateNavBy() {
    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    let isEditing = false;
    let currentListItem = null;

    // Definir los elementos aquí
    const preguntaTXT = document.getElementById('PreguntaTXT');
    const pesoTXT = document.getElementById('PesoTXT');
    const anexoPreguntaURL = document.getElementById('AnexoPreguntaURL');
    const agregarPreguntaBtn = document.getElementById('AgregarPreguntaBtn');
    const listGroup = document.querySelector('.list-group');

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;
    let questions = [];

    const url = 'https://api.cheetah-research.ai/configuration/get_survey/' + localStorage.getItem('selectedStudyId');
    axios.get(url)
    .then(response => {
        console.log(response.data);
        questions = response.data.questions;

        listGroup.innerHTML = ''; // Limpiar la lista antes de agregar nuevas preguntas

        if (questions.length > 0) {
            questions.forEach((pregunta, index) => {
                const newListItem = document.createElement('div');
                newListItem.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
                newListItem.style.fontFamily = "hedliner";

                const newDiv = document.createElement('div');
                newDiv.classList.add('d-flex', 'w-100', 'justify-content-between');

                const newH5 = document.createElement('h5');
                newH5.classList.add('mb-1');
                newH5.style.fontFamily = "IBM Plex Sans";
                newH5.textContent = pregunta.question;

                const newSpan = document.createElement('span');
                newSpan.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
                newSpan.textContent = pregunta.weight;

                const newSmall = document.createElement('small');
                newSmall.classList.add('text-muted');
                newSmall.textContent = pregunta.url || 'No tiene anexo';

                const followQuestionList = document.createElement('ul');
                followQuestionList.style.color = '#000000';
                followQuestionList.id = `FollowQuestionList_${index}`;

                const buttonsDiv = document.createElement('div');
                buttonsDiv.style.marginTop = '10px';

                // Botón de eliminar
                const eliminarBtn = document.createElement('button');
                eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                eliminarBtn.innerText = 'Eliminar';
                eliminarBtn.style.marginRight = '10px';
                eliminarBtn.addEventListener('click', () => {
                    newListItem.remove();
                    // Eliminar la pregunta del array
                    questions.splice(index, 1);
                });
                buttonsDiv.appendChild(eliminarBtn);

                // Botón de editar
                const editarBtn = document.createElement('button');
                editarBtn.classList.add('btn', 'btn-warning', 'btn-sm');
                editarBtn.innerText = 'Editar';
                editarBtn.style.marginRight = '10px';
                editarBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    editarPregunta(pregunta, newListItem);
                });
                buttonsDiv.appendChild(editarBtn);

                // Botón de agregar pregunta de seguimiento
                const addFollowQuestionBTN = document.createElement('button');
                addFollowQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
                addFollowQuestionBTN.innerText = 'Agregar pregunta de Seguimiento';
                addFollowQuestionBTN.style.marginRight = '10px';
                addFollowQuestionBTN.addEventListener('click', (event) => {
                    event.preventDefault();
                    agregarPreguntaSeguimiento(followQuestionList);
                });
                buttonsDiv.appendChild(addFollowQuestionBTN);

                newDiv.appendChild(newH5);
                newDiv.appendChild(newSpan);
                newListItem.appendChild(newDiv);
                newListItem.appendChild(followQuestionList);
                newListItem.appendChild(newSmall);
                newListItem.appendChild(buttonsDiv);

                listGroup.appendChild(newListItem);

                if (pregunta.feedback_questions) {
                    pregunta.feedback_questions.forEach((followUpQuestion) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = followUpQuestion;
                        followQuestionList.appendChild(listItem);
                    });
                }
            });
            console.log('Preguntas guardadas');
            enableNavItems();
        } else {
            console.log('No hay preguntas guardadas');
            disableNavItems();
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
}

function editarPregunta(pregunta, listItem) {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
        <div id="overlayContent">
            <input id="EditPreguntaTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta" value="${pregunta.question}" style="width: 100%; font-family: hedliner;" />
            <input id="EditPesoTXT" class="form-control" type="number" name="Peso" placeholder="Ingresa el peso" value="${pregunta.weight}" style="width: 100%; font-family: hedliner;" />
            <input id="EditAnexoPreguntaURL" class="form-control" type="text" name="Anexo" placeholder="Ingresa el enlace (opcional)" value="${pregunta.url || ''}" style="width: 100%; font-family: hedliner;" />
            <button id="ActualizarPreguntaBtn" class="btn btn-primary" style="margin: 10px 10px 0 0; font-family: hedliner">Actualizar pregunta</button>
            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0; font-family: hedliner">Cerrar</button>
        </div>
    `;

    overlay.style.display = 'flex';

    document.getElementById('CerrarOverlay').addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    document.getElementById('ActualizarPreguntaBtn').addEventListener('click', () => {
        const updatedQuestion = document.getElementById('EditPreguntaTXT').value;
        const updatedWeight = document.getElementById('EditPesoTXT').value;
        const updatedURL = document.getElementById('EditAnexoPreguntaURL').value || null;

        if (updatedQuestion) {
            listItem.querySelector('h5').textContent = updatedQuestion;
            listItem.querySelector('span').textContent = updatedWeight;
            listItem.querySelector('small').textContent = updatedURL ? updatedURL : 'No tiene anexo';
            // Actualizar la pregunta en el array
            const index = Array.from(listItem.parentElement.children).indexOf(listItem);
            questions[index] = { ...questions[index], question: updatedQuestion, weight: updatedWeight, url: updatedURL };
            overlay.style.display = 'none';
        } else {
            alert('Por favor, ingresa una pregunta.');
        }
    });
}

function agregarPreguntaSeguimiento(followQuestionList) {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
        <div id="overlayContent">
            <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta de seguimiento" style="width: 100%; font-family: hedliner;" />
            <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0; font-family: hedliner">Agregar pregunta</button>
            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0; font-family: hedliner">Cerrar</button>
        </div>
    `;

    overlay.style.display = 'flex';

    document.getElementById('CerrarOverlay').addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    document.getElementById('AgregarPreguntaOverlay').addEventListener('click', () => {
        const followUpQuestion = document.getElementById('FollowUpQuestionTXT').value;
        if (followUpQuestion) {
            const listItem = document.createElement('li');
            listItem.textContent = followUpQuestion;
            followQuestionList.appendChild(listItem);
            document.getElementById('FollowUpQuestionTXT').value = '';
            overlay.style.display = 'none';
        } else {
            alert('Por favor, ingresa una pregunta de seguimiento.');
        }
    });
}




document.getElementById('GuardarEncuestaBtn').addEventListener('click', (event) => {
    event.preventDefault();
    guardarPreguntas(); 
    alert('Encuesta guardada exitosamente');

});