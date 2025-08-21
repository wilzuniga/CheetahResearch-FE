
export function splitMarkdown(markdownText) {
    const sections = markdownText.split('---').map(section => section.trim());
    
    const parsedSections = sections.map(section => {
        const lines = section.split('\n');
        let pregunta = lines[0].replace(/^#+\s*/, '').trim(); // Extrae la prg
        pregunta = pregunta.replace(/^\*+|\*+$/g, '').trim(); 
        
        const respuestas = [];
        
        for (let i = 1; i < lines.length; i++) {
            const match = lines[i].match(/[-*]\s*(.*?):\s*(\d+\.?\d*)%/);
            if (match) {
                respuestas.push({
                    respuesta: match[1].trim(),
                    porcentaje: parseFloat(match[2])
                });
            }
        }
        
        return { pregunta, respuestas };
    }).filter(section => section.respuestas.length > 0); // sin respuestas
    
    // console.log(JSON.stringify(parsedSections, null, 2));
    return parsedSections;
}

// utils.js

export function generateCharts(
    data,
    containerId = 'charts-containerResumenIndividualContent',
    chartPrefix = 'chart',
    comparison = null // { data: data2, filter1Name, filter2Name }
) {
    const colors = [
        '#EB5A3C', '#DF9755', '#F0A04B', '#FF9100', '#D85C37', '#E67E22', '#F39C12',
        '#FFB74D', '#FFA726', '#D35400', '#FF6F00', '#F57C00', '#E64A19', '#FF8F00', '#FF5722'
    ];

    const translucentColors = colors.map(color => color + '90');

    let chartsHTML = '';

    data.forEach((section, index) => {
        chartsHTML += `
            <div class="chart-box" style="margin-bottom: 20px; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 15px; color: var(--bs-CR-orange);">${section.pregunta}</h3>
                <canvas id="${chartPrefix}${index}"></canvas>
            </div>
        `;
    });

    // Insertar el HTML generado en el contenedor especificado
    const container = document.getElementById(containerId);
    if (container) {
        // Destruir charts anteriores en este contenedor para evitar fugas y lentitud
        if (!window.__crChartsByContainer) window.__crChartsByContainer = {};
        if (window.__crChartsByContainer[containerId]) {
            window.__crChartsByContainer[containerId].forEach(ch => {
                try { ch.destroy(); } catch (e) {}
            });
        }
        window.__crChartsByContainer[containerId] = [];

        container.innerHTML = chartsHTML; // Insertar todos los gráficos en el contenedor de una vez

        // Crear los gráficos después de insertar el HTML
        data.forEach((section, index) => {
            const ctx = document.getElementById(`${chartPrefix}${index}`).getContext('2d');

            // Preparar labels y datasets (normal o con comparación)
            let labels = section.respuestas.map(r => r.respuesta);
            let datasetPrimaryValues = section.respuestas.map(r => r.porcentaje);
            let datasets;

            if (comparison && Array.isArray(comparison.data)) {
                const compSection = comparison.data.find(s => s.pregunta === section.pregunta);
                if (compSection) {
                    // Construir labels como la unión de ambas listas
                    const labelSet = new Set(labels);
                    compSection.respuestas.forEach(r => labelSet.add(r.respuesta));
                    labels = Array.from(labelSet);

                    const primaryMap = new Map(section.respuestas.map(r => [r.respuesta, r.porcentaje]));
                    const compMap = new Map(compSection.respuestas.map(r => [r.respuesta, r.porcentaje]));

                    datasetPrimaryValues = labels.map(l => primaryMap.get(l) ?? 0);
                    const datasetComparisonValues = labels.map(l => compMap.get(l) ?? 0);

                    datasets = [
                        {
                            label: comparison.filter1Name || 'Filtro 1',
                            data: datasetPrimaryValues,
                            backgroundColor: labels.map((_, i) => translucentColors[i % translucentColors.length]),
                            borderColor: labels.map((_, i) => colors[i % colors.length]),
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        },
                        {
                            label: comparison.filter2Name || 'Filtro 2',
                            data: datasetComparisonValues,
                            backgroundColor: 'rgba(54, 162, 235, 0.35)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        }
                    ];
                } else {
                    // No hay sección equivalente en comparación; mostrar solo primaria
                    datasets = [{
                        data: datasetPrimaryValues,
                        backgroundColor: labels.map((_, i) => translucentColors[i % translucentColors.length]),
                        borderColor: labels.map((_, i) => colors[i % colors.length]),
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }];
                }
            } else {
                // Sin comparación
                datasets = [{
                    data: datasetPrimaryValues,
                    backgroundColor: labels.map((_, i) => translucentColors[i % translucentColors.length]),
                    borderColor: labels.map((_, i) => colors[i % colors.length]),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }];
            }

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: !!(comparison && Array.isArray(comparison.data)),
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            display: false
                        }
                    }
                }
            });

            window.__crChartsByContainer[containerId].push(chart);
        });
        // console.log("Gráficos generados correctamente.");
    } else {
        console.error(`El contenedor de gráficos ${containerId} no se encontró.`);
    }
}

