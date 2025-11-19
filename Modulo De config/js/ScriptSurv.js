let questions = [];
let defaultQuestions = [];
let questionsImg = [];

const token = sessionStorage.getItem('token');


document.addEventListener('DOMContentLoaded', () => {
    const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    const studyId = sessionStorage.getItem('selectedStudyId');
    setColorsFromAPI(studyId);//Setea colores
    const agregarPreguntaBtn = document.getElementById('AgregarPreguntaBtn');
    const preguntaTXT = document.getElementById('PreguntaTXT');
    const pesoTXT = document.getElementById('PesoTXT');
    const anexoPregunta = document.getElementById('AnexoPregunta');
    const anexoPreguntaURL = document.getElementById('AnexoPreguntaURL');
    const listGroup = document.querySelector('.list-group.list-group-custom');

    agregarPreguntaBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        const pregunta = preguntaTXT.value;
        const peso = pesoTXT.value;
        const anexo = anexoPregunta.files.length > 0 ? anexoPregunta.files[0].name : anexoPreguntaURL.value;

        if (pregunta && peso) {
            const newListItem = document.createElement('div');
            newListItem.classList.add('list-group-item', 'list-group-item-action', 'enhanced-question');
            newListItem.style.fontFamily = "hedliner";

            const questionHeader = document.createElement('div');
            questionHeader.classList.add('question-header');

            const newH5 = document.createElement('h5');
            newH5.classList.add('question-text');
            newH5.style.fontFamily = "IBM Plex Sans";

            // Replace escaped newlines with actual newlines, then convert to <br> for HTML
            let unescapedQuestion = pregunta.replace(/\\n/g, '\n');
            let processedQuestion = unescapedQuestion.replace(/\n/g, '<br>');
            // Add question number
            const questionNumber = questions.length + 1;
            newH5.innerHTML = `<strong style="color: var(--bs-CR-orange);">${questionNumber}.</strong> ${processedQuestion}`;

            const newSpan = document.createElement('span');
            newSpan.classList.add('question-weight');
            newSpan.textContent = peso;

            const newSmall = document.createElement('div');
            if (anexo) {
                newSmall.classList.add('question-attachment');
                newSmall.textContent = anexo;
            }

            const followQuestionContainer = document.createElement('div');
            followQuestionContainer.classList.add('follow-questions');
            followQuestionContainer.style.display = 'none'; // Initially hidden

            const followQuestionList = document.createElement('ul');
            followQuestionList.classList.add('follow-question-list');

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('question-actions');

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.innerText = getNestedTranslation(translations[lang], 'Encuesta.btDelQuestion');
            eliminarBtn.addEventListener('click', () => {
                newListItem.remove();
                // Renumber remaining questions
                renumberQuestions();
            });
            buttonsDiv.appendChild(eliminarBtn);

            const addFollowQuestionBTN = document.createElement('button');
            addFollowQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
            addFollowQuestionBTN.innerText = getNestedTranslation(translations[lang], 'Encuesta.btAddSubQuestion');
            addFollowQuestionBTN.style.color = 'var(--bs-CR-gray)';
            addFollowQuestionBTN.style.backgroundColor = 'var(--bs-CR-orange)';
            buttonsDiv.appendChild(addFollowQuestionBTN);

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-bars');

            const dragBtn = document.createElement('button');
            dragBtn.classList.add('dragBtn', 'drag-handle');
            dragBtn.type = 'button';
            dragBtn.appendChild(icon);

            // Assemble the question structure
            questionHeader.appendChild(newH5);
            questionHeader.appendChild(newSpan);
            
            followQuestionContainer.appendChild(followQuestionList);

            newListItem.appendChild(questionHeader);
            if (anexo) {
                newListItem.appendChild(newSmall);
            }
            newListItem.appendChild(followQuestionContainer);
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
                        <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" data-i18n-placeholder="Encuesta.inAddSubQuestion" style="width: 100%; font-family: IBM Plex Sans;" />
                        <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0;font-family: hedliner; color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);" data-i18n="Encuesta.btAddQuestion">Agregar pregunta</button>
                        <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner" data-i18n="Encuesta.btCloseQuestionEdit">Cerrar</button>
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
                        followQuestionContainer.style.display = 'block'; // Show container when questions are added
                        document.getElementById('FollowUpQuestionTXT').value = ''; // Limpiar el campo de texto
                        overlay.style.display = 'none'; // Ocultar el overlay
                    } else {
                        alert(getNestedTranslation(translations[lang], 'Encuesta.wFollowUp'));
                    }
                });
            });

            //boton editar
            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-primary', 'btn-sm');
            editBtn.innerText = getNestedTranslation(translations[lang], 'Encuesta.btEdtQuestion');
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
                        <input id="EditPreguntaTXT" class="form-control" type="text" name="Nombre" data-i18n-placeholder="Encuesta.inQuestion" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <input id="EditPesoTXT" class="form-control" type="text" name="Nombre" data-i18n-placeholder="Encuesta.inWeight" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <input id="EditAnexoPregunta" class="form-control" type="file" name="Nombre" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <input id="EditAnexoPreguntaURL" class="form-control" type="text" name="Nombre" placeholder="URL" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                        <button id="GuardarEdit" class="btn btn-primary" style="margin: 10px 10px 0 0;font-family: hedliner; margin-bottom: 5px;color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);" data-i18n="Encuesta.btSaveQuestionEdit">Guardar</button>
                        <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner; margin-bottom: 5px;" data-i18n="Encuesta.btCloseQuestionEdit">Cerrar</button>
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
                        let unescapedEditQuestion = editPregunta.replace(/\\n/g, '\n');
                        let processedEditQuestion = unescapedEditQuestion.replace(/\n/g, '<br>');
                        newH5.innerHTML = `<strong style="color: var(--bs-CR-orange);">${questionNumber}.</strong> ${processedEditQuestion}`;
                        newSpan.textContent = editPeso;
                        if (editAnexo && newSmall) {
                            newSmall.textContent = editAnexo;
                        }
                        overlay.style.display = 'none'; // Ocultar el overlay
                    } else {
                        alert(getNestedTranslation(translations[lang], 'Encuesta.wQuestionWeight'));
                    }
                });

            });

            //eliminar todas las preguntas de seguimiento
            const deleteFollowQuestionsBtn = document.createElement('button');
            deleteFollowQuestionsBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteFollowQuestionsBtn.innerText = getNestedTranslation(translations[lang], 'Encuesta.btDelSubQuestion');
            deleteFollowQuestionsBtn.style.marginRight = '10px';
            buttonsDiv.appendChild(deleteFollowQuestionsBtn);

            deleteFollowQuestionsBtn.addEventListener('click', (event) => {
                event.preventDefault();
                followQuestionList.innerHTML = '';
                followQuestionContainer.style.display = 'none'; // Hide container when all questions are removed
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
            alert(getNestedTranslation(translations[lang], 'Encuesta.wQuestionWeight'));
        }
    });

    //Drag & Drop: handle functions
    let draggedItem = null;

    function handleDragStart(event) {
        draggedItem = event.target.closest('.list-group-item');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', draggedItem.innerHTML);
        draggedItem.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const target = event.target.closest('.list-group-item');
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

        const target = event.target.closest('.list-group-item');
        if (draggedItem !== target && target && target.classList.contains('list-group-item')) {
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
            
            // Renumber questions after reordering
            renumberQuestions();
        }

        event.dataTransfer.clearData();
        if (target) {
            target.classList.remove('over');
        }
        // Clean up all over classes
        document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('over'));
    }

    function handleDragEnd(event) {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem.setAttribute('draggable', false);

            document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('over'));
        }
    }
    
    // Function to renumber all questions
    function renumberQuestions() {
        const listGroup = document.querySelector('.list-group.list-group-custom');
        if (!listGroup) return;
        
        const listItems = listGroup.querySelectorAll('.list-group-item.enhanced-question');
        
        listItems.forEach((item, index) => {
            const h5Element = item.querySelector('h5.question-text');
            if (h5Element) {
                const questionText = h5Element.innerHTML;
                // Remove existing number if present
                const cleanText = questionText.replace(/^<strong[^>]*>\d+\.<\/strong>\s*/, '');
                // Add new number
                const newNumber = index + 1;
                h5Element.innerHTML = `<strong style="color: var(--bs-CR-orange);">${newNumber}.</strong> ${cleanText}`;
            }
        });
    }
    //Fin Coso de Drag & Drop
});




