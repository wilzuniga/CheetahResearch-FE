let Demographic_Filters = [];
let ResumenGeneral, ResumenIndividual, AnalisisPsicograficos;

function AgregarFiltros() {
    const url = "http://ec2-44-203-206-68.compute-1.amazonaws.com/getSummaries/669ee33ec2af27bcc4720342";

    axios.get(url)
        .then(function (response) {
            
            var data = response.data;
            Demographic_Filters = [];
            //ciclar la data para ver la estructura del json en la consola
            for(let section in data){
                for(let category in data[section]){
                    for (let filter in data[section][category]) {
                        Demographic_Filters.push(filter);                        
                    }
                    break

                }
                break
            }

            const comboBox = document.getElementById('ComboBox_ResumenGeneral');
            const comboBox2 = document.getElementById('ComboBox_ResumenIndividual');
            comboBox.innerHTML = '';
            comboBox2.innerHTML = '';

        // Agregar opciones al combobox
        Demographic_Filters.forEach(optionText => {
            let option = document.createElement('option');
            option.value = optionText;
            option.text = optionText;
            comboBox.appendChild(option);
            comboBox2.appendChild(option.cloneNode(true));
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



function LLenarResumenes(){
    const url = "http://ec2-44-203-206-68.compute-1.amazonaws.com/getSummaries/669ee33ec2af27bcc4720342";

    axios.get(url)
        .then(function (response) {
    
            var data = response.data;
            ResumenGeneral = data.general;
            ResumenIndividual = data.individual_questions;            
            AnalisisPsicograficos = data.psicographic_questions;


            

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
                    const jsonObject = ResumenGeneral_Factual[selectedValue];
                
                    // Convertir el objeto JSON a una cadena HTML
                    let htmlString = '';
                
                    // Verificar si jsonObject existe
                    if (jsonObject) {
                        // Recorrer las propiedades del JSON
                        for (const [category, data] of Object.entries(jsonObject)) {
                            htmlString += `<h3>${category}</h3><ul>`;
                            for (const [key, value] of Object.entries(data)) {
                                // Convertir el valor a porcentaje solo si el valor es menor a 1
                                const percentage = (value < 1 ? (value * 100).toFixed(2) : value);
                                htmlString += `<li>${key}: ${percentage}%</li>`;
                            }
                            htmlString += `</ul>`;
                        }
                    }
                
                    // Insertar el HTML en el div
                    div.innerHTML = htmlString;
                
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
                    let htmlString = '';

                    // Verificar si jsonObject existe
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
                    }

                    // Insertar el HTML en el div
                    div.innerHTML = htmlString;

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

// insertar lorem ipsilum en el div coon id ResumenGeneral al cargarlo 
document.addEventListener('DOMContentLoaded', () => {
    
    //const url = "http://ec2-44-203-206-68.compute-1.amazonaws.com/getSummaries/" + localStorage.getItem('selectedStudyId');
    const url = "http://ec2-44-203-206-68.compute-1.amazonaws.com/getSummaries/669ee33ec2af27bcc4720342";

    axios.get(url)
        .then(function (response) {
            
            var data = response.data;
            //ciclar la data para ver la estructura del json en la consola
            AgregarFiltros();
            LLenarResumenes();


            
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




});


