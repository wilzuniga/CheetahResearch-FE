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
            newSmall.style.fontFamily = "IBM Plex Sans";
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

            // Clear input fields
            preguntaTXT.value = '';
            pesoTXT.value = '';
            anexoPreguntaURL.value = '';

            addFollowQuestionBTN.addEventListener('click', (event) => {
                event.preventDefault();  // Prevent the default form submit behavior

                const overlay = document.getElementById('overlay');
                overlay.innerHTML = `
                    <div id="overlayContent">
                        <input id="FollowUpQuestionTXT" class="form-control" type="text" name="Nombre" placeholder="Ingresa tu pregunta de seguimiento" style="width: 100%; font-family: IBM Plex Sans;" />
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
            
            // AGREGAR PREGUNTA AL ARRAY DE PREGUNTAS, verificar si el anexo es un archivo o una URL, en caso de ser archivo guardarlo como picture
            if(anexoPregunta.files.length > 0){
                const file = anexoPregunta.files[0];
                questions.push({ question: pregunta, weight: peso });
                //hacer push de la imagen y del index de la pregunta a un array de imagenes
                questionsImg.push({index: questions.length - 1 , file: file});
                anexoPregunta.value = '';
            }else{
                anexoPregunta.value = '';
                if(anexoPreguntaURL.value != ''){
                    questions.push({ question: pregunta, weight: peso, url: anexo });
                }else{
                    questions.push({ question: pregunta, weight: peso });
                }
            }
            
            

        } else {
            alert('Por favor, ingresa tanto la pregunta como el peso.');
        }
    });
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
                buttonsDiv.appendChild(addFollowQuestionBTN);
    
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
                            <button id="AgregarPreguntaOverlay" class="btn btn-primary" style="margin: 10px 10px 0 0; font-family: IBM Plex Sans">Agregar pregunta</button>
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