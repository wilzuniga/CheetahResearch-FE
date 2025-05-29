let questions = [];
let defaultquestions = [];
let questionsImg = [];

document.addEventListener('DOMContentLoaded', () => {
    const studyId = localStorage.getItem('selectedStudyId');
    setColorsFromAPI(studyId);//Setea colores
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
            const newListItem = document.createElement('div');
            newListItem.classList.add('list-group-item', 'list-group-item-action', 'align-items-start');
            newListItem.style.fontFamily = "hedliner";
            newListItem.style.display = 'flex';
            newListItem.style.flexDirection = 'column';
            newListItem.style.gap = '0.5rem';

            const newDiv = document.createElement('div');
            newDiv.classList.add('d-flex', 'w-100', 'justify-content-between');
            newDiv.style.fontFamily = "hedliner";

            const newH5 = document.createElement('h5');
            newH5.classList.add('mb-1');
            newH5.style.fontFamily = "IBM Plex Sans";

            // Replace escaped newlines with actual newlines, then convert to <br> for HTML
            let unescapedQuestion = pregunta.replace(/\\n/g, '\n');
            let processedQuestion = unescapedQuestion.replace(/\n/g, '<br>');
            newH5.innerHTML = processedQuestion;

            const newSpan = document.createElement('span');
            newSpan.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
            newSpan.style.fontFamily = "hedliner";
            newSpan.style.color = 'var(--bs-CR-gray)';
            newSpan.style.backgroundColor = 'var(--bs-CR-orange)';
            newSpan.textContent = peso;

            const newSmall = document.createElement('small');
            newSmall.classList.add('text-muted');
            newSmall.style.fontFamily = "IBM Plex Sans";
            newSmall.textContent = anexo;

            const followQuestionList = document.createElement('ul');
            followQuestionList.style.color = '#000000';
            followQuestionList.id = 'FollowQuestionList';

            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.display = 'flex';
            buttonsDiv.style.marginTop = '10px';
            buttonsDiv.style.marginRight = 'auto';

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
            addFollowQuestionBTN.style.color = 'var(--bs-CR-gray)';
            addFollowQuestionBTN.style.backgroundColor = 'var(--bs-CR-orange)';
            buttonsDiv.appendChild(addFollowQuestionBTN);

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-bars');
            icon.style.fontSize = '10px';

            const dragBtn = document.createElement('button');
            dragBtn.classList.add('dragBtn', 'btn', 'btn-secondary');
            dragBtn.type = 'button';
            dragBtn.style.display = 'flex';
            dragBtn.style.width = '80px';
            dragBtn.style.height = '20px';
            dragBtn.style.alignSelf = 'center';
            dragBtn.style.padding = '0';
            dragBtn.style.justifyContent = 'center';
            dragBtn.style.alignItems = 'center';
            dragBtn.style.border = 'none';

            dragBtn.appendChild(icon);

            newDiv.appendChild(newH5);
            newDiv.appendChild(newSpan);

            newListItem.appendChild(newDiv);
            newListItem.appendChild(followQuestionList);
            newListItem.appendChild(newSmall);
            newListItem.appendChild(buttonsDiv);
            newListItem.appendChild(dragBtn);

            listGroup.appendChild(newListItem);

            //Drag & Drop: Propiedades para el boton de dragBtn
            dragBtn.addEventListener('mousedown', (event) => {
                newListItem.setAttribute('draggable', true);
            });
            
            dragBtn.addEventListener('mouseup', (event) => {
                newListItem.setAttribute('draggable', false);
            });
            
            //Drag & Drop: Anexo de propiedades a handle functions
            newListItem.addEventListener('dragstart', handleDragStart);
            newListItem.addEventListener('dragover', handleDragOver);
            newListItem.addEventListener('drop', handleDrop);
            newListItem.addEventListener('dragend', handleDragEnd);

            addFollowQuestionBTN.addEventListener('click', (event) => {
                event.preventDefault();  // Prevent the default form submit behavior

                const overlay = document.getElementById('overlay');
                overlay.innerHTML = `
                    <div id="overlayContent">
                        <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta de seguimiento" style="width: 100%; font-family: IBM Plex Sans;" />
                        <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0;font-family: hedliner; color: var(--bs-CR-gray); background-color: var(--bs-CR-orange); ">Agregar pregunta</button>
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

            //boton editar
            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-primary', 'btn-sm');
            editBtn.innerText = 'Editar';
            editBtn.style.marginRight = '10px';
            editBtn.style.color = 'var(--bs-CR-gray)';
            editBtn.style.backgroundColor = 'var(--bs-CR-orange)';
            buttonsDiv.appendChild(editBtn);

            editBtn.addEventListener('click', (event) => {
                event.preventDefault();
                const overlay = document.getElementById('overlay');
                //que en el overlay se pueda editar la pregunta, el peso y el anexo ya sea archivo o url
                overlay.innerHTML = `
                    <div id="overlayContent">
                        <input id="EditPreguntaTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <input id="EditPesoTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa el peso" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <input id="EditAnexoPregunta" class="form-control" type="file" name="Nombre" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <input id="EditAnexoPreguntaURL" class="form-control" type="text" name="Nombre" placeholder="Ingresa la URL del anexo" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <button id="GuardarEdit" class="btn btn-primary" style="margin: 10px 10px 0 0;font-family: hedliner; margin-bottom: 5px;color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);">Guardar</button>
                        <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner; margin-bottom: 5px;">Cerrar</button>
                    </div>
                `;

                // Mostrar el overlay
                overlay.style.display = 'flex';
                document.getElementById('EditPreguntaTXT').value = pregunta;
                document.getElementById('EditPesoTXT').value = peso;
                //verificar el tipo de anexo de la pregunta(archivo o url) y agregarlo al overlay
                if(anexoPregunta.files.length > 0){                    
                    document.getElementById('EditAnexoPregunta').value = anexo;
                }else if(anexoPreguntaURL.value != ''){
                    document.getElementById('EditAnexoPreguntaURL').value = anexo;
                }

                // Añadir evento para cerrar el overlay
                document.getElementById('CerrarOverlay').addEventListener('click', () => {
                    overlay.style.display = 'none'; // Ocultar el overlay
                });

                // Añadir evento para guardar los cambios
                document.getElementById('GuardarEdit').addEventListener('click', () => {
                    const editPregunta = document.getElementById('EditPreguntaTXT').value;
                    const editPeso = document.getElementById('EditPesoTXT').value;
                    const editAnexo = document.getElementById('EditAnexoPregunta').files.length > 0 ? document.getElementById('EditAnexoPregunta').files[0].name : document.getElementById('EditAnexoPreguntaURL').value;
                    if (editPregunta && editPeso) {
                        //actualizar la pregunta en el array de preguntas
                        questions[questions.length - 1].question = editPregunta;
                        questions[questions.length - 1].weight = editPeso;
                        if(editAnexo != ''){
                            if(document.getElementById('EditAnexoPregunta').files.length > 0){
                                const file = document.getElementById('EditAnexoPregunta').files[0];
                                questionsImg.push({index: questions.length - 1 , file: file});
                            }else{
                                questions[questions.length - 1].url = editAnexo;
                            }
                        }
                        //actualizar la pregunta en el listado de preguntas
                        newH5.textContent = editPregunta;
                        newSpan.textContent = editPeso;
                        newSmall.textContent = editAnexo;
                        overlay.style.display = 'none'; // Ocultar el overlay
                    } else {
                        alert('Por favor, ingresa tanto la pregunta como el peso.');
                    }
                });

            });

            //eliminar todas las preguntas de seguimiento
            const deleteFollowQuestionsBtn = document.createElement('button');
            deleteFollowQuestionsBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteFollowQuestionsBtn.innerText = 'Eliminar preguntas de seguimiento';
            deleteFollowQuestionsBtn.style.marginRight = '10px';
            buttonsDiv.appendChild(deleteFollowQuestionsBtn);

            deleteFollowQuestionsBtn.addEventListener('click', (event) => {
                event.preventDefault();
                followQuestionList.innerHTML = '';
                questions[questions.length - 1].feedback_questions = [];
            });

            
            // AGREGAR PREGUNTA AL ARRAY DE PREGUNTAS, verificar si el anexo es un archivo o una URL, en caso de ser archivo guardarlo como picture
            if(anexoPregunta.files.length > 0){
                const file = anexoPregunta.files[0];
                questions.push({ question: pregunta, weight: peso });
                //hacer push de la imagen y del index de la pregunta a un array de imagenes
                questionsImg.push({index: questions.length - 1 , file: file});
                anexoPregunta.value = '';
            }else{
                if(anexoPreguntaURL.value != ''){
                    questions.push({ question: pregunta, weight: peso, url: anexo });
                }else{
                    questions.push({ question: pregunta, weight: peso });
                }
                anexoPregunta.value = '';
            }

            preguntaTXT.value = '';
            pesoTXT.value = '';
            anexoPreguntaURL.value = '';
            
            

        } else {
            alert('Por favor, ingresa tanto la pregunta como el peso.');
        }
    });

    //Drag & Drop: handle functions
    let draggedItem = null;

    function handleDragStart(event) {
        draggedItem = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', event.target.innerHTML);
        draggedItem.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const target = event.target;
        const items = document.querySelectorAll('.list-group-item');

        //Efecto visual: Placeholder Anaranjado
        items.forEach(item => {
            if (item !== target) {
                item.classList.remove('over');
            }
        });
        if (target && target !== draggedItem && target.classList.contains('list-group-item')) {
            target.classList.add('over');
        }
    }

    function handleDrop(event) {
        event.preventDefault();

        const target = event.target;
        if (draggedItem !== target && target.classList.contains('list-group-item')) {
            const items = [...listGroup.querySelectorAll('.list-group-item')];
            const draggedIndex = items.indexOf(draggedItem);
            const targetIndex = items.indexOf(target);

            if (draggedIndex > targetIndex) {
                listGroup.insertBefore(draggedItem, target);
            } else {
                listGroup.insertBefore(draggedItem, target.nextSibling);
            }

            //Actualiza el array de preguntas
            const newQuestionsOrder = [];
            const newQuestionsImgOrder = [];
            const updatedItems = [...listGroup.querySelectorAll('.list-group-item')];
            updatedItems.forEach((item, index) => {
                const questionIndex = items.indexOf(item);
                newQuestionsOrder.push(questions[questionIndex]);
                const questionImg = questionsImg.find(img => img.index === questionIndex);
                if (questionImg) {
                    newQuestionsImgOrder.push({ index: index, file: questionImg.file });
                }
            });

            questions = newQuestionsOrder;
            questionsImg = newQuestionsImgOrder;
        }

        event.dataTransfer.clearData();
        target.classList.remove('over');
    }

    function handleDragEnd(event) {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem.setAttribute('draggable', false);

            document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('over'));
        }
    }
    //Fin Coso de Drag & Drop
});




function guardarPreguntas() {
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
    // console.log(questions);
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
        // console.log(response.data);
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });

    //formdata con el siguiente formato study_id
    const url2 = 'https://api.cheetah-research.ai/chatbot/updateLogs/' 
    const formData2 = new FormData();
    formData2.append('study_id', localStorage.getItem('selectedStudyId'));
    axios.post(url2, formData2, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log(response.data);
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });

}



function disableNavItems() {

}

function enableNavItems() {

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
    defaultquestions = [];

    const url = 'https://api.cheetah-research.ai/configuration/get_survey/' + localStorage.getItem('selectedStudyId') ;
    axios.get(url)
    .then(response => {
        console.log(response.data);
        response.data.questions.forEach((pregunta) => {
            questions.push(pregunta);
        });

        response.data.default_questions.forEach((pregunta) => {
            defaultquestions.push(pregunta);
        });
        // console.log(questions);
        /*{
    "prompt": "wjnefkwjnef",
    "test": true,
    "questions": [
        {
            "question": "rgegr",
            "weight": "5"
        }
    ],
    "default_questions": [
        {
            "question": "Hola, te entrevistaré el día de hoy. Cómo deseas que me dirija hacia ti a lo largo de esta entrevista?",
            "status": 1
        },
        {
            "question": "Para que la entrevista fluya más rápida trata de ser lo más amplio posible en sus respuestas y evita contestar solo con un \"Si, No, \" Esta bien, Esta bueno\" ya que ese tipo de respuestas me obligaran a formularte más preguntas. Estás dispuesto a continuar? Solamente contesta \"Deseo continuar\" ó \"No deseo Continuar\"",
            "status": 1
        },
        {
            "question": "Primero deseamos saber un poco mas de tu forma de pensar..... Si pudieras describir un día perfecto en tu vida, desde la mañana hasta la noche, ¿Cómo sería? Cuéntame con detalle para imaginarlo contigo",
            "status": 1
        }
    ],
    "study_id": "6837cc69ac7cba8049e77458"
}*/

        
        // console.log(defaultquestions);
        if(defaultquestions.length > 0){
            //Agregar preguntas por defecto al listado de preguntas
            // las preguntas por defecto no tienen peso ni anexo, solo se agregan al listado de preguntas
            // se pueden editar, desactivar y 
        }

        if(questions.length > 0){
            //AGREGAR PREGUNTAS AL LISTADO DE PREGUNTAS
            // console.log("pregunta entra 11");
    
            const listGroup = document.querySelector('.list-group');
            listGroup.innerHTML = '';
    
            questions.forEach((pregunta, index) => {
                // console.log("pregunta entra");
    
                const newListItem = document.createElement('div');
                newListItem.classList.add('list-group-item', 'list-group-item-action', 'align-items-start');
                newListItem.style.fontFamily = "hedliner";
                newListItem.style.display = 'flex';
                newListItem.style.flexDirection = 'column';
                newListItem.style.gap = '0.5rem';
                
                const newDiv = document.createElement('div');
                newDiv.classList.add('d-flex', 'w-100', 'justify-content-between');
    
                const newH5 = document.createElement('h5');
                newH5.classList.add('mb-1');
                newH5.style.fontFamily = "IBM Plex Sans";

                // Replace escaped newlines with actual newlines, then convert to <br> for HTML
                let unescapedQuestion = pregunta.question.replace(/\\n/g, '\n');
                let processedQuestion = unescapedQuestion.replace(/\n/g, '<br>');

                newH5.innerHTML = processedQuestion;


    
                const newSpan = document.createElement('span');
                newSpan.classList.add('badge', 'rounded-pill', 'bg-primary', 'align-self-center');
                newSpan.textContent = pregunta.weight;
                newSpan.style.color = 'var(--bs-CR-gray)';
                newSpan.style.backgroundColor = 'var(--bs-CR-orange)';
    
                //verificar si la pregunta tiene anexo, url o ninguno y agregarlo
                const newSmall = document.createElement('small');
                newSmall.classList.add('text-muted');
                newSmall.style.fontFamily = "IBM Plex Sans";
                if(pregunta.url != null){
                    newSmall.textContent = pregunta.url;
                }else if(pregunta.file_path != null){
                    newSmall.textContent = pregunta.file_path;
                }else{
                    newSmall.textContent = '';
                }
    
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
                    questions.splice(index, 1);
                    questionsImg.forEach((questionImg, indexImg) => {
                        if(questionImg.index === index){
                            questionsImg.splice(indexImg, 1);
                        }
                    });

                });
                buttonsDiv.appendChild(eliminarBtn);
    
                const addFollowQuestionBTN = document.createElement('button');
                addFollowQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
                addFollowQuestionBTN.innerText = 'Agregar pregunta de Seguimiento';
                addFollowQuestionBTN.style.marginRight = '10px';
                addFollowQuestionBTN.style.color = 'var(--bs-CR-gray)';
                addFollowQuestionBTN.style.backgroundColor = 'var(--bs-CR-orange)';
                buttonsDiv.appendChild(addFollowQuestionBTN);
    
                const icon = document.createElement('i');
                icon.classList.add('fas', 'fa-bars');
                icon.style.fontSize = '10px';
    
                const dragBtn = document.createElement('button');
                dragBtn.classList.add('dragBtn', 'btn', 'btn-secondary');
                dragBtn.type = 'button';
                dragBtn.style.display = 'flex';
                dragBtn.style.width = '80px';
                dragBtn.style.height = '20px';
                dragBtn.style.alignSelf = 'center';
                dragBtn.style.padding = '0';
                dragBtn.style.justifyContent = 'center';
                dragBtn.style.alignItems = 'center';
                dragBtn.style.border = 'none';
    
                dragBtn.appendChild(icon);
    
                newDiv.appendChild(newH5);
                newDiv.appendChild(newSpan);
    
                newListItem.appendChild(newDiv);
                newListItem.appendChild(followQuestionList);
                newListItem.appendChild(newSmall);
                newListItem.appendChild(buttonsDiv);
                newListItem.appendChild(dragBtn);
    
                listGroup.appendChild(newListItem);
    
                //Drag & Drop: Propiedades para el boton de dragBtn
                dragBtn.addEventListener('mousedown', (event) => {
                    newListItem.setAttribute('draggable', true);
                });
                
                dragBtn.addEventListener('mouseup', (event) => {
                    newListItem.setAttribute('draggable', false);
                });
                
                //Drag & Drop: Anexo de propiedades a handle functions
                newListItem.addEventListener('dragstart', handleDragStart);
                newListItem.addEventListener('dragover', handleDragOver);
                newListItem.addEventListener('drop', handleDrop);
                newListItem.addEventListener('dragend', handleDragEnd);

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
                            <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta de seguimiento" style="width: 100%; font-family: IBM Plex Sans;" />
                            <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0; font-family: IBM Plex Sans color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);">Agregar pregunta</button>
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
                });


                //boton editar
                const editBtn = document.createElement('button');
                editBtn.classList.add('btn', 'btn-primary', 'btn-sm');
                editBtn.innerText = 'Editar';
                editBtn.style.marginRight = '10px';
                editBtn.style.color = 'var(--bs-CR-gray)';
                editBtn.style.backgroundColor = 'var(--bs-CR-orange)';
                buttonsDiv.appendChild(editBtn);

                editBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    const overlay = document.getElementById('overlay');
                    //que en el overlay se pueda editar la pregunta, el peso y el anexo ya sea archivo o url
                    overlay.innerHTML = `
                        <div id="overlayContent">
                            <input id="EditPreguntaTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <input id="EditPesoTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa el peso" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <input id="EditAnexoPregunta" class="form-control" type="file" name="Nombre" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <input id="EditAnexoPreguntaURL" class="form-control" type="text" name="Nombre" placeholder="Ingresa la URL del anexo" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <button id="GuardarEdit" class="btn btn-primary" style="margin: 10px 10px 0 0;font-family: hedliner; margin-bottom: 5px;color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);">Guardar</button>
                            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner; margin-bottom: 5px;">Cerrar</button>
                        </div>
                    `;

                    // Mostrar el overlay
                    overlay.style.display = 'flex';
                    document.getElementById('EditPreguntaTXT').value = pregunta.question;
                    document.getElementById('EditPesoTXT').value = pregunta.weight;
                    //verificar el tipo de anexo de la pregunta(archivo o url) y agregarlo al overlay
                    if(pregunta.url != null){
                        document.getElementById('EditAnexoPreguntaURL').value = pregunta.url;
                    }else if(pregunta.picture != null){
                        document.getElementById('EditAnexoPregunta').value = pregunta.file_path;
                    }

                    // Añadir evento para cerrar el overlay
                    document.getElementById('CerrarOverlay').addEventListener('click', () => {
                        overlay.style.display = 'none'; // Ocultar el overlay
                    });

                    // Añadir evento para guardar los cambios
                    document.getElementById('GuardarEdit').addEventListener('click', () => {
                        const editPregunta = document.getElementById('EditPreguntaTXT').value;
                        const editPeso = document.getElementById('EditPesoTXT').value;
                        const editAnexo = document.getElementById('EditAnexoPregunta').files.length > 0 ? document.getElementById('EditAnexoPregunta').files[0].name : document.getElementById('EditAnexoPreguntaURL').value;
                        if (editPregunta && editPeso) {
                            //actualizar la pregunta en el array de preguntas
                            questions[index].question = editPregunta;
                            questions[index].weight = editPeso;
                            if(editAnexo != ''){
                                if(document.getElementById('EditAnexoPregunta').files.length > 0){
                                    const file = document.getElementById('EditAnexoPregunta').files[0];
                                    questionsImg.push({index: index , file: file});
                                }else{
                                    questions[index].url = editAnexo;
                                }
                            }
                            //actualizar la pregunta en el listado de preguntas
                            newH5.textContent = editPregunta;
                            newSpan.textContent = editPeso;
                            newSmall.textContent = editAnexo;
                            overlay.style.display = 'none'; // Ocultar el overlay
                        } else {
                            alert('Por favor, ingresa tanto la pregunta como el peso.');
                        }
                    });
                    
                });

                //eliminar todas las preguntas de seguimiento
                const deleteFollowQuestionsBtn = document.createElement('button');
                deleteFollowQuestionsBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                deleteFollowQuestionsBtn.innerText = 'Eliminar preguntas de seguimiento';
                deleteFollowQuestionsBtn.style.marginRight = '10px';
                buttonsDiv.appendChild(deleteFollowQuestionsBtn);

                deleteFollowQuestionsBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    followQuestionList.innerHTML = '';
                    questions[index].feedback_questions = [];
                });
                
    
            });
            // console.log('Preguntas guardadas');
            enableNavItems();
        }else{
            // console.log('No hay preguntas guardadas');
            disableNavItems();
        }
    }
    )
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });


    //Drag & Drop: handle functions
    let draggedItem = null;

    function handleDragStart(event) {
        draggedItem = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', event.target.innerHTML);
        draggedItem.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const target = event.target;
        const items = document.querySelectorAll('.list-group-item');

        //Efecto visual: Placeholder Anaranjado
        items.forEach(item => {
            if (item !== target) {
                item.classList.remove('over');
            }
        });
        if (target && target !== draggedItem && target.classList.contains('list-group-item')) {
            target.classList.add('over');
        }
    }

    function handleDrop(event) {
        event.preventDefault();

        const target = event.target;
        if (draggedItem !== target && target.classList.contains('list-group-item')) {
            const listGroup = document.querySelector('.list-group');  
            const items = [...listGroup.querySelectorAll('.list-group-item')];
            const draggedIndex = items.indexOf(draggedItem);
            const targetIndex = items.indexOf(target);

            if (draggedIndex > targetIndex) {
                listGroup.insertBefore(draggedItem, target);
            } else {
                listGroup.insertBefore(draggedItem, target.nextSibling);
            }

            //Actualiza el array de preguntas
            const newQuestionsOrder = [];
            const newQuestionsImgOrder = [];
            const updatedItems = [...listGroup.querySelectorAll('.list-group-item')];
            updatedItems.forEach((item, index) => {
                const questionIndex = items.indexOf(item);
                newQuestionsOrder.push(questions[questionIndex]);
                const questionImg = questionsImg.find(img => img.index === questionIndex);
                if (questionImg) {
                    newQuestionsImgOrder.push({ index: index, file: questionImg.file });
                }
            });

            questions = newQuestionsOrder;
            questionsImg = newQuestionsImgOrder;
        }

        event.dataTransfer.clearData();
        target.classList.remove('over');
    }

    function handleDragEnd(event) {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem.setAttribute('draggable', false);

            document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('over'));
        }
    }
    //Fin Coso de Drag & Drop

    
}

//no deja subir imagenes muy grandes a una pregunta
document.getElementById('AnexoPregunta').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file.size > 524288 ) {
        alert('La imagen es muy grande, por favor selecciona una imagen de menos de 0.5 MB (500 kb).');
        event.target.value = '';
    }
});

document.getElementById('GuardarEncuestaBtn').addEventListener('click', (event) => {
    event.preventDefault();
    guardarPreguntas(); 
    alert('Encuesta guardada exitosamente');
    //recargar la pagina
    location.reload();
});

//Colores
function setColorsFromAPI(studyId) {
    const url = 'https://api.cheetah-research.ai/configuration/info_study/' + studyId;
    return axios.get(url)
        .then(response => {
            const colors = {
                color1: response.data.primary_color,
                color2: response.data.secondary_color
            };

            applyColors(colors);

            return colors;
        })
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