// Nueva función para generar gráficos de comparación (ya no se usa contenedor separado)
export function generateComparisonCharts(data1, data2, filter1Name, filter2Name) {
    const colors = [
        '#EB5A3C', '#DF9755', '#F0A04B', '#FF9100', '#D85C37', '#E67E22', '#F39C12',
        '#FFB74D', '#FFA726', '#D35400', '#FF6F00', '#F57C00', '#E64A19', '#FF8F00', '#FF5722'
    ];

    const translucentColors = colors.map(color => color + '90');

    let chartsHTML = '';

    // Obtener todas las preguntas únicas de ambos datasets
    const allQuestions = new Set();
    data1.forEach(section => allQuestions.add(section.pregunta));
    data2.forEach(section => allQuestions.add(section.pregunta));

    allQuestions.forEach((question, index) => {
        const section1 = data1.find(s => s.pregunta === question);
        const section2 = data2.find(s => s.pregunta === question);
        
        chartsHTML += `
            <div class="chart-box" style="margin-bottom: 20px; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 15px; color: var(--bs-CR-orange);">${question}</h3>
                <canvas id="comparisonChart${index}"></canvas>
            </div>
        `;
    });

    // Insertar el HTML generado en el contenedor de comparación
    const container = document.getElementById('charts-containerComparisonContent');
    if (container) {
        container.innerHTML = chartsHTML;
        container.style.display = 'block';

        // Crear los gráficos de comparación
        allQuestions.forEach((question, index) => {
            const section1 = data1.find(s => s.pregunta === question);
            const section2 = data2.find(s => s.pregunta === question);
            
            const ctx = document.getElementById(`comparisonChart${index}`).getContext('2d');
            
            // Preparar datos para comparación
            const labels = [];
            const dataset1 = [];
            const dataset2 = [];
            
            if (section1 && section2) {
                // Ambos filtros tienen datos para esta pregunta
                const allRespuestas = new Set();
                section1.respuestas.forEach(r => allRespuestas.add(r.respuesta));
                section2.respuestas.forEach(r => allRespuestas.add(r.respuesta));
                
                allRespuestas.forEach(respuesta => {
                    labels.push(respuesta);
                    const resp1 = section1.respuestas.find(r => r.respuesta === respuesta);
                    const resp2 = section2.respuestas.find(r => r.respuesta === respuesta);
                    dataset1.push(resp1 ? resp1.porcentaje : 0);
                    dataset2.push(resp2 ? resp2.porcentaje : 0);
                });
            } else if (section1) {
                // Solo el primer filtro tiene datos
                section1.respuestas.forEach(r => {
                    labels.push(r.respuesta);
                    dataset1.push(r.porcentaje);
                    dataset2.push(0);
                });
            } else if (section2) {
                // Solo el segundo filtro tiene datos
                section2.respuestas.forEach(r => {
                    labels.push(r.respuesta);
                    dataset1.push(0);
                    dataset2.push(r.porcentaje);
                });
            }

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: filter1Name,
                            data: dataset1,
                            backgroundColor: translucentColors[0],
                            borderColor: colors[0],
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        },
                        {
                            label: filter2Name,
                            data: dataset2,
                            backgroundColor: translucentColors[1],
                            borderColor: colors[1],
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        });
    } else {
        console.error("El contenedor de comparación no se encontró.");
    }
}

