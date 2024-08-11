let questions = [];
let questionsImg = [];

document.addEventListener('DOMContentLoaded', () => {
    const agregarPreguntaBtn = document.getElementById('AgregarPreguntaBtn');
    const preguntaTXT = document.getElementById('PreguntaTXT');
    const pesoTXT = document.getElementById('PesoTXT');
    const anexoPregunta = document.getElementById('AnexoPregunta');
    const anexoPreguntaURL = document.getElementById('AnexoPreguntaURL');
    const listGroup = document.querySelector('.list-group');

    let isEditing = false;
    let currentListItem = null;

    agregarPreguntaBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const pregunta = preguntaTXT.value;
        const peso = pesoTXT.value;
        const anexo = anexoPregunta.files.length > 0 ? anexoPregunta.files[0].name : anexoPreguntaURL.value;

        if (pregunta && peso) {
            if (isEditing && currentListItem) {
                // Actualizar la pregunta existente en la interfaz
                const newH5 = currentListItem.querySelector('h5');
                const newSpan = currentListItem.querySelector('span');
                const newSmall = currentListItem.querySelector('small');

                newH5.textContent = pregunta;
                newSpan.textContent = peso;
                newSmall.textContent = anexo;

                // Actualizar la pregunta en el array de preguntas si es necesario
                const index = Array.from(listGroup.children).indexOf(currentListItem);
                questions[index].question = pregunta;
                questions[index].weight = peso;
                if (anexoPregunta.files.length > 0) {
                    questions[index].url = '';
                    questionsImg[index].file = anexoPregunta.files[0];
                } else {
                    questions[index].url = anexo;
                }

                agregarPreguntaBtn.innerText = 'Agregar pregunta';
                isEditing = false;
                currentListItem = null;
            } else {
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
                newSmall.textContent = anexo;

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

                const editarBtn = document.createElement('button');
                editarBtn.classList.add('btn', 'btn-warning', 'btn-sm');
                editarBtn.innerText = 'Editar';
                editarBtn.style.marginRight = '10px';
                editarBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    preguntaTXT.value = pregunta;
                    pesoTXT.value = peso;
                    anexoPreguntaURL.value = anexo;

                    agregarPreguntaBtn.innerText = 'Actualizar pregunta';
                    isEditing = true;
                    currentListItem = newListItem;
                });
                buttonsDiv.appendChild(editarBtn);

                const addFollowQuestionBTN = document.createElement('button');
                addFollowQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
                addFollowQuestionBTN.innerText = 'Agregar pregunta de Seguimiento';
                addFollowQuestionBTN.style.marginRight = '10px';
                addFollowQuestionBTN.addEventListener('click', (event) => {
                    event.preventDefault();  // Prevent the default form submit behavior

                    const overlay = document.getElementById('overlay');
                    overlay.innerHTML = `
                        <div id="overlayContent">
                            <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta de seguimiento" style="width: 100%; font-family: hedliner;" />
                            <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0;font-family: hedliner ">Agregar pregunta</button>
                            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner">Cerrar</button>
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
    //agarrar las preguntas del listado para ver si tienen preguntas de seguimiento y guardarlas en el array de preguntas en la pregunta correspondiente siendo que existen la misma cantidad en las dos cosas. 

    const listGroup = document.querySelector('.list-group');    
    const listItems = listGroup.querySelectorAll('.list-group-item');

    listItems.forEach((listItem, index) => {
        const followQuestionList = listItem.querySelector('#FollowQuestionList');
        const followQuestions = followQuestionList.querySelectorAll('li');
        if(followQuestions.length === 0){

        }else{
            const pregunta = questions[index];
            pregunta.feedback_questions = [];

            followQuestions.forEach((followQuestion) => {
                pregunta.feedback_questions.push(followQuestion.textContent);
            });
        }
    }
    );

    enviarDatos(questions);
    console.log(questions);
    questions = [];
    questionsImg = [];;
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
    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;
    questions = [];

    const url = 'https://api.cheetah-research.ai/configuration/get_survey/' + localStorage.getItem('selectedStudyId') ;
    axios.get(url)
    .then(response => {
        console.log(response.data);
        response.data.questions.forEach((pregunta) => {
            questions.push(pregunta);
        });

        if(questions.length > 0){
            //AGREGAR PREGUNTAS AL LISTADO DE PREGUNTAS
            console.log("pregunta entra 11");

            const listGroup = document.querySelector('.list-group');

            listGroup.innerHTML = '';

            questions.forEach((pregunta, index) => {
                console.log("pregunta entra");

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

                const editQuestionBTN = document.createElement('button');
                editQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
                editQuestionBTN.innerText = 'Editar pregunta';
                editQuestionBTN.style.marginRight = '10px';
                buttonsDiv.appendChild(editQuestionBTN);

                newDiv.appendChild(newH5);
                newDiv.appendChild(newSpan);
                newListItem.appendChild(newDiv);
                newListItem.appendChild(followQuestionList);
                newListItem.appendChild(newSmall);
                newListItem.appendChild(buttonsDiv);

                listGroup.appendChild(newListItem);

                if(pregunta.feedback_questions != null){

                    feedback_questions_add = pregunta.feedback_questions;
                    feedback_questions_add.forEach((followUpQuestion) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = followUpQuestion;
                        followQuestionList.appendChild(listItem);
                    });

                }

                addFollowQuestionBTN.addEventListener('click', (event) => {

                    event.preventDefault();  // Prevent the default form submit behavior

                    const overlay = document.getElementById('overlay');
                    overlay.innerHTML = `
                        <div id="overlayContent">
                            <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta de seguimiento" style="width: 100%; font-family: hedliner;" />
                            <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0; font-family: hedliner">Agregar pregunta</button>
                            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner" ">Cerrar</button>
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

                editQuestionBTN.addEventListener('click', (event) => {
                    event.preventDefault();  // Prevent the default form submit behavior

                    const overlay = document.getElementById('overlay');
                    overlay.innerHTML = `
                        <div id="overlayContent">
                            <input id="EditQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta" style="width: 100%; font-family: hedliner;" value="${newH5.textContent}" />
                            <button id="EditarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0; font-family: hedliner">Editar pregunta</button>
                            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner" ">Cerrar</button>
                        </div>
                    `;

                    // Mostrar el overlay
                    overlay.style.display = 'flex';

                    // Añadir evento para cerrar el overlay
                    document.getElementById('CerrarOverlay').addEventListener('click', () => {
                        overlay.style.display = 'none'; // Ocultar el overlay
                    });

                    // Añadir evento para editar la pregunta
                    document.getElementById('EditarPreguntaOverlay').addEventListener('click', () => {
                        const editedQuestion = document.getElementById('EditQuestionTXT').value;
                        if (editedQuestion) {
                            newH5.textContent = editedQuestion;
                            document.getElementById('EditQuestionTXT').value = ''; // Limpiar el campo de texto
                            overlay.style.display = 'none'; // Ocultar el overlay
                        } else {
                            alert('Por favor, ingresa una pregunta.');
                        }
                    });
                });

            });
            console.log('Preguntas guardadas');
            enableNavItems();
        }else{
            console.log('No hay preguntas guardadas');
            disableNavItems();
        }
    }
    )
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
}

document.getElementById('GuardarEncuestaBtn').addEventListener('click', (event) => {
    event.preventDefault();
    guardarPreguntas(); 
    alert('Encuesta guardada exitosamente');

});