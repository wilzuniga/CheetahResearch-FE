// agregarCard.js
let Demographic_Filters = [];
let ActiveModules = [];

function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');

    console.log('study_id param ejemplo: ?id=66ac6dfbfc65e4742d415b60');
    console.log('Utilizar Puerto 8080');

    if (study_id) {
        console.log('ID de estudio:', study_id);
        AgregarFiltros(study_id);
        
    } else {
        console.error('No se encontró el parámetro id en la URL.');
    }
}

function AgregarFiltros(study) {
    const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;

    axios.get(url)
        .then(function (response) {
            
            var data = response.data;
            Demographic_Filters = [];
            //ciclar la data a partir de la segunda section para ver la estructura del json en la consola

                for(let category in data['general']){
                    for (let filter in data['general'][category]) {
                        console.log("-" + filter);
                        Demographic_Filters.push(filter);                        
                    }
                    break

                }

                for(let category in data['modules']){
                    ActiveModules.push(category);                        
                }


            const comboBox = document.getElementById('ComboBox_ResumenGeneral');
            const comboBox2 = document.getElementById('ComboBox_ResumenIndividual');
            const comboBox3 = document.getElementById('Combobox_UserPersona');
            const comboBox4 = document.getElementById('Combobox_EKMAN');
            const comboBox5 = document.getElementById('Combobox_RasgosDePersonalidad');
            const comboBox6 = document.getElementById('Combobox_SegmentosPsicograficos');
            const comboBox7 = document.getElementById('Combobox_NPS');
            const comboBox8 = document.getElementById('Combobox_EstiloDeComunicacion');
            comboBox.innerHTML = '';
            comboBox2.innerHTML = '';
            comboBox3.innerHTML = '';
            comboBox4.innerHTML = '';
            comboBox5.innerHTML = '';
            comboBox6.innerHTML = '';
            comboBox7.innerHTML = '';
            comboBox8.innerHTML = '';

        // Agregar opciones al combobox
        Demographic_Filters.forEach(optionText => {
            let option = document.createElement('option');
            option.value = optionText;
            option.text = optionText;
            comboBox.appendChild(option);
            comboBox2.appendChild(option.cloneNode(true));
            comboBox3.appendChild(option.cloneNode(true));
            comboBox4.appendChild(option.cloneNode(true));
            comboBox5.appendChild(option.cloneNode(true));
            comboBox6.appendChild(option.cloneNode(true));
            comboBox7.appendChild(option.cloneNode(true));
            comboBox8.appendChild(option.cloneNode(true));

        });

        //ciclar a travez de los modules activos y hacer un if para verificar si tiene adentro alguno de los modulos en este arreglo ["general, "individual_questions", "psicographic_questions" , "user_personas"]
        //si tiene alguno de estos modulos activos, display el boton con el nombre del modulo 
        //si no tiene ninguno de estos modulos activos, no display el boton
        ActiveModules.forEach(module => {
            if(module == "general"){
                document.getElementById('ResumenGeneralID').style.display = 'flex';
            }
            if(module == "individual_questions"){
                document.getElementById('ResumenIndividualID').style.display = 'flex';
            }
            if(module == "psicographic_questions"){
                document.getElementById('AnalisisPsicograficosID').style.display = 'flex';
            }
            if(module == "user_personas"){
                document.getElementById('UserPersonaID').style.display = 'flex';
            }
        });

        //        document.getElementById('overlay').style.display = 'none';


        LLenarResumenes(study);
        }
        )
        .catch(function (error) {
            // handle error
            console.log(error);
        }
        )
        .then(function () {
            // always executed
        }
        );

        
}


let ResumenGeneral, ResumenIndividual, AnalisisPsicograficos;



