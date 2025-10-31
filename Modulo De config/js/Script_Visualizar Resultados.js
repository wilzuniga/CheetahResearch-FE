let Demographic_Filters = [];
let formData = new FormData();  // Asegúrate de que esta línea está presente donde se necesita
let markmapBlobUrl = null;
let sankeyBlobUrl = null;



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

function generateSankeyHTML(matrixData, filter) {
    // Parsear la matriz del endpoint
    let matriz;
    try {
        if (typeof matrixData === 'string') {
            let cleanData = matrixData.trim();
            
            // Remover comillas triples si existen
            if (cleanData.startsWith("'''") && cleanData.endsWith("'''")) {
                cleanData = cleanData.slice(3, -3).trim();
            }
            
            // Si contiene "var matriz = ", extraer solo la parte de la matriz
            if (cleanData.includes('var matriz = ')) {
                const startIndex = cleanData.indexOf('var matriz = ') + 'var matriz = '.length;
                let endIndex = cleanData.length;
                
                // Buscar el punto y coma final si existe
                const semicolonIndex = cleanData.indexOf(';', startIndex);
                if (semicolonIndex !== -1) {
                    endIndex = semicolonIndex;
                }
                
                cleanData = cleanData.substring(startIndex, endIndex).trim();
            }
            
            // Evaluar la matriz
            matriz = eval(cleanData);
        } else {
            matriz = matrixData;
        }
    } catch (error) {
        console.error('Error parsing Sankey matrix:', error);
        console.error('Raw data:', matrixData);
        matriz = [];
    }

    // Estructura HTML con el contenido dinámico
    var htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Diagrama Sankey - ${filter}</title>
  <script src="https://www.gstatic.com/charts/loader.js"></script>
  <style>
    html, body {
      margin: 0; padding: 0; height: 100%; background: #fff; font-family: sans-serif;
    }
    #sankey_wrapper {
      width: 100%; height: 100vh; overflow: auto; padding: 16px; box-sizing: border-box;
    }
    #sankey_chart {
      width: 1200px; /* ancho fijo para permitir scroll horizontal */
      height: 800px; /* alto suficiente para scroll vertical si hace falta */
    }
  </style>
  <script>
    google.charts.load('current', {packages:['sankey']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'From');
      data.addColumn('string', 'To');
      data.addColumn('number', 'Weight');

      var matriz = ${JSON.stringify(matriz)};
      data.addRows(matriz);

      const options = {
        sankey: {
          node: { nodePadding: 20, label: { fontSize: 12 } },
          link: { colorMode: 'gradient' }
        }
      };

      const chart = new google.visualization.Sankey(document.getElementById('sankey_chart'));
      chart.draw(data, options);
    }

    window.addEventListener('resize', drawChart);
  </script>
</head>
<body>
  <div id="sankey_wrapper">
    <div id="sankey_chart"></div>
  </div>
</body>
</html>`;

    // Crear un Blob con el contenido HTML
    var blob = new Blob([htmlContent], { type: "text/html" });

    // Revocar URL anterior si existe (para liberar memoria)
    if (sankeyBlobUrl) {
        URL.revokeObjectURL(sankeyBlobUrl);
    }

    // Crear un nuevo objeto URL
    sankeyBlobUrl = URL.createObjectURL(blob);

    // Habilitar el botón de descarga
    let downloadBtn = document.getElementById("download_sankey");
    if (downloadBtn) {
        downloadBtn.style.display = "block"; // Mostrar el botón
        downloadBtn.onclick = function () {
            let a = document.createElement("a");
            a.href = sankeyBlobUrl;
            a.download = `sankey - ${filter}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }
}


