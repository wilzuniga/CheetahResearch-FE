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
        AgregarModulos(study_id);
        
    } else {
        console.error('No se encontró el parámetro id en la URL.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const exportButtons = document.querySelectorAll('button[id^="export_"]');

    exportButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parentTabPane = button.closest('.tab-pane');
            const contentDiv = parentTabPane.querySelector('div[id$="Content"]');

            if (contentDiv) {
                
                const options = {
                    margin: 1,
                    filename: `${parentTabPane.id || 'contenido'}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                };

                html2pdf().set(options).from(contentDiv).save();
            }
        });
    });
});




//ocultar los elementos con id UsserExperienceBtn UsserExperience
document.addEventListener('DOMContentLoaded', function () {
    const coso = document.getElementById('UsserExperienceBtn');
    const coso2 = document.getElementById('UsserExperience');

    coso.style.display = 'none';
    coso2.style.display = 'none';

    const study_id = new URLSearchParams(window.location.search).get('id');
    
    //si el id del estudio es 674f67fae552eefe841a191b entonces mostrar el boton y el div
    if (study_id === '674f67fae552eefe841a191b') {
        coso.style.display = 'block';
        coso2.style.display = 'block';
    }
    
});


function AgregarModulos(study) {

    let url = "https://api.cheetah-research.ai/configuration/get_modules/" + study;

    axios.get(url)
        .then(function (response) {
            const data = response.data.modules;
            ActiveModules = [];

            //ciclar la data a partir de la segunda section para ver la estructura del json en la consola
            data.forEach(modulo => {
                ActiveModules.push(modulo);
            });

            console.log(ActiveModules);

            const ResumenGeneralBtn = document.getElementById('ResumenGeneralBtn');
            const ResumenIndividualBtn = document.getElementById('ResumenIndividualBtn');
            const UserPersonaBtn = document.getElementById('UserPersonaBtn');
            const AnalisisPsicograficosBtn = document.getElementById('AnalisisPsicograficosBtn');

            ResumenGeneralBtn.style.display = 'none';
            ResumenIndividualBtn.style.display = 'none';
            UserPersonaBtn.style.display = 'none';
            AnalisisPsicograficosBtn.style.display = 'none';

            ActiveModules.forEach(modulo => {
                if (modulo === 'Modulo de Analisis General') {
                    ResumenGeneralBtn.style.display = 'block';
                }
                if (modulo === 'Modulo de Analisis Individual') {
                    ResumenIndividualBtn.style.display = 'block';
                }
                if (modulo === 'Modulo de Users Personas') {
                    UserPersonaBtn.style.display = 'block';
                }
                if (modulo === 'Modulo de Analisis Psicografico') {
                    AnalisisPsicograficosBtn.style.display = 'block';
                }

            }
            );

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


function AgregarFiltros(study) {
    let url = "https://api.cheetah-research.ai/configuration/get_filters/" + study;

    axios.get(url)
        .then(function (response) {
            
            const data = response.data.filters;
            Demographic_Filters = [];
            Demographic_Filters.push('Seleccionar filtro');
            Demographic_Filters.push('General');

            //ciclar la data a partir de la segunda section para ver la estructura del json en la consola
            data.forEach(filtro => {
                Demographic_Filters.push(filtro);
            });


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



function LLenarResumenes(study) {
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
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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
        formData.append('module', 'individual_questions');
        formData.append('sub_module', StyleSelectedOption.value);
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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
        formData.append('module', 'user_personas');
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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
        var div = document.getElementById('EKMANContent');
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;

        formData = new FormData();     
        formData.append('filter', selectedValue);
        formData.append('module', 'psicographic_questions');
        formData.append('sub_module', 'ekman');
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;

        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
        axios.post(url, formData)
            .then(function (response) {
                var data = response.data;
                if (!data.startsWith("#")) {
                    data = data.substring(data.indexOf("#"));
                    data = data.substring(0, data.length - 3);
                }
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