function LLenarResumenes(study){
    const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study; 

    axios.get(url)
        .then(function (response) {
    
            var data = response.data;
            ResumenGeneral = data['general'];
            ResumenIndividual = data.individual_questions;            
            AnalisisPsicograficos = data['psicographic_questions'];
            User_Personas = data['user_personas'];



            

            //Resumen General
            const ResumenGeneral_Narrativo = ResumenGeneral.narrative;
            const ResumenGeneral_Factual = ResumenGeneral.factual;
            //lenar el div con el resumen general y agregar el event listener al combobox con id ComboBox_ResumenGeneral
            const comboBoxRG = document.getElementById('ComboBox_ResumenGeneral');          
            comboBoxRG.addEventListener('change', (event) => {
                console.log(event.target.value);

                const StyleSelectedOption = document.getElementById('ComboBox_ResumenGeneralTy');

                if (StyleSelectedOption.value == 'narrative') {

                    // Obtener el div donde se mostrará el contenido
                    var div = document.getElementById('ResumenGeneralContent');


                    // Supongamos que `event.target.value` es el valor del combobox
                    const selectedValue = event.target.value;

                    // Obtener el texto en formato Markdown
                    const markdownString = ResumenGeneral_Narrativo[selectedValue];

                    // Convertir Markdown a HTML usando marked
                    const coso = marked(markdownString);

                    // Insertar el HTML en el div
                    div.innerHTML = coso;

                    // Agregar filtros si es necesario



                } else if (StyleSelectedOption.value == 'factual') {

                    // Obtener el div donde se mostrará el contenido
                    var div = document.getElementById('ResumenGeneralContent');
                
                    // Supongamos que `event.target.value` es el valor del combobox
                    const selectedValue = event.target.value;
                
                    // Obtener el objeto JSON correspondiente al valor seleccionado
                    const markdownString = ResumenGeneral_Factual[selectedValue];
                
                    // Convertir el objeto JSON a una cadena HTML
                    let htmlString = '';
                
                    // Verificar si jsonObject existe
                    const coso = marked(markdownString);

                
                    // Insertar el HTML en el div
                    div.innerHTML = coso;
                
                }
                
            });


            //Resumen Individual
            const ResumenIndividual_Narrativo = ResumenIndividual.narrative;
            const ResumenIndividual_Factual = ResumenIndividual.percentage;
            //lenar el div con el resumen general y agregar el event listener al combobox con id ComboBox_ResumenIndividual
            const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
            
            comboBoxRI.addEventListener('change', (event) => {
                console.log(event.target.value);

                const StyleSelectedOption = document.getElementById('ComboBox_ResumenIndividualTy');

                if (StyleSelectedOption.value == 'narrative') {

                    // Obtener el div donde se mostrará el contenido
                    var div = document.getElementById('ResumenIndividualContent');

                    const selectedValue = event.target.value;

                    // Obtener el texto en formato json
                    const jsonObject = ResumenIndividual_Narrativo[selectedValue];

                    // Convertir el objeto JSON a una cadena HTML
                    const markdownString = ResumenGeneral_Factual[selectedValue];
                
                    // Convertir el objeto JSON a una cadena HTML
                    let htmlString = '';
                
                    // Verificar si jsonObject existe
                    const coso = marked(markdownString);

                    /*// Verificar si jsonObject existe
                    if (jsonObject) {
                        let index = 1; // Inicializar el índice
                        for (const [category, data] of Object.entries(jsonObject)) {
                            for (const [key, value] of Object.entries(data)) {
                                if (key === 'question' || key === 'summary') {
                                    htmlString += `<p><strong> ${key}</strong></p>`;
                                    htmlString += `<p>${value}</p>`;
                                    //agregar un salto de linea
                                    index++; // Incrementar el índice
                                }
                            }
                            htmlString += `<br>`;

                        }
                    }*/

                    // Insertar el HTML en el div
                    div.innerHTML = coso;

                } else if (StyleSelectedOption.value == 'percentage') {

                    // Obtener el div donde se mostrará el contenido
                    var div = document.getElementById('ResumenIndividualContent');

                    const selectedValue = event.target.value;

                    // Obtener el objeto JSON correspondiente al valor seleccionado
                    const jsonObject = ResumenIndividual_Factual;

                    // Convertir el objeto JSON a una cadena HTML
                    let htmlString = '';

                    // Verificar si jsonObject existe y tiene la categoría seleccionada
                    if (jsonObject && jsonObject[selectedValue]) {
                        let index = 1; // Inicializar el índice
                        const questions = jsonObject[selectedValue];
                        questions.forEach(questionData => {
                            // Añadir la pregunta
                            htmlString += `<p><strong>${index}. Question:</strong> ${questionData.question}</p>`;
                            // Añadir el resumen
                            htmlString += `<p><strong>Summary:</strong></p><ul>`;
                            for (const [key, value] of Object.entries(questionData.summary)) {
                                htmlString += `<li>${key}: ${value}</li>`;
                            }
                            htmlString += `</ul>`;
                            index++; // Incrementar el índice
                            htmlString += `<br>`; // Añadir un salto de línea después de cada pregunta y resumen
                        });
                    } else {
                        htmlString = '<p>No se encontraron datos para la selección actual.</p>';
                    }

                    // Insertar el HTML en el div
                    div.innerHTML = htmlString;

                }
            });


            //Analisis Psicograficos, no tienen narrativo ni factual. Solo filtros
            const comboBoxUP = document.getElementById('Combobox_UserPersona');
            const comboBoxEK = document.getElementById('Combobox_EKMAN');
            const comboBoxRP = document.getElementById('Combobox_RasgosDePersonalidad');
            const comboBoxSP = document.getElementById('Combobox_SegmentosPsicograficos');
            const comboBoxNPS = document.getElementById('Combobox_NPS');
            const comboBoxEC = document.getElementById('Combobox_EstiloDeComunicacion');

            //User Persona, perfecto
            comboBoxUP.addEventListener('change', (event) => {
                console.log(event.target.value);
            
                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('UserPersonaContent');
            
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;
            
                // Obtener el objeto JSON correspondiente al valor seleccionado
                const jsonObject = User_Personas;
                console.log(jsonObject);
            
                // Convertir el objeto JSON a una cadena HTML
                let htmlString = '';
            
                // Verificar si jsonObject existe y tiene la categoría seleccionada
                if (jsonObject && jsonObject[selectedValue]) {
                    let index = 1; // Inicializar el índice

                    //contenido para cada filtro es texto, no esta dividido en preguntas
                    const content = jsonObject[selectedValue];
                    //marked
                    const coso = marked(content);
                    htmlString = coso;

                    
                    
                } else {
                    htmlString = '<p>No se encontraron datos para la selección actual.</p>';
                }
            
                // Insertar el HTML en el div
                div.innerHTML = htmlString;
            });

            //ekman, perfecto
            comboBoxEK.addEventListener('change', (event) => {
                console.log(event.target.value);
                
                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('EKMANContent');

                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                // Obtener el objeto JSON correspondiente al valor seleccionado
                const jsonObject = AnalisisPsicograficos['ekman'];
                console.log(jsonObject);

                // Convertir el objeto JSON a una cadena HTML
                let htmlString = '';

                // Verificar si jsonObject existe y tiene la categoría seleccionada


                if (jsonObject && jsonObject[selectedValue]) {
                    let index = 1; // Inicializar el índice
                    const questions = jsonObject[selectedValue];
                    questions.forEach(questionData => {
                        // Añadir la pregunta
                        htmlString += `<p><strong>${index}. Question:</strong> ${questionData.question}</p>`;
                        // Añadir el resumen
                        htmlString += `<p><strong>Summary:</strong></p><ul>`;
                        for (const [key, value] of Object.entries(questionData.summary)) {
                            htmlString += `<li>${key}: ${value}</li>`;
                        }
                        htmlString += `</ul>`;
                        index++; // Incrementar el índice
                        htmlString += `<br>`; // Añadir un salto de línea después de cada pregunta y resumen
                    });
                } else {
                    htmlString = '<p>No se encontraron datos para la selección actual.</p>';
                }

                // Insertar el HTML en el div
                div.innerHTML = htmlString;

            });

            //Rasgos de personalidad, perfecto
            comboBoxRP.addEventListener('change', (event) => {
                console.log(event.target.value);
            
                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('RasgosDePersonalidadContent');
            
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;
            
                // Obtener el objeto JSON correspondiente al valor seleccionado
                const jsonObject = AnalisisPsicograficos['personality'];
                console.log(jsonObject);
            
                // Convertir el objeto JSON a una cadena HTML
                let htmlString = '';
            
                // Verificar si jsonObject existe y tiene la categoría seleccionada
                if (jsonObject && jsonObject[selectedValue]) {
                    let index = 1; // Inicializar el índice
                    const questions = jsonObject[selectedValue];
                    questions.forEach(questionData => {
                        // Añadir la pregunta
                        htmlString += `<p><strong>${index}. Question:</strong> ${questionData.question}</p>`;
                        // Añadir el resumen
                        htmlString += `<p><strong>Summary:</strong></p><ul>`;
                        for (const [key, value] of Object.entries(questionData)) {
                            if (key !== 'question') { // Excluir la clave 'question' del resumen
                                htmlString += `<li>${key}: ${value}</li>`;
                            }
                        }
                        htmlString += `</ul>`;
                        index++; // Incrementar el índice
                        htmlString += `<br>`; // Añadir un salto de línea después de cada pregunta y resumen
                    });
                } else {
                    htmlString = '<p>No se encontraron datos para la selección actual.</p>';
                }
            
                // Insertar el HTML en el div
                div.innerHTML = htmlString;
            });

            //Segmentos Psicograficos, perfecto

            comboBoxSP.addEventListener('change', (event) => {

                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('SegmentosPsicograficosContent');
            
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;
            
                // Obtener el objeto JSON correspondiente al valor seleccionado
                const jsonObject = AnalisisPsicograficos['segmentos'];
                console.log(jsonObject);
            
                // Convertir el objeto JSON a una cadena HTML
                let htmlString = '';
            
                // Verificar si jsonObject existe y tiene la categoría seleccionada
                if (jsonObject && jsonObject[selectedValue]) {
                    let index = 1; // Inicializar el índice
                    const questions = jsonObject[selectedValue];
                    questions.forEach(questionData => {
                        // Añadir la pregunta
                        htmlString += `<p><strong>${index}. Question:</strong> ${questionData.question}</p>`;
                        // Añadir el resumen
                        htmlString += `<p><strong>Summary:</strong></p><ul>`;
                        for (const [key, value] of Object.entries(questionData)) {
                            if (key !== 'question') { // Excluir la clave 'question' del resumen
                                htmlString += `<li>${key}: ${value}</li>`;
                            }
                        }
                        htmlString += `</ul>`;
                        index++; // Incrementar el índice
                        htmlString += `<br>`; // Añadir un salto de línea después de cada pregunta y resumen
                    });
                } else {
                    htmlString = '<p>No se encontraron datos para la selección actual.</p>';
                }
            
                // Insertar el HTML en el div
                div.innerHTML = htmlString;
            }
            );

            //NPS, perfecto
            comboBoxNPS.addEventListener('change', (event) => {
                console.log(event.target.value);
            
                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('NPSContent');
            
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;
            
                // Obtener el objeto JSON correspondiente al valor seleccionado
                const jsonObject = AnalisisPsicograficos['nps'];
                console.log(jsonObject);
            
                // Convertir el objeto JSON a una cadena HTML
                let htmlString = '';
            
                // Verificar si jsonObject existe y tiene la categoría seleccionada
                if (jsonObject && jsonObject[selectedValue]) {
                    let index = 1; // Inicializar el índice
                    const questions = jsonObject[selectedValue];
                    questions.forEach(questionData => {
                        // Añadir la pregunta
                        htmlString += `<p><strong>${index}. Question:</strong> ${questionData.question}</p>`;
                        // Añadir el resumen
                        htmlString += `<p><strong>Summary:</strong></p><ul>`;
                        for (const [key, value] of Object.entries(questionData.summary)) {
                            htmlString += `<li>${key}: ${value}</li>`;
                        }
                        htmlString += `</ul>`;
                        index++; // Incrementar el índice
                        htmlString += `<br>`; // Añadir un salto de línea después de cada pregunta y resumen
                    });
                } else {
                    htmlString = '<p>No se encontraron datos para la selección actual.</p>';
                }
            
                // Insertar el HTML en el div
                div.innerHTML = htmlString;
            });

            comboBoxEC.addEventListener('change', (event) => {
                console.log(event.target.value);
            
                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('EstiloDeComunicacionContent');
            
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;
            
                // Obtener el objeto JSON correspondiente al valor seleccionado
                const jsonObject = AnalisisPsicograficos['estilo_comunicacion'];
                console.log(jsonObject);
            
                // Convertir el objeto JSON a una cadena HTML
                let htmlString = '';
            
                // Verificar si jsonObject existe y tiene la categoría seleccionada
                if (jsonObject && jsonObject[selectedValue]) {
                    let index = 1; // Inicializar el índice
                    const questions = jsonObject[selectedValue];
                    questions.forEach(questionData => {
                        // Añadir la pregunta
                        htmlString += `<p><strong>${index}. Question:</strong> ${questionData.question}</p>`;
                        // Añadir el resumen
                        htmlString += `<p><strong>Summary:</strong></p><ul>`;
                        for (const [key, value] of Object.entries(questionData)) {
                            if (key !== 'question') { // Excluir la clave 'question' del resumen
                                htmlString += `<li>${key}: ${value}</li>`;
                            }
                        }
                        htmlString += `</ul>`;
                        index++; // Incrementar el índice
                        htmlString += `<br>`; // Añadir un salto de línea después de cada pregunta y resumen
                    });
                } else {
                    htmlString = '<p>No se encontraron datos para la selección actual.</p>';
                }
            
                // Insertar el HTML en el div
                div.innerHTML = htmlString;
            });
            

            
        }
        )
        .catch(function (error) {
            // handle error
            console.log(error);
        }
        )
        .then(function () {
            // always executed
        }
        );
        

}







