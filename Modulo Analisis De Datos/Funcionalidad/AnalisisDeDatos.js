// agregarCard.js
let Demographic_Filters = [];
let ActiveModules = [];
let formData = new FormData();  

let markmapBlobUrl = null;
let sankeyBlobUrl = null;


import { splitMarkdown, generateCharts, splitMarkdownAndWrap } from './splitter.js';

function initializePage() {
    const study_id = new URLSearchParams(window.location.search).get('id');

    if (study_id) {
        document.getElementById('charts-containerResumenIndividualContent').style.display = 'none';
        document.getElementById('ComboBox_ResumenIndividualDS').style.display = 'none';
        document.getElementById('ComboBox_ResumenIndividualDSLBL').style.display = 'none';
        document.getElementById('ComboBox_ResumenIndividualChartType').style.display = 'none';
        document.getElementById('ComboBox_ResumenIndividualChartTypeLBL').style.display = 'none';
        
        // Ocultar inicialmente los elementos de comparación
        const compareSelect = document.getElementById('ComboBox_ResumenIndividual_Compare');
        const compareSelectLBL = document.getElementById('ComboBox_ResumenIndividualCompareLBL');
        if (compareSelect) compareSelect.style.display = 'none';
        if (compareSelectLBL) compareSelectLBL.style.display = 'none';
        
        // Ocultar inicialmente el selector de tipo de gráfico
        const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
        const chartTypeSelectLBL = document.getElementById('ComboBox_ResumenIndividualChartTypeLBL');
        if (chartTypeSelect) chartTypeSelect.style.display = 'none';
        if (chartTypeSelectLBL) chartTypeSelectLBL.style.display = 'none';

        if (study_id === '67e2ac1b5bd042898764458a') {
            const subFiltros = [
                'ComboBox_ResumenGeneral_SubFiltro',
                'ComboBox_ResumenIndividual_SubFiltro',
                'ComboBox_UserPersona_SubFiltro',
                'ComboBox_EKMAN_SubFiltro',
                'ComboBox_RasgosDePersonalidad_SubFiltro',
                'ComboBox_SegmentosPsicograficos_SubFiltro',
                'ComboBox_EstiloDeComunicacion_SubFiltro',
                'ComboBox_Big5_SubFiltro',
                'ComboBox_customerExperience_SubFiltro',
                'ComboBox_Satisfaccion_SubFiltro',
                'ComboBox_ClimaLaboral_SubFiltro',
                'ComboBox_CustomerJourney_SubFiltro',
                'ComboBox_Reputacion_SubFiltro',
                'ComboBox_PruebaProducto_SubFiltro',
                'ComboBox_BrandStrenght_SubFiltro',
                'ComboBox_BrandEquity_SubFiltro',
                'ComboBox_NPS_SubFiltro'
            ];

            subFiltros.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.display = 'block';
                }
            });

            // Esperar ligeramente a que el DOM pinte los elementos (por si aún no están renderizados del todo)
            setTimeout(() => {
                const allSubFiltrosVisible = subFiltros.every(id => {
                    const element = document.getElementById(id);
                    return element && element.style.display === 'block';
                });

                if (allSubFiltrosVisible) {
                    AgregarFiltros(study_id);
                    AgregarModulos(study_id);
                    setColorsFromAPI(study_id); // Setea colores
                } else {
                    console.warn('No todos los subfiltros están visibles. No se ejecutarán las funciones.');
                }
            }, 100); // 100 ms puede ajustarse si es necesario
        } else {
            // Para otros estudios, simplemente ejecutá normal
            AgregarFiltros(study_id);
            AgregarModulos(study_id);
            setColorsFromAPI(study_id); // Setea colores
        }
    } else {
        console.error('No se encontró el parámetro id en la URL.');
    }
}


initializePage();