function guardarPreguntas() {
    const listGroup = document.querySelector('.list-group.list-group-custom');    
    if (!listGroup) return;
    
    const listItems = listGroup.querySelectorAll('.list-group-item.enhanced-question');

    listItems.forEach((listItem, index) => {
        const followQuestionList = listItem.querySelector('ul.follow-question-list');
        if (followQuestionList) {
            const followQuestions = followQuestionList.querySelectorAll('li');
            if(followQuestions.length === 0){
                // No follow-up questions
                if (questions[index]) {
                    questions[index].feedback_questions = [];
                }
            } else {
                const pregunta = questions[index];
                if (pregunta) {
                    pregunta.feedback_questions = [];
                    followQuestions.forEach((followQuestion) => {
                        pregunta.feedback_questions.push(followQuestion.textContent);
                    });
                }
            }
        }
    });
    
    const defaultListGroup = document.querySelector('.list-group');
    const defaultListItems = defaultListGroup.querySelectorAll('.list-group-item');

    defaultListItems.forEach((defaultListItem, index) => {
        const statusSelect = defaultListItem.querySelector('select');

        statusSelect.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            defaultQuestions[index].status = selectedValue;
        });
    });

    
    enviarDatos(questions, defaultQuestions);
    console.log(questions);

}

function enviarDatos(preguntas, defaultQuestions) {
    const formData = new FormData();
    formData.append('questions', JSON.stringify(preguntas));
    questionsImg.forEach((questionImg) => {
        //formData.append(1, file1); // Archivo asociado a la pregunta con id 1 
        formData.append(questionImg.index + 1, questionImg.file);
    });

    const url = 'https://api.cheetah-research.ai/configuration/createQuestion/' + sessionStorage.getItem('selectedStudyId') + '/';

    axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        console.log(response.data);
        alert('Encuesta guardada correctamente');
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });

    // Enviar defaultQuestions
    /*se envian en formato JSON
    PUT
    "default_questions":[{"question":"Hola, te entrevistaré el día de hoy. Cómo deseas que me dirija hacia ti a lo largo de esta entrevista?","status":{"$numberInt":"1"}},{"question":"Para que la entrevista fluya más rápida trata de ser lo más amplio posible en sus respuestas y evita contestar solo con un \"Si, No, \" Esta bien, Esta bueno\" ya que ese tipo de respuestas me obligaran a formularte más preguntas. Estás dispuesto a continuar? Solamente contesta \"Deseo continuar\" ó \"No deseo Continuar\"","status":{"$numberInt":"1"}},{"question":"Primero deseamos saber un poco mas de tu forma de pensar..... Si pudieras describir un día perfecto en tu vida, desde la mañana hasta la noche, ¿Cómo sería? Cuéntame con detalle para imaginarlo contigo","status":{"$numberInt":"1"}}]}

    Iconfiguration/updateDefaultQuestions/[ID del estudio]
    */
    const defaultQuestionsData = {
        default_questions: defaultQuestions.map(q => ({
            question: q.question,
            status: parseInt(q.status, 10) // Ensure status is an integer
        }))
    };

    const urlDefault = 'https://api.cheetah-research.ai/configuration/updateDefaultQuestions/' + sessionStorage.getItem('selectedStudyId') + '/';
    axios.put(urlDefault, defaultQuestionsData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,

        },
    })
    .then(response => {
        // Manejar la respuesta de la API
    })
    .catch(error => {
        console.error('Error al enviar las preguntas por defecto:', error);
    });

    //formdata con el siguiente formato study_id
    const url2 = 'https://api.cheetah-research.ai/chatbot/updateLogs/' 
    const formData2 = new FormData();
    formData2.append('study_id', sessionStorage.getItem('selectedStudyId'));
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

    const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;
    
    questions = [];
    defaultQuestions = [];

    const url = 'https://api.cheetah-research.ai/configuration/get_survey/' + sessionStorage.getItem('selectedStudyId') ;
    axios.get(url)
    .then(response => {
        console.log(response.data);
        response.data.questions.forEach((pregunta) => {
            questions.push(pregunta);
        });
        
        response.data.default_questions.forEach((pregunta) => {
            // Ensure each default question has a status, defaulting to 0 (Desactivado) if not present
            if (pregunta.status === undefined) {
                pregunta.status = 0; 
            }
            defaultQuestions.push(pregunta);
        });

        if(defaultQuestions.length > 0){
            const defaultListGroup = document.querySelector('.list-group');
            if (!defaultListGroup) {
                console.error('Default questions list group (.list-group) not found in HTML.');
            } else {
                defaultListGroup.innerHTML = ''; // Clear only the default list
                const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma

                defaultQuestions.forEach((pregunta) => { 
                    const newListItem = document.createElement('div');
                    newListItem.classList.add('list-group-item', 'list-group-item-action', 'align-items-start');
                    newListItem.style.fontFamily = "hedliner";
                    newListItem.style.display = 'flex';
                    newListItem.style.flexDirection = 'column';
                    newListItem.style.gap = '0.5rem';

                    const contentDiv = document.createElement('div');
                    contentDiv.classList.add('d-flex', 'w-100', 'justify-content-between', 'align-items-center');
                    contentDiv.style.fontFamily = "hedliner";

                    const questionTextElement = document.createElement('h5');
                    questionTextElement.classList.add('mb-1');
                    questionTextElement.style.fontFamily = "IBM Plex Sans";
                    questionTextElement.style.marginRight = '1rem'; // Add some space before the dropdown

                    let unescapedQuestionText = pregunta.question.replace(/\\\\n/g, '\\n').replace(/\\n/g, '\\n');
                    let processedQuestionHTML = unescapedQuestionText.replace(/\\n/g, '<br>');
                    questionTextElement.innerHTML = processedQuestionHTML;
                    contentDiv.appendChild(questionTextElement);

                    const statusSelect = document.createElement('select');
                    statusSelect.classList.add('form-select', 'form-select-sm');
                    statusSelect.style.width = '150px'; 
                    statusSelect.style.marginLeft = 'auto'; 

                    const optionActivado = document.createElement('option');
                    optionActivado.value = '1';
                    optionActivado.textContent = 'Activado';
                    statusSelect.appendChild(optionActivado);

                    const optionDesactivado = document.createElement('option');
                    optionDesactivado.value = '0';
                    optionDesactivado.textContent = 'Desactivado';
                    statusSelect.appendChild(optionDesactivado);
                    
                    statusSelect.value = pregunta.status ? pregunta.status.toString() : '0'; 
                                        
                    statusSelect.addEventListener('change', () => {
                        pregunta.status = parseInt(statusSelect.value, 10);
                        // console.log(`Default question '${pregunta.question}' status changed to: ${pregunta.status}`);
                    });
                    contentDiv.appendChild(statusSelect);
                    newListItem.appendChild(contentDiv);

                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.style.display = 'flex';
                    buttonsDiv.style.marginTop = '10px';

                    const editButton = document.createElement('button');
                    editButton.classList.add('btn', 'btn-primary', 'btn-sm');
                    editButton.innerText = getNestedTranslation(translations[lang], 'Encuesta.btEdtQuestion');
                    editButton.style.marginRight = '10px'; 
                    editButton.style.color = 'var(--bs-CR-gray)';
                    editButton.style.backgroundColor = 'var(--bs-CR-orange)';
                    
                    editButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        const overlay = document.getElementById('overlay');
                        overlay.innerHTML = `
                            <div id="overlayContent">
                                <label for="EditDefaultPreguntaTXT" style="font-family: IBM Plex Sans; margin-bottom: 5px;" data-i18n="Encuesta.hEdtQuestion">Editar Pregunta:</label>
                                <textarea id="EditDefaultPreguntaTXT" class="form-control" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 10px; min-height: 80px;" data-i18n-placeholder="Encuesta.inQuestion"></textarea>
                                <button id="GuardarDefaultEdit" class="btn btn-primary" style="margin-right: 10px; font-family: hedliner; color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);" data-i18n="Encuesta.btSaveQuestionEdit">Guardar</button>
                                <button id="CerrarOverlayDefault" class="btn btn-secondary" style="font-family: hedliner;" data-i18n="Encuesta.btCloseQuestionEdit">Cerrar</button>
                            </div>
                        `;
                        
                        const editPreguntaTextarea = document.getElementById('EditDefaultPreguntaTXT');
                        // Populate with current question text (raw, with \n)
                        editPreguntaTextarea.value = pregunta.question.replace(/\\\\n/g, '\\n').replace(/\\n/g, '\\n');

                        overlay.style.display = 'flex';

                        document.getElementById('CerrarOverlayDefault').addEventListener('click', () => {
                            overlay.style.display = 'none';
                        });

                        document.getElementById('GuardarDefaultEdit').addEventListener('click', () => {
                            const newQuestionText = editPreguntaTextarea.value;
                            if (newQuestionText.trim()) {
                                pregunta.question = newQuestionText; 
                                
                                let unescapedUpdate = newQuestionText.replace(/\\\\n/g, '\\n').replace(/\\n/g, '\\n');
                                let processedUpdateHTML = unescapedUpdate.replace(/\\n/g, '<br>');
                                questionTextElement.innerHTML = processedUpdateHTML; 

                                overlay.style.display = 'none';
                            } else {
                                alert(getNestedTranslation(translations[lang], 'Encuesta.wEmptyQuestion'));
                            }
                        });
                    });
                    buttonsDiv.appendChild(editButton);
                    newListItem.appendChild(buttonsDiv);
                    defaultListGroup.appendChild(newListItem);
                });
            }
        }

        if(questions.length > 0){
            //AGREGAR PREGUNTAS AL LISTADO DE PREGUNTAS
            // console.log("pregunta entra 11");
    
            const listGroup = document.querySelector('.list-group.list-group-custom');
            listGroup.innerHTML = '';
    
            questions.forEach((pregunta, index) => {
                // console.log("pregunta entra");
                const lang = sessionStorage.getItem('language') || 'es'; // Get del idioma
    
                const newListItem = document.createElement('div');
                newListItem.classList.add('list-group-item', 'list-group-item-action', 'enhanced-question');
                newListItem.style.fontFamily = "hedliner";
                
                const questionHeader = document.createElement('div');
                questionHeader.classList.add('question-header');
    
                const newH5 = document.createElement('h5');
                newH5.classList.add('question-text');
                newH5.style.fontFamily = "IBM Plex Sans";

                // Replace escaped newlines with actual newlines, then convert to <br> for HTML
                let unescapedQuestion = pregunta.question.replace(/\\n/g, '\n');
                let processedQuestion = unescapedQuestion.replace(/\n/g, '<br>');
                // Add question number
                const questionNumber = index + 1;
                newH5.innerHTML = `<strong style="color: var(--bs-CR-orange);">${questionNumber}.</strong> ${processedQuestion}`;

                const newSpan = document.createElement('span');
                newSpan.classList.add('question-weight');
                newSpan.textContent = pregunta.weight;
    
                //verificar si la pregunta tiene anexo, url o ninguno y agregarlo
                const newSmall = document.createElement('div');
                const hasAttachment = pregunta.url != null || pregunta.file_path != null;
                if(hasAttachment){
                    newSmall.classList.add('question-attachment');
                    if(pregunta.url != null){
                        newSmall.textContent = pregunta.url;
                    }else if(pregunta.file_path != null){
                        newSmall.textContent = pregunta.file_path;
                    }
                }
    
                const followQuestionContainer = document.createElement('div');
                followQuestionContainer.classList.add('follow-questions');
                followQuestionContainer.style.display = 'none'; // Initially hidden

                const followQuestionList = document.createElement('ul');
                followQuestionList.classList.add('follow-question-list');
    
                const buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('question-actions');
    
                const eliminarBtn = document.createElement('button');
                eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                eliminarBtn.innerText = getNestedTranslation(translations[lang], 'Encuesta.btDelQuestion');
                eliminarBtn.addEventListener('click', () => {
                    newListItem.remove();
                    questions.splice(index, 1);
                    questionsImg.forEach((questionImg, indexImg) => {
                        if(questionImg.index === index){
                            questionsImg.splice(indexImg, 1);
                        }
                    });
                    // Renumber remaining questions
                    renumberQuestions();
                });
                buttonsDiv.appendChild(eliminarBtn);
    
                const addFollowQuestionBTN = document.createElement('button');
                addFollowQuestionBTN.classList.add('btn', 'btn-primary', 'btn-sm');
                addFollowQuestionBTN.innerText = getNestedTranslation(translations[lang], 'Encuesta.btAddSubQuestion');
                addFollowQuestionBTN.style.color = 'var(--bs-CR-gray)';
                addFollowQuestionBTN.style.backgroundColor = 'var(--bs-CR-orange)';
                buttonsDiv.appendChild(addFollowQuestionBTN);
    
                const icon = document.createElement('i');
                icon.classList.add('fas', 'fa-bars');
    
                const dragBtn = document.createElement('button');
                dragBtn.classList.add('dragBtn', 'drag-handle');
                dragBtn.type = 'button';
                dragBtn.appendChild(icon);
    
                // Assemble the question structure
                questionHeader.appendChild(newH5);
                questionHeader.appendChild(newSpan);
                
                followQuestionContainer.appendChild(followQuestionList);
    
                newListItem.appendChild(questionHeader);
                if(hasAttachment){
                    newListItem.appendChild(newSmall);
                }
                newListItem.appendChild(followQuestionContainer);
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

                if(pregunta.feedback_questions != null && pregunta.feedback_questions.length > 0){
                    followQuestionContainer.style.display = 'block'; // Show container if there are follow-up questions
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
                            <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" data-i18n-placeholder="Encuesta.inAddSubQuestion" style="width: 100%; font-family: IBM Plex Sans;" />
                            <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0; font-family: IBM Plex Sans color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);" data-i18n="Encuesta.btAddQuestion">Agregar pregunta</button>
                            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner" " data-i18n="Encuesta.btCloseQuestionEdit">Cerrar</button>
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
                            followQuestionContainer.style.display = 'block'; // Show container when questions are added
                            document.getElementById('FollowUpQuestionTXT').value = ''; // Limpiar el campo de texto
                            overlay.style.display = 'none'; // Ocultar el overlay
                        } else {
                            alert(getNestedTranslation(translations[lang], 'Encuesta.wFollowUp'));
                        }
                    });
                });


                //boton editar
                const editBtn = document.createElement('button');
                editBtn.classList.add('btn', 'btn-primary', 'btn-sm');
                editBtn.innerText = getNestedTranslation(translations[lang], 'Encuesta.btEdtQuestion');
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
                            <input id="EditPreguntaTXT" class="form-control" type="text" name="Nombre" data-i18n-placeholder="Encuesta.inQuestion" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <input id="EditPesoTXT" class="form-control" type="text" name="Nombre" data-i18n-placeholder="Encuesta.inWeight" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <input id="EditAnexoPregunta" class="form-control" type="file" name="Nombre" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <input id="EditAnexoPreguntaURL" class="form-control" type="text" name="Nombre" placeholder="URL" style="width: 100%; font-family: IBM Plex Sans; margin-bottom: 5px;" />
                            <button id="GuardarEdit" class="btn btn-primary" style="margin: 10px 10px 0 0;font-family: hedliner; margin-bottom: 5px;color: var(--bs-CR-gray); background-color: var(--bs-CR-orange);" data-i18n="Encuesta.btSaveQuestionEdit">Guardar</button>
                            <button id="CerrarOverlay" class="btn btn-secondary" style="margin: 10px 0 0 0;font-family: hedliner; margin-bottom: 5px;" data-i18n="Encuesta.btCloseQuestionEdit">Cerrar</button>
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
                            let unescapedEditQuestion = editPregunta.replace(/\\n/g, '\n');
                            let processedEditQuestion = unescapedEditQuestion.replace(/\n/g, '<br>');
                            const currentQuestionNumber = index + 1;
                            newH5.innerHTML = `<strong style="color: var(--bs-CR-orange);">${currentQuestionNumber}.</strong> ${processedEditQuestion}`;
                            newSpan.textContent = editPeso;
                            if (editAnexo && newSmall) {
                                newSmall.textContent = editAnexo;
                            }
                            overlay.style.display = 'none'; // Ocultar el overlay
                        } else {
                            alert(getNestedTranslation(translations[lang], 'Encuesta.wQuestionWeight'));
                        }
                    });
                    
                });

                //eliminar todas las preguntas de seguimiento
                const deleteFollowQuestionsBtn = document.createElement('button');
                deleteFollowQuestionsBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                deleteFollowQuestionsBtn.innerText = getNestedTranslation(translations[lang], 'Encuesta.btDelSubQuestion');
                deleteFollowQuestionsBtn.style.marginRight = '10px';
                buttonsDiv.appendChild(deleteFollowQuestionsBtn);

                deleteFollowQuestionsBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    followQuestionList.innerHTML = '';
                    followQuestionContainer.style.display = 'none'; // Hide container when all questions are removed
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
        draggedItem = event.target.closest('.list-group-item');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', draggedItem.innerHTML);
        draggedItem.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const target = event.target.closest('.list-group-item');
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

        const target = event.target.closest('.list-group-item');
        if (draggedItem !== target && target && target.classList.contains('list-group-item')) {
            const listGroup = document.querySelector('.list-group.list-group-custom');  
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
            
            // Renumber questions after reordering
            renumberQuestions();
        }

        event.dataTransfer.clearData();
        if (target) {
            target.classList.remove('over');
        }
        // Clean up all over classes
        document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('over'));
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
        alert("Imagen demasiado pesada");
        event.target.value = '';
    }
});