function AgregarFiltros() {
    const url = "https://api.cheetah-research.ai/configuration/get_filters/" + sessionStorage.getItem('selectedStudyId');

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
            const comboBoxRICompare = document.getElementById('ComboBox_ResumenIndividual_Compare');
            const comboBoxRICompareLBL = document.getElementById('ComboBox_ResumenIndividualCompareLBL');
            const comboBox3 = document.getElementById('Combobox_UserPersona');
            const comboBoxUA = document.getElementById('Combobox_UserArchetype');
            const comboBox4 = document.getElementById('Combobox_EKMAN');
            const comboBox5 = document.getElementById('Combobox_RasgosDePersonalidad');
            const comboBox6 = document.getElementById('Combobox_SegmentosPsicograficos');
            const comboBox7 = document.getElementById('Combobox_NPS');
            const comboBox8 = document.getElementById('Combobox_EstiloDeComunicacion');
            const comboBoxBig5_1 = document.getElementById('Combobox_Big5');
            const comboBox9 = document.getElementById('Combobox_customerExperience');
            const comboBox10 = document.getElementById('Combobox_Satisfaccion');
            const comboBox11 = document.getElementById('Combobox_ClimaLaboral');
            const comboBox12 = document.getElementById('Combobox_BrandStrenght');
            const comboBox13 = document.getElementById('Combobox_BrandEquity');
            const comboBox14 = document.getElementById('Combobox_CustomerJourney');
            const comboBox15 = document.getElementById('Combobox_Reputacion');
            const comboBox16 = document.getElementById('Combobox_PruebaProducto');
            const comboBox17 = document.getElementById('Combobox_FocusDecoder');

            comboBox.innerHTML = '';
            comboBox2.innerHTML = '';
            if (comboBoxRICompare) comboBoxRICompare.innerHTML = '';
            comboBox3.innerHTML = '';
            comboBoxUA.innerHTML = '';
            comboBox4.innerHTML = '';
            comboBox5.innerHTML = '';
            comboBox6.innerHTML = '';
            comboBox7.innerHTML = '';
            comboBox8.innerHTML = '';
            comboBoxBig5_1.innerHTML = '';
            comboBox9.innerHTML = '';
            comboBox10.innerHTML = '';
            comboBox11.innerHTML = '';
            comboBox12.innerHTML = '';
            comboBox13.innerHTML = '';
            comboBox14.innerHTML = '';
            comboBox15.innerHTML = '';
            comboBox16.innerHTML = '';
            comboBox17.innerHTML = '';

        // Agregar opciones al combobox
        Demographic_Filters.forEach(optionText => {
            let option = document.createElement('option');
            option.value = optionText;
            option.text = optionText;
            comboBox.appendChild(option);
            comboBox2.appendChild(option.cloneNode(true));
            if (comboBoxRICompare) comboBoxRICompare.appendChild(option.cloneNode(true));
            comboBox3.appendChild(option.cloneNode(true));
            comboBoxUA.appendChild(option.cloneNode(true));
            comboBox4.appendChild(option.cloneNode(true));
            comboBox5.appendChild(option.cloneNode(true));
            comboBox6.appendChild(option.cloneNode(true));
            comboBox7.appendChild(option.cloneNode(true));
            comboBox8.appendChild(option.cloneNode(true));
            comboBoxBig5_1.appendChild(option.cloneNode(true));
            comboBox9.appendChild(option.cloneNode(true));
            comboBox10.appendChild(option.cloneNode(true));
            comboBox11.appendChild(option.cloneNode(true));
            comboBox12.appendChild(option.cloneNode(true));
            comboBox13.appendChild(option.cloneNode(true));
            comboBox14.appendChild(option.cloneNode(true));
            comboBox15.appendChild(option.cloneNode(true));
            comboBox16.appendChild(option.cloneNode(true));
            comboBox17.appendChild(option.cloneNode(true));

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
    //Idioma
    const lang = sessionStorage.getItem('language') || 'es';
    setLanguage(lang);
    
    // Aplicar colores del estudio
    const studyId = sessionStorage.getItem('selectedStudyId');
    if (studyId) {
        setColorsFromAPI(studyId);
    }
    
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
                'save-textarea_AP_Big5': 'Big5TextArea',
                'save-textarea_customerExperience': 'customerExperienceTextArea',
                'save-textarea_AP_Satisfaccion' : 'SatisfaccionTextArea',
                'save-textarea_AP_BrandStrenght': 'BrandStrenghtTextArea',
                'save-textarea_AP_BrandEquity': 'BrandEquityTextArea',
                'save-textarea_AP_ClimaLaboral': 'ClimaLaboralTextArea',
                'save-textarea_AP_CustomerJourney': 'CustomerJourneyTextArea',
                'save-textarea_AP_Reputacion': 'ReputacionTextArea',
                'save-textarea_AP_PruebaProducto': 'PruebaProductoTextArea',
                'save-textarea_AP_FocusDecoder': 'FocusDecoderTextArea'
                
                
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
            const comboBoxBig5 = document.getElementById('Combobox_Big5');
            const comboBoxCE = document.getElementById('Combobox_customerExperience');
            const comboBoxSat = document.getElementById('Combobox_Satisfaccion');
            const comboBoxCL = document.getElementById('Combobox_ClimaLaboral');
            const comboBoxBS = document.getElementById('Combobox_BrandStrenght');
            const comboBoxBE = document.getElementById('Combobox_BrandEquity');
            const comboBoxCJ = document.getElementById('Combobox_CustomerJourney');
            const comboBoxREP = document.getElementById('Combobox_Reputacion');
            const comboBoxPP = document.getElementById('Combobox_PruebaProducto');
            const comboBoxFD = document.getElementById('Combobox_FocusDecoder');

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
            const StyleSelectedOptionBig5 = comboBoxBig5.options[comboBoxBig5.selectedIndex];
            const StyleSelectedOptionCE = comboBoxCE.options[comboBoxCE.selectedIndex];
            const StyleSelectedOptionSat = comboBoxSat.options[comboBoxSat.selectedIndex];
            const StyleSelectedOptionCL = comboBoxCL.options[comboBoxCL.selectedIndex];
            const StyleSelectedOptionBS = comboBoxBS.options[comboBoxBS.selectedIndex];
            const StyleSelectedOptionBE = comboBoxBE.options[comboBoxBE.selectedIndex];
            const StyleSelectedOptionCJ = comboBoxCJ.options[comboBoxCJ.selectedIndex];
            const StyleSelectedOptionREP = comboBoxREP.options[comboBoxREP.selectedIndex];
            const StyleSelectedOptionPP = comboBoxPP.options[comboBoxPP.selectedIndex];
            const StyleSelectedOptionFD = comboBoxFD.options[comboBoxFD.selectedIndex];

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
            const StyleSelectedOptionBig5Value = StyleSelectedOptionBig5.value;
            const StyleSelectedOptionCEValue = StyleSelectedOptionCE.value;
            const StyleSelectedOptionSatValue = StyleSelectedOptionSat.value;
            const StyleSelectedOptionCLValue = StyleSelectedOptionCL.value;
            const StyleSelectedOptionBSValue = StyleSelectedOptionBS.value;
            const StyleSelectedOptionBEValue = StyleSelectedOptionBE.value;
            const StyleSelectedOptionCJValue = StyleSelectedOptionCJ.value;
            const StyleSelectedOptionREPValue = StyleSelectedOptionREP.value;
            const StyleSelectedOptionPPValue = StyleSelectedOptionPP.value;
            const StyleSelectedOptionFDValue = StyleSelectedOptionFD.value;

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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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

                case 'save-textarea_AP_Big5':
                    {
                    //enviar el texto del textarea al backend
                    const formDataBig5 = new FormData();
                    formDataBig5.append('filter', StyleSelectedOptionBig5Value);
                    formDataBig5.append('module', 'psicographic_questions');
                    formDataBig5.append('sub_module', 'big5');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionBig5Value + '.md';

                    formDataBig5.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataBig5)
                        .then(function (response) {
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
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
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataBE)
                        .then(function (response) {
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                }
                break;

                case 'save-textarea_AP_CustomerJourney':
                    {
                    //enviar el texto del textarea al backend
                    const formDataCJ = new FormData();
                    formDataCJ.append('filter', StyleSelectedOptionCJValue);
                    formDataCJ.append('module', 'customer_journey');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionCJValue + '.md';

                    formDataCJ.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataCJ)
                        .then(function (response) {
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                }
                break;

                case 'save-textarea_AP_Reputacion':
                    {
                    //enviar el texto del textarea al backend
                    const formDataREP = new FormData();
                    formDataREP.append('filter', StyleSelectedOptionREPValue);
                    formDataREP.append('module', 'reputation');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionREPValue + '.md';

                    formDataREP.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataREP)
                        .then(function (response) {
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                }
                break;

                case 'save-textarea_AP_PruebaProducto':
                    {
                    //enviar el texto del textarea al backend
                    const formDataPP = new FormData();
                    formDataPP.append('filter', StyleSelectedOptionPPValue);
                    formDataPP.append('module', 'product_testing');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionPPValue + '.md';

                    formDataPP.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataPP)
                        .then(function (response) {
                            alert('Resumen guardado exitosamente');
                        })
                        .catch(function (error) {
                            console.error('Error al enviar los datos:', error);
                        });
                }
                break;

                case 'save-textarea_AP_FocusDecoder':
                    {
                    //enviar el texto del textarea al backend
                    const formDataFD = new FormData();
                    formDataFD.append('filter', StyleSelectedOptionFDValue);
                    formDataFD.append('module', 'focus_groups_decoder');
                    const fileContent = textarea.value;
                    const blob = new Blob([fileContent], { type: 'text/markdown' });
                    const filename = StyleSelectedOptionFDValue + '.md';

                    formDataFD.append('file', blob, filename);
                    const url = `https://api.cheetah-research.ai/configuration/upload_md/${sessionStorage.getItem('selectedStudyId')}`;
                    axios.post(url, formDataFD)
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                            })
                            .then(function () {
                                // Tercera petición para Sankey
                                formData = new FormData();
                                formData.append('filter', selectedValue);
                                formData.append('module', 'general');
                                formData.append('sub_module', 'sankey');
                
                                axios.post(url, formData)
                                    .then(function (response) {
                                        var data = response.data;
                                        generateSankeyHTML(data, selectedValue);
                                    })
                                    .catch(function (error) {
                                        console.error('Error al obtener el contenido de Sankey:', error);
                                    });
                            });                    
                        
                    });
                
            });


            //Resumen Individual
            //lenar el div con el resumen general y agregar el event listener al combobox con id ComboBox_ResumenIndividual
            const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
            const comboBoxRICompare = document.getElementById('ComboBox_ResumenIndividual_Compare');
            
            comboBoxRI.addEventListener('change', async (event) => {
                // console.log(event.target.value);

                const StyleSelectedOption = document.getElementById('ComboBox_ResumenIndividualTy');
                const compareSelect = document.getElementById('ComboBox_ResumenIndividual_Compare');

                var div = document.getElementById('ResumenIndividualContent');
                var textArea = document.getElementById('ResumenIndividualTextArea');
                var graphs = document.getElementById('charts-containerResumenIndividualContent');
                // Supongamos que `event.target.value` es el valor del combobox
                const selectedValue = event.target.value; //el filtro seleccionado
                formData = new FormData();
                formData.append('filter', selectedValue);
                formData.append('module', 'individual_questions');
                formData.append('sub_module', StyleSelectedOption.value);
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
                try {
                    const primaryResp = await axios.post(url, formData);
                    let data = primaryResp.data;
                    if (!data.startsWith("#")) {
                        data = data.substring(data.indexOf("#"));
                        data = data.substring(0, data.length - 3);
                    }
                    const coso = marked(data);
                    div.innerHTML = coso;
                    textArea.value = data;
                    // Generar gráficos siempre que la visualización seleccionada sea gráfica.
                    const displaySelect = document.getElementById('ComboBox_ResumenIndividualDS');
                    if (displaySelect && displaySelect.value === 'individual_Cat') {
                        // Solicitar SIEMPRE el sub_module 'percentage' para gráficos, independiente del estilo narrativo/textual mostrado
                        const formDataGraph = new FormData();
                        formDataGraph.append('filter', selectedValue);
                        formDataGraph.append('module', 'individual_questions');
                        formDataGraph.append('sub_module', 'percentage');

                        let graphDta = [];
                        try {
                            const graphResp = await axios.post(url, formDataGraph);
                            let dataG = graphResp.data;
                            if (!dataG.startsWith("#")) {
                                dataG = dataG.substring(dataG.indexOf("#"));
                                dataG = dataG.substring(0, dataG.length - 3);
                            }
                            graphDta = splitMarkdown(dataG);
                        } catch (e) {
                            console.error('Error al obtener datos para gráficos:', e);
                        }

                        // Intentar cargar comparación si hay un filtro elegido distinto al principal
                        let compareGraphData = null;
                        const compareValue = compareSelect ? compareSelect.value : null;
                        if (compareValue && compareValue !== 'Seleccionar filtro' && compareValue !== selectedValue) {
                            const formDataCompare = new FormData();
                            formDataCompare.append('filter', compareValue);
                            formDataCompare.append('module', 'individual_questions');
                            formDataCompare.append('sub_module', 'percentage');
                            try {
                                const compareResp = await axios.post(url, formDataCompare);
                                let dataC = compareResp.data;
                                if (!dataC.startsWith("#")) {
                                    dataC = dataC.substring(dataC.indexOf("#"));
                                    dataC = dataC.substring(0, dataC.length - 3);
                                }
                                compareGraphData = splitMarkdown(dataC);
                            } catch (e) {
                                console.error('Error al obtener datos de comparación:', e);
                            }
                        }

                        // Obtener el tipo de gráfico seleccionado
                        const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
                        const selectedChartType = chartTypeSelect ? chartTypeSelect.value : 'bar';
                        
                        generateCharts(graphDta, compareGraphData, selectedValue, compareValue || '', selectedChartType);
                    }
                } catch (error) {
                    div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                    console.log(error);
                } finally {
                    // always executed
                }
            });

            // Si cambia el filtro de comparación, volver a disparar el render con el valor actual del principal
            if (comboBoxRICompare) {
                comboBoxRICompare.addEventListener('change', function () {
                    const currentMain = comboBoxRI.value;
                    if (currentMain && currentMain !== 'Seleccionar filtro') {
                        comboBoxRI.dispatchEvent(new Event('change'));
                    }
                });
            }


            //Analisis Psicograficos, no tienen narrativo ni factual. Solo filtros
            const comboBoxUP = document.getElementById('Combobox_UserPersona');
            const comboBoxUA = document.getElementById('Combobox_UserArchetype');
            const comboBoxEK = document.getElementById('Combobox_EKMAN');
            const comboBoxRP = document.getElementById('Combobox_RasgosDePersonalidad');
            const comboBoxSP = document.getElementById('Combobox_SegmentosPsicograficos');
            const comboBoxNPS = document.getElementById('Combobox_NPS');
            const comboBoxEC = document.getElementById('Combobox_EstiloDeComunicacion');
            const comboBoxBig5 = document.getElementById('Combobox_Big5');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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

            //Big 5
            comboBoxBig5.addEventListener('change', (event) => {
                var div = document.getElementById('Big5Content');
                var textArea = document.getElementById('Big5TextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'psicographic_questions');
                formData.append('sub_module', 'big5');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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



            //clima laboral, perfecto
            
            comboBoxCL.addEventListener('change', (event) => {
                var div = document.getElementById('ClimaLaboralContent');
                var textArea = document.getElementById('ClimaLaboralTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'work_environment');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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

            //customer journey
            comboBoxCJ.addEventListener('change', (event) => {
                var div = document.getElementById('CustomerJourneyContent');
                var textArea = document.getElementById('CustomerJourneyTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'customer_journey');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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

            //reputacion
            comboBoxREP.addEventListener('change', (event) => {
                var div = document.getElementById('ReputacionContent');
                var textArea = document.getElementById('ReputacionTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'reputation');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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

            //prueba de producto
            comboBoxPP.addEventListener('change', (event) => {
                var div = document.getElementById('PruebaProductoContent');
                var textArea = document.getElementById('PruebaProductoTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'product_testing');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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

            //Focus Group Decoder
            const comboBoxFD = document.getElementById('Combobox_FocusDecoder');
            comboBoxFD.addEventListener('change', (event) => {
                var div = document.getElementById('FocusDecoderContent');
                var textArea = document.getElementById('FocusDecoderTextArea');
                const selectedValue = event.target.value;

                formData = new FormData();     
                formData.append('filter', selectedValue);
                formData.append('module', 'focus_groups_decoder');
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
                const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + sessionStorage.getItem('selectedStudyId');
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
    const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
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
    document.getElementById('ComboBox_ResumenIndividualChartType').style.display = 'none';
    document.getElementById('ComboBox_ResumenIndividualChartTypeLBL').style.display = 'none';

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

//que al presionar los botones toggle-textarea_* aparezcan las text area y colapsen/expandan la columna izquierda
document.addEventListener('DOMContentLoaded', function () {
    const toggleButtons = document.querySelectorAll('[id^="toggle-textarea_"]');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const section = button.closest('.tab-pane');
            if (!section) return; 

            const textarea = section.querySelector('textarea');
            if (!textarea) return;

            const wrapper = textarea.closest('.toolbar-wrapper-cheetah');
            if (!wrapper) return; 

            const toolbar = wrapper.querySelector('.barra-estilo-cheetah');
            if (!toolbar) return;

            // Obtener las columnas para colapsar/expandir
            const baoColumn = document.getElementById('BAOColumn');
            const rightColumn = baoColumn.parentElement.nextElementSibling; // La columna derecha

            // Alternar visibilidad del textarea
            if (textarea.style.display === 'none' || textarea.style.display === '') {
                textarea.style.display = 'block';
                toolbar.style.display = 'flex'; // Show toolbar
                
                // Colapsar la columna izquierda y expandir la derecha
                baoColumn.parentElement.style.display = 'none';
                rightColumn.classList.remove('col');
                rightColumn.classList.add('col-12');
                
            } else {
                textarea.style.display = 'none';
                toolbar.style.display = 'none'; // Hide toolbar
                
                // Restaurar el layout original
                baoColumn.parentElement.style.display = 'block';
                rightColumn.classList.remove('col-12');
                rightColumn.classList.add('col');
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

        const url = "https://api.cheetah-research.ai/configuration/upload_files/" + sessionStorage.getItem('selectedStudyId');

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

// LLAMAR A /configuration/forzar/<study_id> para forzssar el analisis al presionarl el boton botonForzarA

const botonForzarA = document.getElementById('botonForzarA');
botonForzarA.addEventListener('click', () => {
    if (!confirm('¿Está seguro que desea ejecutar el análisis del estudio? Esta acción puede sobrescribir resultados previos y consume tokens.')) {
        return;
    }
    const url = "https://api.cheetah-research.ai/configuration/forzar/" + sessionStorage.getItem('selectedStudyId');

    axios.get(url)
        .then(response => {
            alert('Análisis ejecutado exitosamente');
        })
        .catch(error => {
            console.error('Error al ejecutar el análisis:', error);
        });
});



document.getElementById('ComboBox_ResumenIndividualDS').addEventListener('change', function(event) {
    const selectedValue = event.target.value; // Obtiene el valor seleccionado

    // Elementos a mostrar/ocultar
    const resumenIndividualContent = document.getElementById('ResumenIndividualContent');
    const resumenIndividualTextArea = document.getElementById('ResumenIndividualTextArea');
    const chartsContainerResumenIndividual = document.getElementById('charts-containerResumenIndividualContent');
    const compareSelect = document.getElementById('ComboBox_ResumenIndividual_Compare');
    const compareSelectLBL = document.getElementById('ComboBox_ResumenIndividualCompareLBL');
    const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
    const chartTypeSelectLBL = document.getElementById('ComboBox_ResumenIndividualChartTypeLBL');
    const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
    const comboBoxResumenIndividualTy = document.getElementById('ComboBox_ResumenIndividualTy');

    // Condicional para manejar la visualización
    if (selectedValue === 'individual_Cat') {
        // Mostrar el contenedor de charts y ocultar el resto
        chartsContainerResumenIndividual.style.display = 'block';
        resumenIndividualContent.style.display = 'none';
        resumenIndividualTextArea.style.display = 'none';
        
        // Mostrar selector de tipo de gráfico
        if (chartTypeSelect && chartTypeSelectLBL) {
            chartTypeSelect.style.display = 'inline-block';
            chartTypeSelectLBL.style.display = 'inline-block';
        }
        
        if (compareSelect && compareSelectLBL) {
            compareSelect.style.display = 'inline-block';
            compareSelectLBL.style.display = 'inline-block';
        }
    } else if (selectedValue === 'percentage_nonCat') {
        // Mostrar el contenido y ocultar el contenedor de charts
        chartsContainerResumenIndividual.style.display = 'none';
        resumenIndividualContent.style.display = 'block';
        resumenIndividualTextArea.style.display = 'none';
        
        // Ocultar selector de tipo de gráfico
        if (chartTypeSelect && chartTypeSelectLBL) {
            chartTypeSelect.style.display = 'none';
            chartTypeSelectLBL.style.display = 'none';
        }
        
        if (compareSelect && compareSelectLBL) {
            compareSelect.style.display = 'none';
            compareSelectLBL.style.display = 'none';
        }
    } else {
        // Si no se selecciona ninguna opción válida, ocultar todo
        chartsContainerResumenIndividual.style.display = 'none';
        resumenIndividualContent.style.display = 'none';
        resumenIndividualTextArea.style.display = 'none';
        
        // Ocultar selector de tipo de gráfico
        if (chartTypeSelect && chartTypeSelectLBL) {
            chartTypeSelect.style.display = 'none';
            chartTypeSelectLBL.style.display = 'none';
        }
        
        if (compareSelect && compareSelectLBL) {
            compareSelect.style.display = 'none';
            compareSelectLBL.style.display = 'none';
        }
    }
    
    // IMPORTANTE: Recargar el contenido con la nueva visualización seleccionada
    // Si ya hay un filtro principal seleccionado, disparar el evento change para actualizar el contenido
    if (comboBoxRI && comboBoxRI.value && comboBoxRI.value !== 'Seleccionar filtro') {
        comboBoxRI.dispatchEvent(new Event('change'));
    }
});

document.getElementById('ComboBox_ResumenIndividualTy').addEventListener('change', function(event) {
    const selectedValue = event.target.value; // Obtiene el valor seleccionado

    // al seleccionar percentage que muestre ComboBox_ResumenIndividualDS, de lo contrario se mantiene oculto
    const comboBoxResumenIndividualDS = document.getElementById('ComboBox_ResumenIndividualDS');
    const comboBoxResumenIndividualDSLBL = document.getElementById('ComboBox_ResumenIndividualDSLBL');
    const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
    
    if (selectedValue === 'percentage') {
        comboBoxResumenIndividualDS.style.display = 'block';
        comboBoxResumenIndividualDSLBL.style.display = 'block';
        // Preseleccionar visualización gráfica y disparar el cambio para mostrar controles de comparación
        if (comboBoxResumenIndividualDS.value !== 'individual_Cat') {
            comboBoxResumenIndividualDS.value = 'individual_Cat';
            comboBoxResumenIndividualDS.dispatchEvent(new Event('change'));
        }
    } else {
        comboBoxResumenIndividualDS.style.display = 'none';
        comboBoxResumenIndividualDSLBL.style.display = 'none';
        
        // Cuando se cambia a narrativo, mostrar el contenido textual y ocultar gráficos
        const resumenIndividualContent = document.getElementById('ResumenIndividualContent');
        const resumenIndividualTextArea = document.getElementById('ResumenIndividualTextArea');
        const chartsContainerResumenIndividual = document.getElementById('charts-containerResumenIndividualContent');
        const compareSelect = document.getElementById('ComboBox_ResumenIndividual_Compare');
        const compareSelectLBL = document.getElementById('ComboBox_ResumenIndividualCompareLBL');
        const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
        const chartTypeSelectLBL = document.getElementById('ComboBox_ResumenIndividualChartTypeLBL');
        
        if (resumenIndividualContent && chartsContainerResumenIndividual) {
            chartsContainerResumenIndividual.style.display = 'none';
            resumenIndividualContent.style.display = 'block';
            if (resumenIndividualTextArea) resumenIndividualTextArea.style.display = 'none';
        }
        
        // Ocultar controles de comparación y tipo de gráfico
        if (chartTypeSelect && chartTypeSelectLBL) {
            chartTypeSelect.style.display = 'none';
            chartTypeSelectLBL.style.display = 'none';
        }
        
        if (compareSelect && compareSelectLBL) {
            compareSelect.style.display = 'none';
            compareSelectLBL.style.display = 'none';
        }
    }
    
    // IMPORTANTE: Recargar el contenido con el nuevo estilo seleccionado
    // Si ya hay un filtro seleccionado, disparar el evento change para actualizar el contenido
    if (comboBoxRI && comboBoxRI.value && comboBoxRI.value !== 'Seleccionar filtro') {
        comboBoxRI.dispatchEvent(new Event('change'));
    }
});

// Event listener para el cambio del tipo de gráfico
document.getElementById('ComboBox_ResumenIndividualChartType').addEventListener('change', function(event) {
    const selectedChartType = event.target.value;
    
    // Si ya hay un filtro principal seleccionado, volver a renderizar con el nuevo tipo de gráfico
    const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
    if (comboBoxRI && comboBoxRI.value && comboBoxRI.value !== 'Seleccionar filtro') {
        comboBoxRI.dispatchEvent(new Event('change'));
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
// User Persona no usa subfiltros en el módulo de visualización (elemento no existe en HTML)
// const comboboxUserPersonaSubFiltro = document.getElementById('ComboBox_UserPersona_SubFiltro');
// User Archetype no usa subfiltros según el código de análisis de datos
// const comboboxUserArchetypeSubFiltro = document.getElementById('ComboBox_UserArchetype_SubFiltro');
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

/*
// Event listeners for User Persona
userPersonaBtn.addEventListener('click', () => {
    loadUserData('persona', userPersonaContent, comboboxUserPersona, null, userPersonaTextArea);
});*/

comboboxUserPersona.addEventListener('change', async function() {
    const filter = this.value;
    // User Persona no usa subfiltros en el módulo de visualización
    
    // Usar la misma lógica que el resto del archivo de visualización
    const study_id = sessionStorage.getItem('selectedStudyId');
    const formData = new FormData();
    formData.append('filter', filter);
    formData.append('module', 'user_personas');
    const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study_id;
    
    try {
        const response = await axios.post(url, formData);
        let data = response.data;
        if (!data.startsWith("#")) {
            data = data.substring(data.indexOf("#"));
            data = data.substring(0, data.length - 3);
        }
        const htmlContent = marked(data);
        userPersonaContent.innerHTML = htmlContent;
        if (userPersonaTextArea) {
            userPersonaTextArea.value = data;
        }
    } catch (error) {
        console.error('Error loading user persona data:', error);
        userPersonaContent.innerHTML = '<p>No se encontraron datos para la selección actual.</p>';
    }
});

/*
// Event listeners for User Archetype
userArchetypeBtn.addEventListener('click', () => {
    loadUserData('archetype', userArchetypeContent, comboboxUserArchetype, null, userArchetypeTextArea);
});*/

comboboxUserArchetype.addEventListener('change', async function() {
    const filter = this.value;
    // User Archetype no usa subfiltros según el código de análisis de datos
    
    // Usar la misma lógica que el resto del archivo de visualización
    const study_id = sessionStorage.getItem('selectedStudyId');
    const formData = new FormData();
    formData.append('filter', filter);
    formData.append('module', 'user_archetype');
    const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study_id;
    
    try {
        const response = await axios.post(url, formData);
        let data = response.data;
        if (!data.startsWith("#")) {
            data = data.substring(data.indexOf("#"));
            data = data.substring(0, data.length - 3);
        }
        const htmlContent = marked(data);
        userArchetypeContent.innerHTML = htmlContent;
        if (userArchetypeTextArea) {
            userArchetypeTextArea.value = data;
        }
    } catch (error) {
        console.error('Error loading user archetype data:', error);
        userArchetypeContent.innerHTML = '<p>No se encontraron datos para la selección actual.</p>';
    }
});
/*
// Toggle textarea visibility for User Persona
toggleTextareaUserPersonaBtn.addEventListener('click', () => {
    userPersonaTextArea.style.display = userPersonaTextArea.style.display === 'none' ? 'block' : 'none';
});

// Toggle textarea visibility for User Archetype
toggleTextareaUserArchetypeBtn.addEventListener('click', () => {
    userArchetypeTextArea.style.display = userArchetypeTextArea.style.display === 'none' ? 'block' : 'none';
});
*/
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
                filter: comboboxUserArchetype.value
                // User Archetype no usa subfiltros
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

document.addEventListener('DOMContentLoaded', function () {
    function createFloatingToolbar(editor) {
        if (!editor) return;

        let wrapper = editor.parentElement;
        let toolbarExistedPreviously = false;

        if (wrapper.classList.contains('toolbar-wrapper-cheetah')) {
            const existingToolbar = wrapper.querySelector(".barra-estilo-cheetah");
            if (existingToolbar) {
                existingToolbar.remove();
                toolbarExistedPreviously = true;
            }
        } else {
            const newWrapper = document.createElement("div");
            newWrapper.classList.add('toolbar-wrapper-cheetah');
            newWrapper.style.display = "flex";
            newWrapper.style.flexDirection = "column";
            newWrapper.style.position = "relative"; // Context for sticky
            // newWrapper.style.gap = "10px"; // Gap between toolbar and textarea handled by toolbar margin
            editor.parentElement.insertBefore(newWrapper, editor);
            newWrapper.appendChild(editor);
            wrapper = newWrapper;
        }

        const barra = document.createElement("div");
        barra.classList.add("barra-estilo-cheetah");
        barra.style.display = "none"; // Hidden by default
        barra.style.flexWrap = "wrap";
        barra.style.gap = "8px";
        barra.style.padding = "10px 12px";
        barra.style.backgroundColor = "#FFFFFF";
        barra.style.borderRadius = "8px 8px 0 0"; // Rounded top corners if textarea is directly below
        barra.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        barra.style.position = "sticky";
        barra.style.top = "0px";
        barra.style.zIndex = "1000";
        barra.style.marginBottom = "5px"; // Small space between toolbar and textarea
        
        // Ensure wrapper is the direct parent for sticky positioning to work as expected
        if (editor.parentElement !== wrapper) {
            wrapper.appendChild(editor); // Should already be the case if newWrapper was made
        }
        wrapper.insertBefore(barra, editor);


        function insertarWrapper(abrir, cerrar, isHtml) {
            const scrollTop = editor.scrollTop;
            const scrollLeft = editor.scrollLeft;
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const seleccionado = editor.value.substring(start, end);
            const antes = editor.value.substring(0, start);
            const despues = editor.value.substring(end);
            
            let cierreFinal = cerrar;
            if (!cierreFinal) {
                if (isHtml && abrir.startsWith("<") && abrir.endsWith(">")) {
                    const tagNameMatch = abrir.match(/^<([a-zA-Z0-9]+)/);
                    if (tagNameMatch && tagNameMatch[1]) {
                        cierreFinal = `</${tagNameMatch[1]}>`;
                    } else {
                        cierreFinal = abrir; 
                    }
                } else {
                    cierreFinal = abrir;
                }
            }

            const textToInsert = abrir + seleccionado + cierreFinal;
            editor.value = antes + textToInsert + despues;
            
            const newCursorPosition = antes.length + textToInsert.length;
            editor.selectionStart = newCursorPosition;
            editor.selectionEnd = newCursorPosition;

            editor.focus({ preventScroll: true }); // Prevent browser from scrolling on focus
            
            // Restore scroll position AFTER focus and selection
            editor.scrollTop = scrollTop;
            editor.scrollLeft = scrollLeft;
            
            editor.dispatchEvent(new Event("input", { bubbles: true }));
        }

        function insertarBloque(icono, color = null) {
            const scrollTop = editor.scrollTop;
            const scrollLeft = editor.scrollLeft;
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const textoSeleccionado = editor.value.substring(start, end);
            const textoPlaceholder = "Texto aquí...";
            const textoContenido = textoSeleccionado || textoPlaceholder;
            
            const antes = editor.value.substring(0, start);
            const despues = editor.value.substring(end);
            
            const estiloIcono = color ? ` style="color:${color}; font-size:1.2em; margin-right:10px; flex-shrink:0;"` : ` style="font-size:1.2em; margin-right:10px; flex-shrink:0;"`;
            const bloque = `
<div style="display:flex; align-items:flex-start; background-color:#292929; padding:12px 15px; border-radius:6px; color:#FFFFFF; margin: 10px 0; border: 1px solid #DEE2E6;">
  <div${estiloIcono}>${icono}</div>
  <div style="flex:1; line-height:1.5;">${textoContenido.replace(/\\n/g, '<br>')}</div>
</div>`;
            
            editor.value = antes + bloque + despues;

            const newCursorPosition = antes.length + bloque.length;
            editor.selectionStart = newCursorPosition;
            editor.selectionEnd = newCursorPosition;

            editor.focus({ preventScroll: true }); // Prevent browser from scrolling on focus

            // Restore scroll position AFTER focus and selection
            editor.scrollTop = scrollTop;
            editor.scrollLeft = scrollLeft;
            
            editor.dispatchEvent(new Event("input", { bubbles: true }));
        }

        const botones = [
            { texto: "B", type: "html", abrir: "<strong>", cerrar: "</strong>", title: "Negrita (HTML)" },
            { texto: "I", type: "markdown", abrir: "*", cerrar: "*", title: "Itálica (Markdown)" },
            { texto: "U", type: "html", abrir: "<u>", cerrar: "</u>", title: "Subrayado (HTML)" },
            { texto: "🟠", type: "html", abrir: '<span style="color:#c0601c;">', cerrar: "</span>", title: "Texto Naranja Oscuro" },
            { texto: "⚫", type: "html", abrir: '<span style="color:#000000;">', cerrar: "</span>", title: "Texto Negro" },
            { texto: "⬜", type: "html", abrir: '<span style="color:#FFFFFF;">', cerrar: "</span>", title: "Texto Blanco (puede no ser visible en fondo blanco sin seleccionar)" },
            { texto: "H FN", type: "html", abrir: '<span style="background-color:#000000; color:#FFFFFF; padding: 2px 4px; border-radius: 3px;">', cerrar: "</span>", title: "Highlight Fondo Negro" },
            { texto: "H FO", type: "html", abrir: '<span style="background-color:#c0601c; color:#FFFFFF; padding: 2px 4px; border-radius: 3px;">', cerrar: "</span>", title: "Highlight Fondo Naranja" },
            { texto: "Destacar", icono: "⚠️", type: "bloque", title: "Insertar bloque de advertencia" },
            { texto: "Positivo", icono: "✅", type: "bloque", title: "Insertar bloque positivo" },
            { texto: "Negativo", icono: "❌", type: "bloque", title: "Insertar bloque negativo", color: "#D32F2F" } // Darker red for better contrast
        ];

        botones.forEach(({ texto, abrir, cerrar, icono, type, title, color }) => {
            const btn = document.createElement("button");
            btn.textContent = texto;
            btn.title = title || texto;
            btn.style.padding = "5px 8px";
            btn.style.backgroundColor = "#F1F3F5";
            btn.style.color = "#212529";
            btn.style.border = "1px solid #CED4DA";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            btn.style.fontFamily = "inherit"; 
            btn.style.fontSize = "0.875rem";
            btn.style.transition = "background-color 0.2s ease";

            btn.onmouseover = () => btn.style.backgroundColor = "#E9ECEF";
            btn.onmouseout = () => btn.style.backgroundColor = "#F1F3F5";
            
            btn.onclick = (e) => {
                e.preventDefault(); // Prevent any default form submission if toolbar is in a form
                if (type === "bloque") {
                    insertarBloque(icono, color);
                } else {
                    insertarWrapper(abrir, cerrar, type === "html");
                }
            };
            barra.appendChild(btn);
        });

        editor.style.width = "100%";
        editor.style.flex = "1 1 auto";
        if (!toolbarExistedPreviously) { // Only log on initial creation for this editor
          // console.log(`Toolbar cargado para: ${editor.id || 'textarea'}`);
        }
    }

    const allTextareas = document.querySelectorAll('textarea');
    allTextareas.forEach(textarea => {
        createFloatingToolbar(textarea);
    });
    if (allTextareas.length > 0) {

    }
});