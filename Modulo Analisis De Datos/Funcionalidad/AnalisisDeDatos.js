// agregarCard.js
let Demographic_Filters = [];
let ActiveModules = [];
let study = '';

function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');

    console.log('study_id param ejemplo: ?id=66ac6dfbfc65e4742d415b60');
    console.log('Utilizar Puerto 8080');

    if (study_id) {
        console.log('ID de estudio:', study_id);
        study = study_id;
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
        

        //        document.getElementById('overlay').style.display = 'none';



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


function content() {
    
    const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;

    axios.get(url)
        .then(function (response) {
            // handle success
            console.log(response.data);
            var data = response.data;
            stringresponse= data.general.narrative.General;
            const coso = marked(stringresponse);


            //jsonstring = JSON.stringify(data);
            const htmlString = coso;

            agregarCard("Analisis de Datos, Resumen General", htmlString);
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