document.getElementById('GuardarEncuestaBtn').addEventListener('click', (event) => {
    event.preventDefault();
    guardarPreguntas(); 
    alert("Encuesta guardada correctamente");
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

document.getElementById('ExportarEncuestaBtn').addEventListener('click', function() {
    // Obtener el nombre del estudio usando la utilidad compartida
    const studyName = window.csvUtils ? window.csvUtils.getStudyName() : (() => {
        let studyName = '';
        try {
            const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
            studyName = studyData && studyData.title ? studyData.title : 'Estudio';
        } catch (e) {
            studyName = 'Estudio';
        }
        return studyName.replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
    })();
    
    const fileName = `${studyName} - Encuesta.CSV`;

    // Usar la función de escape compartida si está disponible
    const escapeCSV = window.csvUtils ? window.csvUtils.escapeCSV : (text) => {
        if (text === null || text === undefined) return '';
        let escaped = String(text).replace(/"/g, '""');
        escaped = escaped.replace(/\n/g, ' ').replace(/\r/g, ' ');
        return escaped;
    };

    // Encabezado CSV con BOM para UTF-8
    let csvContent = '\uFEFF'; // BOM para UTF-8
    csvContent += 'Número de pregunta,Peso de la pregunta,Pregunta\n';
    
    // Recorrer las preguntas
    questions.forEach((q, index) => {
        let pregunta = escapeCSV(q.question || '');
        let peso = escapeCSV(q.weight !== undefined ? q.weight : '');
        let numeroPregunta = index; // Número de pregunta iniciando en 0
        
        csvContent += `"${numeroPregunta}","${peso}","${pregunta}"\n`;
    });

    // Usar la función de descarga compartida si está disponible
    if (window.csvUtils && window.csvUtils.downloadCSV) {
        window.csvUtils.downloadCSV(csvContent, fileName);
    } else {
        // Fallback al método original
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, fileName);
        } else {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
});