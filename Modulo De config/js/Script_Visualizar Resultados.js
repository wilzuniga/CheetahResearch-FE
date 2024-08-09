let Demographic_Filters = [];
let ResumenGeneral, ResumenIndividual, AnalisisPsicograficos;

function AgregarFiltros() {
    const url = "https://api.cheetah-research.ai/configuration/filters/" + localStorage.getItem('selectedStudyId');

    axios.get(url)
        .then(function (response) {
            
            var data = response.data;
            Demographic_Filters = [];
            Demographic_Filters.push('Seleccionar filtro');
            //ciclar la data a partir de la segunda section para ver la estructura del json en la consola

                for(let filter in data['general']){
                    console.log("-" + filter);
                    Demographic_Filters.push(filter);                        
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
            //lenar el div con el resumen general y agregar el event listener al combobox con id ComboBox_ResumenGeneral
            const comboBoxRG = document.getElementById('ComboBox_ResumenGeneral');          
            comboBoxRG.addEventListener('change', (event) => {
                console.log(event.target.value);

                const StyleSelectedOption = document.getElementById('ComboBox_ResumenGeneralTy');

                var div = document.getElementById('ResumenGeneralContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value; //el filtro seleccionado
                formData = new FormData();
                formData.append('filter', selectedValue);
                formData.append('module', 'general');
                formData.append('sub_module', StyleSelectedOption.value);
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        ResumenGeneral = data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
                
            });


            //Resumen Individual
            //lenar el div con el resumen general y agregar el event listener al combobox con id ComboBox_ResumenIndividual
            const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
            
            comboBoxRI.addEventListener('change', (event) => {
                console.log(event.target.value);

                const StyleSelectedOption = document.getElementById('ComboBox_ResumenIndividualTy');

                var div = document.getElementById('ResumenIndividualContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value; //el filtro seleccionado
                formData = new FormData();
                formData.append('filter', selectedValue);
                formData.append('module', 'individual');
                formData.append('sub_module', StyleSelectedOption.value);
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        ResumenIndividual = data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
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
                //Llenar el user persona de la misma fotma que se llenan los anteriores 

                console.log(event.target.value);


                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('UserPersonaContent');

                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'user_persona');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        // agregar mensaje de "no se encontraron datos" en el div
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });

            });

            //ekman, perfecto
            comboBoxEK.addEventListener('change', (event) => {
                console.log(event.target.value);


                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('EkmanContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'psicographic_questions');
                formData.append('sub_module', 'ekman');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });

            });

            //Rasgos de personalidad, perfecto
            comboBoxRP.addEventListener('change', (event) => {
                console.log(event.target.value);

                console.log(event.target.value);


                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('RasgosDePersonalidadContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'psicographic_questions');
                formData.append('sub_module', 'personality');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            });

            //Segmentos Psicograficos, perfecto

            comboBoxSP.addEventListener('change', (event) => {
                console.log(event.target.value);

                var div = document.getElementById('SegmentosPsicograficosContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'psicographic_questions');
                formData.append('sub_module', 'segmentos');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });            }
            );

            //NPS, perfecto
            comboBoxNPS.addEventListener('change', (event) => {
                console.log(event.target.value);

                var div = document.getElementById('NPSContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'psicographic_questions');
                formData.append('sub_module', 'nps');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            });

            comboBoxEC.addEventListener('change', (event) => {
                console.log(event.target.value);

                var div = document.getElementById('EstiloDeComunicacionContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'psicographic_questions');
                formData.append('sub_module', 'estilo');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        const coso = marked(data);      
                        div.innerHTML = coso;                      

                        console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            });

}

// insertar lorem ipsilum en el div coon id ResumenGeneral al cargarlo 
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nombreProyectoLbl').innerText = (localStorage.getItem('selectedStudyData')).title;

});

// Abrir un filechooser con el botón e ingresar los archivos a un arreglo de archivos botonImportar
const botonImportar = document.getElementById('botonImportar');
botonImportar.addEventListener('click', () => {
    const fileChooser = document.createElement('input');
    fileChooser.type = 'file';
    fileChooser.accept = '.pdf,.csv';
    fileChooser.multiple = true;
    fileChooser.addEventListener('change', (event) => {
        const files = event.target.files;

        const url = "https://api.cheetah-research.ai/configuration/upload_files/" + localStorage.getItem('selectedStudyId');

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                alert('Archivos subidos exitosamente');
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
            });
        // Aquí puedes hacer algo con los archivos seleccionados, como guardarlos en un arreglo o procesarlos de alguna manera
        console.log(files);
    });
    fileChooser.click();
});