document.addEventListener('DOMContentLoaded', function () {
    const exportButtons = document.querySelectorAll('button[id^="export_"]');

    exportButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parentTabPane = button.closest('.tab-pane');
            const activeTab = document.querySelector('.tab-pane.active'); // Detecta la pestaña activa


            // Verificar si el content div contiene la palabra details

            if (activeTab && activeTab.querySelector('details')) {
                // Si hay un elemento details, crear dos PDFs: uno colapsado y otro expandido
                const contentDiv = parentTabPane.querySelector('div[id$="Content"]');
                const allElements = [...contentDiv.children];

                // Crear contenedores para los dos PDFs
                const pdfCollapsed = document.createElement('div');
                const pdfExpanded = document.createElement('div');

                let currentCollapsed = document.createElement('div');
                let currentExpanded = document.createElement('div');

                pdfCollapsed.appendChild(currentCollapsed);
                pdfExpanded.appendChild(currentExpanded);

                allElements.forEach(element => {
                    if (element.tagName === 'HR') {
                        // Agregar separaciones entre los documentos
                        currentCollapsed = document.createElement('div');
                        pdfCollapsed.appendChild(document.createElement('hr'));
                        pdfCollapsed.appendChild(currentCollapsed);
                        
                        currentExpanded = document.createElement('div');
                        pdfExpanded.appendChild(document.createElement('hr'));
                        pdfExpanded.appendChild(currentExpanded);
                    } else if (element.tagName === 'DETAILS') {
                        // Manejo de details
                        const summary = element.querySelector('summary h4');
                        if (summary) {
                            const clonedTitle = summary.cloneNode(true);
                            currentCollapsed.appendChild(clonedTitle);
                            currentCollapsed.appendChild(document.createElement('hr'));
                            
                            const expandedSection = document.createElement('div');
                            expandedSection.appendChild(clonedTitle.cloneNode(true));
                            expandedSection.appendChild(document.createElement('hr'));
                            
                            // Extraer y agregar el contenido de details
                            [...element.children].forEach(child => {
                                if (child.tagName !== 'SUMMARY') {
                                    expandedSection.appendChild(child.cloneNode(true));
                                }
                            });
                            
                            currentExpanded.appendChild(expandedSection);
                        }
                    } else {
                        currentCollapsed.appendChild(element.cloneNode(true));
                        currentExpanded.appendChild(element.cloneNode(true));
                    }
                });

                // Configurar las opciones para los PDFs
                const options = {
                    margin: 1,
                    html2canvas: { scale: 2, backgroundColor: '#ffffff' },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                };

                // Generar y descargar los dos PDFs
                html2pdf().set({ ...options, filename: `${parentTabPane.id || 'contenido'}_contraido.pdf` }).from(pdfCollapsed).save();
                html2pdf().set({ ...options, filename: `${parentTabPane.id || 'contenido'}_expandido.pdf` }).from(pdfExpanded).save();




            } else {
                
                const contentDiv = parentTabPane.querySelector('div[id$="Content"]'); // Div cuyo ID termina en "Content"

 
                const options = {
                    margin: 1,
                    filename: `${parentTabPane.id || 'contenido'}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                };

                html2pdf().set(options).from(contentDiv).save();            }
        });
    });
});

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
            const CustomerEcperienceBtn = document.getElementById('customerExperienceBtn');
            const NPSySatisfaccionBtn = document.getElementById('NPSySatisfaccionBtn');
            const BrandStatusBtn = document.getElementById('BrandStatusBtn');
            const ClimaLaboralBtn = document.getElementById('ClimaLaboralBtn');
            const CustomerJourneyBtn = document.getElementById('CustomerJourneyBtn');
            const ReputacionBtn = document.getElementById('ReputacionBtn');
            const PruebaProductoBtn = document.getElementById('PruebaProductoBtn');
            


            ResumenGeneralBtn.style.display = 'none';
            ResumenIndividualBtn.style.display = 'none';
            UserPersonaBtn.style.display = 'none';
            AnalisisPsicograficosBtn.style.display = 'none';
            CustomerEcperienceBtn.style.display = 'none';
            NPSySatisfaccionBtn.style.display = 'none';
            BrandStatusBtn.style.display = 'none';
            ClimaLaboralBtn.style.display = 'none';
            CustomerJourneyBtn.style.display = 'none';
            ReputacionBtn.style.display = 'none';
            PruebaProductoBtn.style.display = 'none';

            ActiveModules.forEach(modulo => {
                if (modulo === 'Módulo de Análisis General') {
                    ResumenGeneralBtn.style.display = 'block';
                }
                if (modulo === 'Módulo de Análisis Individual') {
                    ResumenIndividualBtn.style.display = 'block';
                }
                if (modulo === 'Módulo de User Personas') {
                    UserPersonaBtn.style.display = 'block';
                }
                if (modulo === 'Módulo de Análisis Psicográficos') {
                    AnalisisPsicograficosBtn.style.display = 'block';
                }
                if (modulo === 'Módulo Customer Experience') {
                    CustomerEcperienceBtn.style.display = 'block';
                }
                if (modulo === 'Módulo NPS y Satisfacción') {
                    NPSySatisfaccionBtn.style.display = 'block';
                }
                if (modulo === 'Módulo Brand Status') {
                    BrandStatusBtn.style.display = 'block';
                }
                if (modulo === 'Módulo Clima Laboral') {
                    ClimaLaboralBtn.style.display = 'block';
                }
                if (modulo === 'Módulo Customer Journey') {
                    CustomerJourneyBtn.style.display = 'block';
                }
                if (modulo === 'Módulo Reputación') {
                    ReputacionBtn.style.display = 'block';
                }
                if (modulo === 'Módulo Prueba de Producto') {
                    PruebaProductoBtn.style.display = 'block';
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


function AgregarFiltros(study) {
    let url = "https://api.cheetah-research.ai/configuration/get_filters/" + study;

    axios.get(url)
        .then(function (response) {
            
            const data = response.data.filters;
            Demographic_Filters = [];
            Demographic_Filters.push('Seleccionar filtro');
            Demographic_Filters.push('General');

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
            const comboBox17 = document.getElementById('Combobox_Big5');
            const comboBox9 = document.getElementById('Combobox_customerExperience');
            const comboBox10 = document.getElementById('Combobox_Satisfaccion');
            const comboBox11 = document.getElementById('Combobox_ClimaLaboral');
            const comboBox14 = document.getElementById('Combobox_CustomerJourney');
            const comboBox15 = document.getElementById('Combobox_Reputacion');
            const comboBox16 = document.getElementById('Combobox_PruebaProducto');
            const comboBox12 = document.getElementById('Combobox_BrandStrenght');
            const comboBox13 = document.getElementById('Combobox_BrandEquity');


            comboBox.innerHTML = '';
            comboBox2.innerHTML = '';
            if (comboBoxRICompare) comboBoxRICompare.innerHTML = '';
            comboBox3.innerHTML = '';
            comboBox4.innerHTML = '';
            comboBox5.innerHTML = '';
            comboBox6.innerHTML = '';
            comboBox7.innerHTML = '';
            comboBox8.innerHTML = '';
            comboBox17.innerHTML = '';
            comboBox9.innerHTML = '';
            comboBox10.innerHTML = '';
            comboBox11.innerHTML = '';
            comboBox14.innerHTML = '';
            comboBox15.innerHTML = '';
            comboBox16.innerHTML = '';
            comboBox12.innerHTML = '';
            comboBox13.innerHTML = '';
            

        // Agregar opciones al combobox
        Demographic_Filters.forEach(optionText => {
            let option = document.createElement('option');
            option.value = optionText;
            option.text = optionText;
            comboBox.appendChild(option);
            comboBox2.appendChild(option.cloneNode(true));
            if (comboBoxRICompare) comboBoxRICompare.appendChild(option.cloneNode(true));
            comboBox3.appendChild(option.cloneNode(true));
            comboBox4.appendChild(option.cloneNode(true));
            comboBox5.appendChild(option.cloneNode(true));
            comboBox6.appendChild(option.cloneNode(true));
            comboBox7.appendChild(option.cloneNode(true));
            comboBox8.appendChild(option.cloneNode(true));
            comboBox17.appendChild(option.cloneNode(true));
            comboBox9.appendChild(option.cloneNode(true));
            comboBox10.appendChild(option.cloneNode(true));
            comboBox11.appendChild(option.cloneNode(true));
            comboBox14.appendChild(option.cloneNode(true));
            comboBox15.appendChild(option.cloneNode(true));
            comboBox16.appendChild(option.cloneNode(true));
            comboBox12.appendChild(option.cloneNode(true));
            comboBox13.appendChild(option.cloneNode(true));
            comboBoxUA.appendChild(option.cloneNode(true));

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
        const StyleSelectedOption = document.getElementById('ComboBox_ResumenGeneralTy');
        var div = document.getElementById('ResumenGeneralContent');
    
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_ResumenGeneral_SubFiltro').value;
        
        formData = new FormData();
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
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
    const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
    const comboBoxRICompare = document.getElementById('ComboBox_ResumenIndividual_Compare');
    
    comboBoxRI.addEventListener('change', async (event) => {
        const StyleSelectedOption = document.getElementById('ComboBox_ResumenIndividualTy');
        var div = document.getElementById('ResumenIndividualContent');
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_ResumenIndividual_SubFiltro').value;

        formData = new FormData();
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'individual_questions');
        formData.append('sub_module', StyleSelectedOption.value);
        const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;

        try {
            const resp = await axios.post(url, formData);
            let data = resp.data;
            if (!data.startsWith("#")) {
                data = data.substring(data.indexOf("#"));
                data = data.substring(0, data.length - 3);
            }
            const coso = splitMarkdownAndWrap(data);
            div.innerHTML = coso.join('<hr>');

            // Gráfica: solicitar siempre percentage para la visualización
            const displaySelect = document.getElementById('ComboBox_ResumenIndividualDS');
            if (displaySelect && displaySelect.value === 'individual_Cat') {
                const formDataGraph = new FormData();
                formDataGraph.append('filter', study === '67e2ac1b5bd042898764458a' ? `${selectedValue} ${subFilterValue}` : selectedValue);
                formDataGraph.append('module', 'individual_questions');
                formDataGraph.append('sub_module', 'percentage');

                let primaryGraph = [];
                try {
                    const graphResp = await axios.post(url, formDataGraph);
                    let g = graphResp.data;
                    if (!g.startsWith("#")) {
                        g = g.substring(g.indexOf("#"));
                        g = g.substring(0, g.length - 3);
                    }
                    primaryGraph = splitMarkdown(g);
                } catch (e) { console.error(e); }

                // Comparación
                let compareGraph = null;
                const compareValue = comboBoxRICompare ? comboBoxRICompare.value : null;
                if (compareValue && compareValue !== 'Seleccionar filtro' && compareValue !== selectedValue) {
                    const formDataCompare = new FormData();
                    formDataCompare.append('filter', study === '67e2ac1b5bd042898764458a' ? `${compareValue} ${subFilterValue}` : compareValue);
                    formDataCompare.append('module', 'individual_questions');
                    formDataCompare.append('sub_module', 'percentage');
                    try {
                        const compResp = await axios.post(url, formDataCompare);
                        let c = compResp.data;
                        if (!c.startsWith("#")) {
                            c = c.substring(c.indexOf("#"));
                            c = c.substring(0, c.length - 3);
                        }
                        compareGraph = splitMarkdown(c);
                    } catch (e) { console.error(e); }
                }
                // Obtener el tipo de gráfico seleccionado
                const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
                const selectedChartType = chartTypeSelect ? chartTypeSelect.value : 'bar';
                
                generateCharts(primaryGraph, compareGraph, selectedValue, compareValue || '', selectedChartType);
            }
        } catch (error) {
            div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
            console.log(error);
        }
    });

    // Re-render al cambiar el comparador
    if (comboBoxRICompare) {
        comboBoxRICompare.addEventListener('change', function () {
            if (comboBoxRI && comboBoxRI.value && comboBoxRI.value !== 'Seleccionar filtro') {
                comboBoxRI.dispatchEvent(new Event('change'));
            }
        });
    }

    // Agregar event listeners para el display style y tipo de resumen individual
    const comboBoxResumenIndividualDS = document.getElementById('ComboBox_ResumenIndividualDS');
    const comboBoxResumenIndividualTy = document.getElementById('ComboBox_ResumenIndividualTy');
    
    if (comboBoxResumenIndividualDS) {
        comboBoxResumenIndividualDS.addEventListener('change', function(event) {
            const selectedValue = event.target.value; // Obtiene el valor seleccionado

            // Elementos a mostrar/ocultar
            const resumenIndividualContent = document.getElementById('ResumenIndividualContent');
            const resumenIndividualTextArea = document.getElementById('ResumenIndividualTextArea');
            const chartsContainerResumenIndividual = document.getElementById('charts-containerResumenIndividualContent');
            const compareSelect = document.getElementById('ComboBox_ResumenIndividual_Compare');
            const compareSelectLBL = document.getElementById('ComboBox_ResumenIndividualCompareLBL');
            const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');

            // Condicional para manejar la visualización
            if (selectedValue === 'individual_Cat') {
                // Mostrar el contenedor de charts y ocultar el resto
                chartsContainerResumenIndividual.style.display = 'block';
                resumenIndividualContent.style.display = 'none';
                
                // Mostrar selector de tipo de gráfico
                const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
                const chartTypeSelectLBL = document.getElementById('ComboBox_ResumenIndividualChartTypeLBL');
                if (chartTypeSelect && chartTypeSelectLBL) {
                    chartTypeSelect.style.display = 'inline-block';
                    chartTypeSelectLBL.style.display = 'inline-block';
                }
                
                if (compareSelect && compareSelectLBL) {
                    compareSelect.style.display = 'inline-block';
                    compareSelectLBL.style.display = 'inline-block';
                }
                if (comboBoxRI && comboBoxRI.value && comboBoxRI.value !== 'Seleccionar filtro') {
                    comboBoxRI.dispatchEvent(new Event('change'));
                }
            } else if (selectedValue === 'percentage_nonCat') {
                // Mostrar el contenido y ocultar el contenedor de charts
                chartsContainerResumenIndividual.style.display = 'none';
                resumenIndividualContent.style.display = 'block';
                
                // Ocultar selector de tipo de gráfico
                const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
                const chartTypeSelectLBL = document.getElementById('ComboBox_ResumenIndividualChartTypeLBL');
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
                
                // Ocultar selector de tipo de gráfico
                const chartTypeSelect = document.getElementById('ComboBox_ResumenIndividualChartType');
                const chartTypeSelectLBL = document.getElementById('ComboBox_ResumenIndividualChartTypeLBL');
                if (chartTypeSelect && chartTypeSelectLBL) {
                    chartTypeSelect.style.display = 'none';
                    chartTypeSelectLBL.style.display = 'none';
                }
                
                if (compareSelect && compareSelectLBL) {
                    compareSelect.style.display = 'none';
                    compareSelectLBL.style.display = 'none';
                }
            }
        });
    }

    if (comboBoxResumenIndividualTy) {
        comboBoxResumenIndividualTy.addEventListener('change', function(event) {
            const selectedValue = event.target.value; // Obtiene el valor seleccionado

            // al seleccionar percentage que muestre ComboBox_ResumenIndividualDS, de lo contrario se mantiene oculto
            const comboBoxResumenIndividualDS = document.getElementById('ComboBox_ResumenIndividualDS');
            const comboBoxResumenIndividualDSLBL = document.getElementById('ComboBox_ResumenIndividualDSLBL');
            if (selectedValue === 'percentage') {
                comboBoxResumenIndividualDS.style.display = 'block';
                comboBoxResumenIndividualDSLBL.style.display = 'block';
                if (comboBoxResumenIndividualDS.value !== 'individual_Cat') {
                    comboBoxResumenIndividualDS.value = 'individual_Cat';
                    comboBoxResumenIndividualDS.dispatchEvent(new Event('change'));
                }
            } else {
                comboBoxResumenIndividualDS.style.display = 'none';
                comboBoxResumenIndividualDSLBL.style.display = 'none';
            }
        });
    }

    // Event listener para el cambio del tipo de gráfico
    const comboBoxResumenIndividualChartType = document.getElementById('ComboBox_ResumenIndividualChartType');
    if (comboBoxResumenIndividualChartType) {
        comboBoxResumenIndividualChartType.addEventListener('change', function(event) {
            const selectedChartType = event.target.value;
            
            // Si ya hay un filtro principal seleccionado, volver a renderizar con el nuevo tipo de gráfico
            const comboBoxRI = document.getElementById('ComboBox_ResumenIndividual');
            if (comboBoxRI && comboBoxRI.value && comboBoxRI.value !== 'Seleccionar filtro') {
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
    const comboBoxCE = document.getElementById('Combobox_customerExperience');
    const comboBoxS = document.getElementById('Combobox_Satisfaccion');
    const comboBoxCL = document.getElementById('Combobox_ClimaLaboral');
    const comboBoxBS = document.getElementById('Combobox_BrandStrenght');
    const comboBoxBE = document.getElementById('Combobox_BrandEquity');

    //User Persona, perfecto
    comboBoxUP.addEventListener('change', (event) => {
        //Llenar el user persona de la misma fotma que se llenan los anteriores 

        // console.log(event.target.value);


        // Obtener el div donde se mostrará el contenido
        var div = document.getElementById('UserPersonaContent');

        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
                    const subFilterValue = document.getElementById('ComboBox_UserPersona_SubFiltro').value;

            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
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
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_customerExperience_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'customer_experience');
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
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_EKMAN_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
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
                const coso = splitMarkdownAndWrap(data);                          
                div.innerHTML = coso.join('<hr>');                     
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
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_RasgosDePersonalidad_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
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
                const coso = splitMarkdownAndWrap(data);                          
                div.innerHTML = coso.join('<hr>');                   
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
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_SegmentosPsicograficos_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
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
                const coso = splitMarkdownAndWrap(data);                          
                div.innerHTML = coso.join('<hr>');                        
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
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_NPS_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
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
                const coso = splitMarkdownAndWrap(data);                          
                div.innerHTML = coso.join('<hr>');                
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

    //Satisfaccion, perfecto
    comboBoxS.addEventListener('change', (event) => {
        // console.log(event.target.value);

        var div = document.getElementById('SatisfaccionContent');
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_Satisfaccion_SubFiltro').value;

        formData = new FormData();
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'psicographic_questions');
        formData.append('sub_module', 'customer_satisfaction');
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

    //Clima Laboral, perfecto
    comboBoxCL.addEventListener('change', (event) => {
        // console.log(event.target.value);

        var div = document.getElementById('ClimaLaboralContent');
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_ClimaLaboral_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'work_environment');
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

            })
            .catch(function (error) {
                div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                console.log(error);
            })
            .then(function () {

            });
    });

    //Customer Journey
    const comboBoxCJ = document.getElementById('Combobox_CustomerJourney');
    comboBoxCJ.addEventListener('change', (event) => {
        var div = document.getElementById('CustomerJourneyContent');
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_CustomerJourney_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'customer_journey');
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

            })
            .catch(function (error) {
                div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                console.log(error);
            })
            .then(function () {

            });
    });

    //Reputacion
    const comboBoxREP = document.getElementById('Combobox_Reputacion');
    comboBoxREP.addEventListener('change', (event) => {
        var div = document.getElementById('ReputacionContent');
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_Reputacion_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'reputation');
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

            })
            .catch(function (error) {
                div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                console.log(error);
            })
            .then(function () {

            });
    });

    //Prueba de Producto
    const comboBoxPP = document.getElementById('Combobox_PruebaProducto');
    comboBoxPP.addEventListener('change', (event) => {
        var div = document.getElementById('PruebaProductoContent');
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_PruebaProducto_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'product_testing');
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

            })
            .catch(function (error) {
                div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                console.log(error);
            })
            .then(function () {

            });
    });

    comboBoxBS.addEventListener('change', (event) => {
        // console.log(event.target.value);
        var div = document.getElementById('BrandStrenghtContent');
        var textArea = document.getElementById('BrandStrenghtTextArea');
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_BrandStrenght_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'brand_status');
        formData.append('sub_module', 'brand_strength');
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
                textArea.value = data;                   
            })
            .catch(function (error) {
                div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                console.log(error);
            })
            .then(function () {

            });
    });

    comboBoxBE.addEventListener('change', (event) => {
        // console.log(event.target.value);
        var div = document.getElementById('BrandEquityContent');
        var textArea = document.getElementById('BrandEquityTextArea');
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_BrandEquity_SubFiltro').value;


        
        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'brand_status');
        formData.append('sub_module', 'brand_equity');
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
                textArea.value = data;                   
            })
            .catch(function (error) {
                div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
                console.log(error);
            })
            .then(function () {

            });
    });
    
    comboBoxEC.addEventListener('change', (event) => {
        // console.log(event.target.value);

        var div = document.getElementById('EstiloDeComunicacionContent');
        // Supongamos que `event.target.value` es el valor del combobox
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_EstiloDeComunicacion_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
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
    const comboBoxBig5 = document.getElementById('Combobox_Big5');
    comboBoxBig5.addEventListener('change', (event) => {
        var div = document.getElementById('Big5Content');
        const selectedValue = event.target.value;
        const subFilterValue = document.getElementById('ComboBox_Big5_SubFiltro').value;

        formData = new FormData();     
        if (study === '67e2ac1b5bd042898764458a') {
            formData.append('filter', `${selectedValue} ${subFilterValue}`);
        } else {
            formData.append('filter', selectedValue);
        }
        formData.append('module', 'psicographic_questions');
        formData.append('sub_module', 'big5');
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
        const selectedValue = event.target.value;

        formData = new FormData();     
        formData.append('filter', selectedValue);
        formData.append('module', 'user_archetype'); // API endpoint for User Archetype
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

