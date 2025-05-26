let Demographic_Filters = [];
let formData = new FormData();  // Asegúrate de que esta línea está presente donde se necesita
let markmapBlobUrl = null;


import { splitMarkdown, generateCharts } from './splitter.js';


function generateMarkmapHTML(content , filter) {
    // Estructura HTML con el contenido dinámico
    var htmlContent = `<!DOCTYPE html>
    <html>
        <head>
            <title>Markmap - ${filter}</title>  
            <style>
                .markmap > svg {
                    width: 100%;
                    height: 100vh;
                }

                .markmap-foreign > div {
                    max-width: 800px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <div class="markmap">
                ${content}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/markmap-autoloader"></script>
        </body>
    </html>`;

    // Crear un Blob con el contenido HTML
    var blob = new Blob([htmlContent], { type: "text/html" });

    // Revocar URL anterior si existe (para liberar memoria)
    if (markmapBlobUrl) {
        URL.revokeObjectURL(markmapBlobUrl);
    }

    // Crear un nuevo objeto URL
    markmapBlobUrl = URL.createObjectURL(blob);

    // Habilitar el botón de descarga
    let downloadBtn = document.getElementById("download_markmap");
    if (downloadBtn) {
        downloadBtn.style.display = "block"; // Mostrar el botón
        downloadBtn.onclick = function () {
            let a = document.createElement("a");
            a.href = markmapBlobUrl;
            a.download = `markmap - ${filter}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }
}


function AgregarFiltros() {
    const url = "https://api.cheetah-research.ai/configuration/get_filters/" + localStorage.getItem('selectedStudyId');

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
            const comboBoxUA = document.getElementById('Combobox_UserArchetype');
            const comboBox4 = document.getElementById('Combobox_EKMAN');
            const comboBox5 = document.getElementById('Combobox_RasgosDePersonalidad');
            const comboBox6 = document.getElementById('Combobox_SegmentosPsicograficos');
            const comboBox7 = document.getElementById('Combobox_NPS');
            const comboBox8 = document.getElementById('Combobox_EstiloDeComunicacion');
            const comboBox9 = document.getElementById('Combobox_customerExperience');
            const comboBox10 = document.getElementById('Combobox_Satisfaccion');
            const comboBox11 = document.getElementById('Combobox_ClimaLaboral');
            const comboBox12 = document.getElementById('Combobox_BrandStrenght');
            const comboBox13 = document.getElementById('Combobox_BrandEquity');

            comboBox.innerHTML = '';
            comboBox2.innerHTML = '';
            comboBox3.innerHTML = '';
            comboBoxUA.innerHTML = '';
            comboBox4.innerHTML = '';
            comboBox5.innerHTML = '';
            comboBox6.innerHTML = '';
            comboBox7.innerHTML = '';
            comboBox8.innerHTML = '';
            comboBox9.innerHTML = '';
            comboBox10.innerHTML = '';
            comboBox11.innerHTML = '';
            comboBox12.innerHTML = '';
            comboBox13.innerHTML = '';

        // Agregar opciones al combobox
        Demographic_Filters.forEach(optionText => {
            let option = document.createElement('option');
            option.value = optionText;
            option.text = optionText;
            comboBox.appendChild(option);
            comboBox2.appendChild(option.cloneNode(true));
            comboBox3.appendChild(option.cloneNode(true));
            comboBoxUA.appendChild(option.cloneNode(true));
            comboBox4.appendChild(option.cloneNode(true));
            comboBox5.appendChild(option.cloneNode(true));
            comboBox6.appendChild(option.cloneNode(true));
            comboBox7.appendChild(option.cloneNode(true));
            comboBox8.appendChild(option.cloneNode(true));
            comboBox9.appendChild(option.cloneNode(true));
            comboBox10.appendChild(option.cloneNode(true));
            comboBox11.appendChild(option.cloneNode(true));
            comboBox12.appendChild(option.cloneNode(true));
            comboBox13.appendChild(option.cloneNode(true));

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

document.addEventListener('DOMContentLoaded', function () {
    // Asocia el evento a todos los botones save-textarea
    document.querySelectorAll("button[id^='save-textarea_']").forEach(button => {
        button.addEventListener('click', function () {
            // Obtiene el ID del botón y mapea al textarea correspondiente
            const buttonId = button.id;

            // Mapa de botones a textareas
            const textareaMap = {
                'save-textarea_ResumenGeneral': 'ResumenGeneralTextArea',
                'save-textarea_ResumenIndividual': 'ResumenIndividualTextArea',
                'save-textarea_UserPersona': 'UserPersonaTextArea',
                'save-textarea_UserArchetype': 'UserArchetypeTextArea',
                'save-textarea_AP_Ekman': 'EKMANTextArea',
                'save-textarea_AP_RasgosDePersonalidad': 'RasgosDePersonalidadTextArea',
                'save-textarea_AP_SegmentosPsicograficos': 'SegmentosPsicograficosTextArea',
                'save-textarea_AP_NPS': 'NPSTextArea',
                'save-textarea_AP_EstiloDeComunicacion': 'EstiloDeComunicacionTextArea',
                'save-textarea_customerExperience': 'customerExperienceTextArea',
                'save-textarea_AP_Satisfaccion' : 'SatisfaccionTextArea',
                'save-textarea_AP_BrandStrenght': 'BrandStrenghtTextArea',
                'save-textarea_AP_BrandEquity': 'BrandEquityTextArea',
                'save-textarea_AP_ClimaLaboral': 'ClimaLaboralTextArea'
                
                
            };

            //conseguir los comboboxes de cada seccion

            const comboBoxRG = document.getElementById('ComboBox_ResumenGeneral');
            const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
            const comboBoxUP = document.getElementById('Combobox_UserPersona');
            const comboBoxUA = document.getElementById('Combobox_UserArchetype');
            const comboBoxEK = document.getElementById('Combobox_EKMAN');
            const comboBoxRP = document.getElementById('Combobox_RasgosDePersonalidad');
            const comboBoxSP = document.getElementById('Combobox_SegmentosPsicograficos');
            const comboBoxNPS = document.getElementById('Combobox_NPS');
            const comboBoxEC = document.getElementById('Combobox_EstiloDeComunicacion');
            const comboBoxCE = document.getElementById('Combobox_customerExperience');
            const comboBoxSat = document.getElementById('Combobox_Satisfaccion');
            const comboBoxCL = document.getElementById('Combobox_ClimaLaboral');
            const comboBoxBS = document.getElementById('Combobox_BrandStrenght');
            const comboBoxBE = document.getElementById('Combobox_BrandEquity');

            //conseguir el combobox seleccionado de cada seccion
            const StyleSelectedOptionRG = comboBoxRG.options[comboBoxRG.selectedIndex];
            const StyleSelectedOptionRI = comboBoxRI.options[comboBoxRI.selectedIndex];
            const StyleSelectedOptionUP = comboBoxUP.options[comboBoxUP.selectedIndex];
            const StyleSelectedOptionUA = comboBoxUA.options[comboBoxUA.selectedIndex];
            const StyleSelectedOptionEK = comboBoxEK.options[comboBoxEK.selectedIndex];
            const StyleSelectedOptionRP = comboBoxRP.options[comboBoxRP.selectedIndex];
            const StyleSelectedOptionSP = comboBoxSP.options[comboBoxSP.selectedIndex];
            const StyleSelectedOptionNPS = comboBoxNPS.options[comboBoxNPS.selectedIndex];
            const StyleSelectedOptionEC = comboBoxEC.options[comboBoxEC.selectedIndex];
            const StyleSelectedOptionCE = comboBoxCE.options[comboBoxCE.selectedIndex];
            const StyleSelectedOptionSat = comboBoxSat.options[comboBoxSat.selectedIndex];
            const StyleSelectedOptionCL = comboBoxCL.options[comboBoxCL.selectedIndex];
            const StyleSelectedOptionBS = comboBoxBS.options[comboBoxBS.selectedIndex];
            const StyleSelectedOptionBE = comboBoxBE.options[comboBoxBE.selectedIndex];

            //conseguir el valor del combobox seleccionado de cada seccion
            const StyleSelectedOptionRGValue = StyleSelectedOptionRG.value;
            const StyleSelectedOptionRIValue = StyleSelectedOptionRI.value;
            const StyleSelectedOptionUPValue = StyleSelectedOptionUP.value;
            const StyleSelectedOptionUAValue = StyleSelectedOptionUA.value;
            const StyleSelectedOptionEKValue = StyleSelectedOptionEK.value;
            const StyleSelectedOptionRPValue = StyleSelectedOptionRP.value;
            const StyleSelectedOptionSPValue = StyleSelectedOptionSP.value;
            const StyleSelectedOptionNPSValue = StyleSelectedOptionNPS.value;
            const StyleSelectedOptionECValue = StyleSelectedOptionEC.value;
            const StyleSelectedOptionCEValue = StyleSelectedOptionCE.value;
            const StyleSelectedOptionSatValue = StyleSelectedOptionSat.value;
            const StyleSelectedOptionCLValue = StyleSelectedOptionCL.value;
            const StyleSelectedOptionBSValue = StyleSelectedOptionBS.value;
            const StyleSelectedOptionBEValue = StyleSelectedOptionBE.value;

            //en el caso de el resumen general y el resumen individual, conseguir los subfiltros 
            const StyleSelectedOptionRGSub = document.getElementById('ComboBox_ResumenGeneralTy');
            const StyleSelectedOptionRISub = document.getElementById('ComboBox_ResumenIndividualTy');

            //conseguir el valor del subfiltro seleccionado
            const StyleSelectedOptionRGSubValue = StyleSelectedOptionRGSub.value;
            const StyleSelectedOptionRISubValue = StyleSelectedOptionRISub.value;

            //conseguir el textarea correspondiente
            const textarea = document.getElementById(textareaMap[buttonId]);

            //al estar harcodeado los valorsespecificos de cada seccion, se debe de hacer un switch case para cada seccion
            switch (buttonId) {
                case 'save-textarea_ResumenGeneral':
                    {
                    //enviar el texto del textarea al backend
                    const formDataRG = new FormData();
                    formDataRG.append('filter', StyleSelectedOptionRGValue);
                    formDataRG.append('module', 'general');
                    formDataRG.append('sub_module', StyleSelectedOptionRGSubValue);
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionRGValue + '.md';

                    formDataRG.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataRG)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_ResumenIndividual':
                    {
                    //enviar el texto del textarea al backend
                    const formDataRI = new FormData();
                    formDataRI.append('filter', StyleSelectedOptionRIValue);
                    formDataRI.append('module', 'individual_questions');
                    formDataRI.append('sub_module', StyleSelectedOptionRISubValue);
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionRIValue + '.md';

                    formDataRI.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataRI)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_UserPersona':
                    {
                    //enviar el texto del textarea al backend
                    const formDataUP = new FormData();
                    formDataUP.append('filter', StyleSelectedOptionUPValue);
                    formDataUP.append('module', 'user_personas');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionUPValue + '.md';

                    formDataUP.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataUP)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_UserArchetype':
                    {
                    const formDataUA = new FormData();
                    formDataUA.append('filter', StyleSelectedOptionUAValue);
                    formDataUA.append('module', 'user_archetype');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionUAValue + '.md';

                    formDataUA.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataUA)
                        .then(function (response) {
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_AP_Ekman':
                    {
                    //enviar el texto del textarea al backend
                    const formDataEK = new FormData();
                    formDataEK.append('filter', StyleSelectedOptionEKValue);
                    formDataEK.append('module', 'psicographic_questions');
                    formDataEK.append('sub_module', 'ekman');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionEKValue + '.md';

                    formDataEK.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataEK)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_AP_RasgosDePersonalidad':{
                    //enviar el texto del textarea al backend
                    const formDataRP = new FormData();
                    formDataRP.append('filter', StyleSelectedOptionRPValue);
                    formDataRP.append('module', 'psicographic_questions');
                    formDataRP.append('sub_module', 'personality');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionRPValue + '.md';

                    formDataRP.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataRP)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_AP_SegmentosPsicograficos':
                    {
                    //enviar el texto del textarea al backend
                    const formDataSP = new FormData();
                    formDataSP.append('filter', StyleSelectedOptionSPValue);
                    formDataSP.append('module', 'psicographic_questions');
                    formDataSP.append('sub_module', 'segmentos');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionSPValue + '.md';

                    formDataSP.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataSP)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_AP_NPS':{
                    //enviar el texto del textarea al backend
                    const formDataNPS = new FormData();
                    formDataNPS.append('filter', StyleSelectedOptionNPSValue);
                    formDataNPS.append('module', 'psicographic_questions');
                    formDataNPS.append('sub_module', 'nps');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionNPSValue + '.md';

                    formDataNPS.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataNPS)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;
                case 'save-textarea_AP_EstiloDeComunicacion':
                    {
                    //enviar el texto del textarea al backend
                    const formDataEC = new FormData();
                    formDataEC.append('filter', StyleSelectedOptionECValue);
                    formDataEC.append('module', 'psicographic_questions');
                    formDataEC.append('sub_module', 'estilo');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionECValue + '.md';

                    formDataEC.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataEC)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;

                case 'save-textarea_customerExperience':
                    {
                    //enviar el texto del textarea al backend
                    const formDataCE = new FormData();
                    formDataCE.append('filter', StyleSelectedOptionCEValue);
                    formDataCE.append('module', 'customer_experience');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionCEValue + '.md';

                    formDataCE.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataCE)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;

                case 'save-textarea_AP_Satisfaccion':
                    {
                    //enviar el texto del textarea al backend
                    const formDataSat = new FormData();
                    formDataSat.append('filter', StyleSelectedOptionSatValue);
                    formDataSat.append('module', 'psicographic_questions');
                    formDataSat.append('sub_module', 'customer_satisfaction');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionSatValue + '.md';

                    formDataSat.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataSat)
                        .then(function (response) {
                            // console.log(response.data);
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                    }
                    break;

                    //FALTAN LOS DE CLIMA LABORAL, BRAND STRENGHT Y BRAND EQUITY

                case 'save-textarea_AP_ClimaLaboral':
                    {
                    //enviar el texto del textarea al backend
                    const formDataCL = new FormData();
                    formDataCL.append('filter', StyleSelectedOptionCLValue);
                    formDataCL.append('module', 'work_environment');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionCLValue + '.md';

                    formDataCL.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataCL)
                        .then(function (response) {

                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                }
                break;

                case 'save-textarea_AP_BrandStrenght':
                    {
                    //enviar el texto del textarea al backend
                    const formDataBS = new FormData();
                    formDataBS.append('filter', StyleSelectedOptionBSValue);
                    formDataBS.append('module', 'brand_status');
                    formDataBS.append('sub_module', 'brand_strength');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionBSValue + '.md';

                    formDataBS.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataBS)
                        .then(function (response) {

                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                }
                break;

                case 'save-textarea_AP_BrandEquity':
                    {
                    //enviar el texto del textarea al backend
                    const formDataBE = new FormData();
                    formDataBE.append('filter', StyleSelectedOptionBEValue);
                    formDataBE.append('module', 'brand_status');
                    formDataBE.append('sub_module', 'brand_equity');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionBEValue + '.md';

                    formDataBE.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${localStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataBE)
                        .then(function (response) {
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                }
                break;


                default:
                    break;
            }
        });
    });
});



function LLenarResumenes(){
            //lenar el div con el resumen general y agregar el event listener al combobox con id ComboBox_ResumenGeneral
            const comboBoxRG = document.getElementById('ComboBox_ResumenGeneral');          
            comboBoxRG.addEventListener('change', (event) => {
                // console.log(event.target.value);

                const StyleSelectedOption = document.getElementById('ComboBox_ResumenGeneralTy');

                var div = document.getElementById('ResumenGeneralContent');
                //textarea
                var textArea = document.getElementById('ResumenGeneralTextArea');
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
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;   
                        textArea.value = data;                   
                        // console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // Segunda petición para Markmap
                        formData = new FormData();
                        formData.append('filter', selectedValue); // Se corrigió el error aquí
                        formData.append('module', 'general');
                        formData.append('sub_module', 'markmap');

                        axios.post(url, formData)
                            .then(function (response) {
                                var data = response.data;
                                if (!data.startsWith("#")) {
                                    data = data.substring(data.indexOf("#"));
                                    data = data.substring(0, data.length - 3);
                                }

                                generateMarkmapHTML(data, selectedValue);
                            })
                            .catch(function (error) {
                                console.error('Error al obtener el contenido de Markmap:', error);
                            });                    
                        
                    });
                
            });


            //Resumen Individual
            //lenar el div con el resumen general y agregar el event listener al combobox con id ComboBox_ResumenIndividual
            const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
            
            comboBoxRI.addEventListener('change', (event) => {
                // console.log(event.target.value);

                const StyleSelectedOption = document.getElementById('ComboBox_ResumenIndividualTy');

                var div = document.getElementById('ResumenIndividualContent');
                var textArea = document.getElementById('ResumenIndividualTextArea');
                var graphs = document.getElementById('charts-containerResumenIndividualContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value; //el filtro seleccionado
                formData = new FormData();
                formData.append('filter', selectedValue);
                formData.append('module', 'individual_questions');
                formData.append('sub_module', StyleSelectedOption.value);
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;          
                        textArea.value = data;     
                        let graphDta = splitMarkdown(data);    
                        generateCharts(graphDta);

                        // console.log(data);
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
            const comboBoxUA = document.getElementById('Combobox_UserArchetype');
            const comboBoxEK = document.getElementById('Combobox_EKMAN');
            const comboBoxRP = document.getElementById('Combobox_RasgosDePersonalidad');
            const comboBoxSP = document.getElementById('Combobox_SegmentosPsicograficos');
            const comboBoxNPS = document.getElementById('Combobox_NPS');
            const comboBoxEC = document.getElementById('Combobox_EstiloDeComunicacion');
            const comboBoxCE = document.getElementById('Combobox_customerExperience');
            const comboBoxSat = document.getElementById('Combobox_Satisfaccion');
            const comboBoxCL = document.getElementById('Combobox_ClimaLaboral');
            const comboBoxBS = document.getElementById('Combobox_BrandStrenght');
            const comboBoxBE = document.getElementById('Combobox_BrandEquity');

            //User Persona, perfecto
            comboBoxUP.addEventListener('change', (event) => {
                //Llenar el user persona de la misma fotma que se llenan los anteriores 

                // console.log(event.target.value);


                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('UserPersonaContent');
                var textArea = document.getElementById('UserPersonaTextArea');

                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'user_personas');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;          
                        textArea.value = data;            
                        // console.log(data);
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

            //customer Experience, perfecto
            comboBoxCE.addEventListener('change', (event) => {
                // console.log(event.target.value);

                var div = document.getElementById('customerExperienceContent');
                var textArea = document.getElementById('customerExperienceTextArea');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'customer_experience');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;          
                        textArea.value = data;            
                        // console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            });


            //ekman, perfecto
            comboBoxEK.addEventListener('change', (event) => {
                // console.log(event.target.value);


                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('EKMANContent');
                var textArea = document.getElementById('EKMANTextArea');
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
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;  
                        textArea.value = data;                    
                        // console.log(data);
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
                // console.log(event.target.value);

                // console.log(event.target.value);


                // Obtener el div donde se mostrará el contenido
                var div = document.getElementById('RasgosDePersonalidadContent');
                var textArea = document.getElementById('RasgosDePersonalidadTextArea');
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
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;        
                        textArea.value = data;              
                        // console.log(data);
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
                // console.log(event.target.value);

                var div = document.getElementById('SegmentosPsicograficosContent');
                var textArea = document.getElementById('SegmentosPsicograficosTextArea');
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
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;      
                        textArea.value = data;                
                        // console.log(data);
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
                // console.log(event.target.value);

                var div = document.getElementById('NPSContent');
                var textArea = document.getElementById('NPSTextArea');
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
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;     
                        textArea.value = data;                 
                        // console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed

                    });
            });

            //satisfaccion, Perfecto 
            comboBoxSat.addEventListener('change', (event) => {
                // console.log(event.target.value);

                var div = document.getElementById('SatisfaccionContent');
                var textArea = document.getElementById('SatisfaccionTextArea');

                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value;

                formData = new FormData();
                formData.append('filter', selectedValue);
                formData.append('module', 'psicographic_questions');
                formData.append('sub_module', 'customer_satisfaction');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf('#'));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);
                        div.innerHTML = coso;
                        textArea.value = data;
                        // console.log(data);
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
                // console.log(event.target.value);

                var div = document.getElementById('EstiloDeComunicacionContent');
                var textArea = document.getElementById('EstiloDeComunicacionTextArea');
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
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;   
                        textArea.value = data;                   
                        // console.log(data);
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            });



            //clima laboral, perfecto
            
            comboBoxCL.addEventListener('change', (event) => {
                var div = document.getElementById('ClimaLaboralContent');
                var textArea = document.getElementById('ClimaLaboralTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'work_environment');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;   
                        textArea.value = data;                   
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {

                    });
            });

            //brand strength, perfecto

            comboBoxBS.addEventListener('change', (event) => {
                var div = document.getElementById('BrandStrenghtContent');
                var textArea = document.getElementById('BrandStrenghtTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'brand_status');
                formData.append('sub_module', 'brand_strength');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;   
                        textArea.value = data;                   
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {

                    });
            });


            //brand equity, perfecto
            comboBoxBE.addEventListener('change', (event) => {
                var div = document.getElementById('BrandEquityContent');
                var textArea = document.getElementById('BrandEquityTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'brand_status');
                formData.append('sub_module', 'brand_equity');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;   
                        textArea.value = data;                   
                    })
                    .catch(function (error) {
                        div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                        console.log(error);
                    })
                    .then(function () {

                    });
            });

            // User Archetype
            comboBoxUA.addEventListener('change', (event) => {
                var div = document.getElementById('UserArchetypeContent');
                var textArea = document.getElementById('UserArchetypeTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'user_archetype'); // API endpoint for User Archetype
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + localStorage.getItem('selectedStudyId');
                axios.post(url, formData)
                    .then(function (response) {
                        var data = response.data;
                        if (!data.startsWith("#")) {
                            data = data.substring(data.indexOf("#"));
                            data = data.substring(0, data.length - 3);
                        }
                        const coso = marked(data);                          
                        div.innerHTML = coso;          
                        textArea.value = data;            
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
    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };

    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;
    //charts-containerResumenIndividualContent ocultar
    document.getElementById('charts-containerResumenIndividualContent').style.display = 'none';
    document.getElementById('ComboBox_ResumenIndividualDS').style.display = 'none';
    document.getElementById('ComboBox_ResumenIndividualDSLBL').style.display = 'none';

    AgregarFiltros();
    LLenarResumenes();

});

//ocultar todos los text area 

document.addEventListener('DOMContentLoaded', function () {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.style.display = 'none';
    });
});

//que al presionar los botones toggle-textarea_* aparezcan las text area 
document.addEventListener('DOMContentLoaded', function () {

    const studyId = localStorage.getItem('selectedStudyId');
    setColorsFromAPI(studyId);//Setea colores

    const toggleButtons = document.querySelectorAll('[id^="toggle-textarea_"]');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Encontrar el textarea dentro de la misma sección del botón
            const section = button.closest('.tab-pane');
            const textarea = section.querySelector('textarea');
            
            if (textarea) {
                // Alternar visibilidad del textarea
                if (textarea.style.display === 'none' || textarea.style.display === '') {
                    textarea.style.display = 'block';
                } else {
                    textarea.style.display = 'none';
                }
            }
        });
    });
});


//mierda para visualizar los cambios en el markdown
document.addEventListener('DOMContentLoaded', function () {

    // Seleccionar todos los textarea y contenedores de contenido relacionados
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabPanes.forEach(tabPane => {
        const textarea = tabPane.querySelector('textarea');
        const contentDiv = tabPane.querySelector('div[id$="Content"]'); // Div cuyo ID termina en "Content"

        if (textarea && contentDiv) {
            // Agregar evento 'input' para actualizar contenido dinámicamente
            textarea.addEventListener('input', function () {

                // Convertir el texto ingresado en HTML procesado, si es necesario
                const processedContent = marked.parse(textarea.value); // Usa marked.js para Markdown a HTML

                // Actualizar el contenido del div relacionado
                contentDiv.innerHTML = processedContent;
            });
        }
    });

});


document.addEventListener('DOMContentLoaded', function () {
    const exportButtons = document.querySelectorAll('button[id^="export_"]');

    exportButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parentTabPane = button.closest('.tab-pane');
            const activeTab = document.querySelector('.tab-pane.active'); // Detecta la pestaña activa

            // Verificar si estamos en la pestaña activa y si el contenedor de gráficos está presente
            const chartsContainer = activeTab ? activeTab.querySelector('#charts-containerResumenIndividualContent') : null;

            if (chartsContainer) {
                // Establecer el estilo de salto de página
                const charts = chartsContainer.querySelectorAll('.chart-box');
                charts.forEach((chart, index) => {
                    // Cada dos gráficos, agregar un salto de página
                    if (index % 2 !== 0) {
                        chart.style.pageBreakAfter = 'always';
                    } else {
                        chart.style.pageBreakAfter = 'auto';
                    }
                });

                const options = {
                    margin: 1,
                    filename: 'charts_resumen_individual.pdf',
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                };

                // Exportar todos los canvas dentro del chartsContainer
                html2pdf().set(options).from(chartsContainer).save();
            } else {

                const contentDiv = parentTabPane.querySelector('div[id$="Content"]'); // Div cuyo ID termina en "Content"
 
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
                // console.log(response.data);
                alert('Archivos subidos exitosamente');
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
            });
        // Aquí puedes hacer algo con los archivos seleccionados, como guardarlos en un arreglo o procesarlos de alguna manera
        // console.log(files);
    });
    fileChooser.click();
});

// LLAMAR A /configuration/forzar/<study_id> para forzar el analisis al presionarl el boton botonForzarA
const botonForzarA = document.getElementById('botonForzarA');
botonForzarA.addEventListener('click', () => {
    const url = "https://api.cheetah-research.ai/configuration/forzar/" + localStorage.getItem('selectedStudyId');

    axios.get(url)
        .then(response => {
            // console.log(response.data);
            alert('Análisis forzado exitosamente');
        })
        .catch(error => {
            console.error('Error al forzar el análisis:', error);
        });
});



document.getElementById('ComboBox_ResumenIndividualDS').addEventListener('change', function(event) {
    const selectedValue = event.target.value; // Obtiene el valor seleccionado

    // Elementos a mostrar/ocultar
    const resumenIndividualContent = document.getElementById('ResumenIndividualContent');
    const resumenIndividualTextArea = document.getElementById('ResumenIndividualTextArea');
    const chartsContainerResumenIndividual = document.getElementById('charts-containerResumenIndividualContent');

    // Condicional para manejar la visualización
    if (selectedValue === 'individual_Cat') {
        // Mostrar el contenedor de charts y ocultar el resto
        chartsContainerResumenIndividual.style.display = 'block';
        resumenIndividualContent.style.display = 'none';
        resumenIndividualTextArea.style.display = 'none';
    } else if (selectedValue === 'percentage_nonCat') {
        // Mostrar el contenido y ocultar el contenedor de charts
        chartsContainerResumenIndividual.style.display = 'none';
        resumenIndividualContent.style.display = 'block';
        resumenIndividualTextArea.style.display = 'none';
    } else {
        // Si no se selecciona ninguna opción válida, ocultar todo
        chartsContainerResumenIndividual.style.display = 'none';
        resumenIndividualContent.style.display = 'none';
        resumenIndividualTextArea.style.display = 'none';
    }
});

document.getElementById('ComboBox_ResumenIndividualTy').addEventListener('change', function(event) {
    const selectedValue = event.target.value; // Obtiene el valor seleccionado

    // al seleccionar percentage que muestre ComboBox_ResumenIndividualDS, de lo contrario se mantiene oculto
    const comboBoxResumenIndividualDS = document.getElementById('ComboBox_ResumenIndividualDS');
    const comboBoxResumenIndividualDSLBL = document.getElementById('ComboBox_ResumenIndividualDSLBL');
    if (selectedValue === 'percentage') {
        comboBoxResumenIndividualDS.style.display = 'block';
        comboBoxResumenIndividualDSLBL.style.display = 'block';
    } else {
        comboBoxResumenIndividualDS.style.display = 'none';
        comboBoxResumenIndividualDSLBL.style.display = 'none';
    }


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

// User Persona and User Archetype functionality
const userPersonaBtn = document.getElementById('UserPersonaBtn');
const userArchetypeBtn = document.getElementById('UserArchetypeBtn');
const userPersonaContent = document.getElementById('UserPersonaContent');
const userArchetypeContent = document.getElementById('UserArchetypeContent');
const comboboxUserPersona = document.getElementById('Combobox_UserPersona');
const comboboxUserArchetype = document.getElementById('Combobox_UserArchetype');
const comboboxUserPersonaSubFiltro = document.getElementById('ComboBox_UserPersona_SubFiltro');
const comboboxUserArchetypeSubFiltro = document.getElementById('ComboBox_UserArchetype_SubFiltro');
const exportUserPersonaBtn = document.getElementById('export_UserPersona');
const exportUserArchetypeBtn = document.getElementById('export_UserArchetype');
const toggleTextareaUserPersonaBtn = document.getElementById('toggle-textarea_UserPersona');
const toggleTextareaUserArchetypeBtn = document.getElementById('toggle-textarea_UserArchetype');
const saveTextareaUserPersonaBtn = document.getElementById('save-textarea_UserPersona');
const saveTextareaUserArchetypeBtn = document.getElementById('save-textarea_UserArchetype');
const userPersonaTextArea = document.getElementById('UserPersonaTextArea');
const userArchetypeTextArea = document.getElementById('UserArchetypeTextArea');

// Function to load data for both User Persona and User Archetype
async function loadUserData(type, contentDiv, combobox, subFiltro, textarea) {
    try {
        const endpoint = type === 'persona' ? 'user_persona' : 'user_archetype';
        const response = await fetch(`/api/${endpoint}`);
        const data = await response.json();

        // Populate combobox with filters
        combobox.innerHTML = '<option value="">Selecciona un filtro</option>';
        data.filters.forEach(filter => {
            const option = document.createElement('option');
            option.value = filter;
            option.textContent = filter;
            combobox.appendChild(option);
        });

        // Show/hide subfiltro based on selected filter
        combobox.addEventListener('change', function() {
            if (this.value === 'Temporal') {
                subFiltro.style.display = 'inline-block';
            } else {
                subFiltro.style.display = 'none';
            }
        });

        // Load initial content
        if (data.content) {
            contentDiv.innerHTML = data.content;
            textarea.value = data.content;
        }
    } catch (error) {
        console.error(`Error loading ${type} data:`, error);
        contentDiv.innerHTML = `<p>Error loading ${type} data. Please try again later.</p>`;
    }
}

// Event listeners for User Persona
userPersonaBtn.addEventListener('click', () => {
    loadUserData('persona', userPersonaContent, comboboxUserPersona, comboboxUserPersonaSubFiltro, userPersonaTextArea);
});

comboboxUserPersona.addEventListener('change', async function() {
    const filter = this.value;
    const subFilter = comboboxUserPersonaSubFiltro.value;
    try {
        const response = await fetch(`/api/user_persona?filter=${filter}&subFilter=${subFilter}`);
        const data = await response.json();
        if (data.content) {
            userPersonaContent.innerHTML = data.content;
            userPersonaTextArea.value = data.content;
        }
    } catch (error) {
        console.error('Error updating User Persona content:', error);
    }
});

// Event listeners for User Archetype
userArchetypeBtn.addEventListener('click', () => {
    loadUserData('archetype', userArchetypeContent, comboboxUserArchetype, comboboxUserArchetypeSubFiltro, userArchetypeTextArea);
});

comboboxUserArchetype.addEventListener('change', async function() {
    const filter = this.value;
    const subFilter = comboboxUserArchetypeSubFiltro.value;
    try {
        const response = await fetch(`/api/user_archetype?filter=${filter}&subFilter=${subFilter}`);
        const data = await response.json();
        if (data.content) {
            userArchetypeContent.innerHTML = data.content;
            userArchetypeTextArea.value = data.content;
        }
    } catch (error) {
        console.error('Error updating User Archetype content:', error);
    }
});

// Toggle textarea visibility for User Persona
toggleTextareaUserPersonaBtn.addEventListener('click', () => {
    userPersonaTextArea.style.display = userPersonaTextArea.style.display === 'none' ? 'block' : 'none';
});

// Toggle textarea visibility for User Archetype
toggleTextareaUserArchetypeBtn.addEventListener('click', () => {
    userArchetypeTextArea.style.display = userArchetypeTextArea.style.display === 'none' ? 'block' : 'none';
});

// Save changes for User Persona
saveTextareaUserPersonaBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/user_persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: userPersonaTextArea.value,
                filter: comboboxUserPersona.value,
                subFilter: comboboxUserPersonaSubFiltro.value
            })
        });
        if (response.ok) {
            userPersonaContent.innerHTML = userPersonaTextArea.value;
            alert('Changes saved successfully!');
        }
    } catch (error) {
        console.error('Error saving User Persona changes:', error);
        alert('Error saving changes. Please try again.');
    }
});

// Save changes for User Archetype
saveTextareaUserArchetypeBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/user_archetype', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: userArchetypeTextArea.value,
                filter: comboboxUserArchetype.value,
                subFilter: comboboxUserArchetypeSubFiltro.value
            })
        });
        if (response.ok) {
            userArchetypeContent.innerHTML = userArchetypeTextArea.value;
            alert('Changes saved successfully!');
        }
    } catch (error) {
        console.error('Error saving User Archetype changes:', error);
        alert('Error saving changes. Please try again.');
    }
});

// Export functionality for both
exportUserPersonaBtn.addEventListener('click', () => {
    exportContent(userPersonaContent, 'user_persona');
});

exportUserArchetypeBtn.addEventListener('click', () => {
    exportContent(userArchetypeContent, 'user_archetype');
});