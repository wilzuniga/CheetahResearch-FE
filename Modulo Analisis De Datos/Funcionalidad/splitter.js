
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

let delayed;

export function generateCharts(primaryData, compareData = null, primaryLabel = 'Filtro 1', compareLabel = 'Filtro 2', chartType = 'bar') {
    // Si el tipo de gráfico es dona, usar la función específica
    if (chartType === 'doughnut') {
        return generateDoughnutCharts(primaryData, compareData, primaryLabel, compareLabel);
    }

    // Analizar y filtrar datos para comparación segura
    const { safePrimaryData, safeCompareData } = analyzeAndFilterData(primaryData, compareData);
    const primaryColors = [
        '#EB5A3C', '#DF9755', '#F0A04B', '#FF9100', '#D85C37', '#E67E22', '#F39C12',
        '#FFB74D', '#FFA726', '#D35400', '#FF6F00', '#F57C00', '#E64A19', '#FF8F00', '#FF5722'
    ];
    // Paleta azulada para el filtro de comparación
    const compareColors = [
        '#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3',
        '#42A5F5', '#64B5F6', '#90CAF9', '#64B5F6', '#42A5F5',
        '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#0B3C91'
    ];

    const primaryTranslucent = primaryColors.map(color => color + '90');
    const compareTranslucent = compareColors.map(color => color + '90');

    let chartsHTML = '';

    safePrimaryData.forEach((section, index) => {
        chartsHTML += `
            <div class="chart-box">
                <h3>${section.pregunta}</h3>
                <canvas id="chart${index}"></canvas>
            </div>
            <hr>
        `;
    });

    // Insertar el HTML generado en el contenedor
    const container = document.getElementById('charts-containerResumenIndividualContent');
    if (container) {
        container.innerHTML = chartsHTML;

        // Crear los gráficos después de insertar el HTML
        safePrimaryData.forEach((section, index) => {
            const ctx = document.getElementById(`chart${index}`).getContext('2d');
            
            // Mapa para acceso rápido a secciones de comparación por pregunta y acceso por índice
            const compareMap = new Map();
            let compareArray = Array.isArray(safeCompareData) ? safeCompareData : [];
            if (compareArray.length > 0) {
                compareArray.forEach(section => {
                    compareMap.set(section.pregunta, section);
                });
            }

            // Prioridad 1: match por título de pregunta exacto
            let compareSection = compareMap.get(section.pregunta);
            // Prioridad 2: fallback por índice si no hay match por título
            if (!compareSection && compareArray.length > index) {
                compareSection = compareArray[index];
            }

            let allLabels = [];
            let datasets = [];
            const transparent = 'rgba(0,0,0,0)';

            if (compareSection) {
                // Modo 50/50: mitad izquierda = filtro 1, separador, mitad derecha = filtro 2
                const dividerLabel = ' ';
                
                // Ordenar Filtro 1 de mayor a menor
                const sortedPrimary = [...section.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
                const sortedPrimaryLabels = sortedPrimary.map(r => r.respuesta);
                
                // Ordenar Filtro 2 de mayor a menor
                const sortedCompare = [...compareSection.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
                const sortedCompareLabels = sortedCompare.map(r => r.respuesta);
                
                allLabels = [...sortedPrimaryLabels, dividerLabel, ...sortedCompareLabels];

                const primaryValuesByLabel = new Map(sortedPrimary.map(r => [r.respuesta, r.porcentaje]));
                const compareValuesByLabel = new Map(sortedCompare.map(r => [r.respuesta, r.porcentaje]));

                const primaryData = [
                    ...sortedPrimaryLabels.map(label => primaryValuesByLabel.get(label) ?? 0),
                    0, // separador
                    ...sortedCompareLabels.map(() => 0)
                ];
                const compareDataVals = [
                    ...sortedPrimaryLabels.map(() => 0),
                    0, // separador
                    ...sortedCompareLabels.map(label => compareValuesByLabel.get(label) ?? 0)
                ];

                const primaryBg = [
                    ...sortedPrimaryLabels.map((_, i) => primaryTranslucent[i % primaryTranslucent.length]),
                    transparent,
                    ...sortedCompareLabels.map(() => transparent)
                ];
                const primaryBorder = [
                    ...sortedPrimaryLabels.map((_, i) => primaryColors[i % primaryColors.length]),
                    transparent,
                    ...sortedCompareLabels.map(() => transparent)
                ];

                // Forzar color visible en la leyenda del dataset principal
                if (primaryBg.length > 0) {
                    primaryBg[0] = primaryTranslucent[0];
                }
                if (primaryBorder.length > 0) {
                    primaryBorder[0] = primaryColors[0];
                }

                const compareBg = [
                    ...sortedPrimaryLabels.map(() => transparent),
                    transparent,
                    ...sortedCompareLabels.map((_, i) => compareTranslucent[i % compareTranslucent.length])
                ];
                const compareBorder = [
                    ...sortedPrimaryLabels.map(() => transparent),
                    transparent,
                    ...sortedCompareLabels.map((_, i) => compareColors[i % compareColors.length])
                ];

                // Forzar color visible en la leyenda del dataset de comparación
                if (compareBg.length > 0) {
                    compareBg[0] = compareTranslucent[0];
                }
                if (compareBorder.length > 0) {
                    compareBorder[0] = compareColors[0];
                }

                datasets = [
                    {
                        label: primaryLabel,
                        data: primaryData,
                        backgroundColor: primaryBg,
                        borderColor: primaryBorder,
                        borderWidth: 1
                    },
                    {
                        label: compareLabel || 'Comparación',
                        data: compareDataVals,
                        backgroundColor: compareBg,
                        borderColor: compareBorder,
                        borderWidth: 1
                    }
                ];
            } else {
                // Modo normal sin comparación - ordenar de mayor a menor
                const sortedPrimary = [...section.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
                const sortedPrimaryLabels = sortedPrimary.map(r => r.respuesta);
                const sortedPrimaryValues = sortedPrimary.map(r => r.porcentaje);
                
                allLabels = [...sortedPrimaryLabels];
                datasets = [{
                    label: primaryLabel,
                    data: sortedPrimaryValues,
                    backgroundColor: sortedPrimaryLabels.map((_, i) => primaryTranslucent[i % primaryTranslucent.length]),
                    borderColor: sortedPrimaryLabels.map((_, i) => primaryColors[i % primaryColors.length]),
                    borderWidth: 1
                }];
            }

            // reset de animación por render
            delayed = false;

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: allLabels,
                    datasets
                },
                options: {
                    responsive: true,
                    layout: {
                        padding: {
                            bottom: 28
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    animation: {
                        onComplete: () => {
                            delayed = true;
                        },
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                delay = context.dataIndex * 100 + context.datasetIndex * 33;
                            }
                            return delay;
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            stacked: true
                        },
                        x: {
                            position: 'bottom',
                            offset: true,
                            stacked: true,
                            ticks: {
                                rotation: 90,
                                minRotation: 90,
                                maxRotation: 90,
                                padding: 12,
                                crossAlign: 'near',
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        });
    } else {
        console.error("El contenedor de gráficos no se encontró.");
    }
}



//Split para individuales

export function splitMarkdownAndWrap(markdownText) {

    //si el texto tiene un '---' al final, lo elimina
    if (markdownText.endsWith('---')) {
      markdownText = markdownText.slice(0, -3);
    }

    // Separa el texto markdown usando '---' como delimitador
    const sections = markdownText.split('---').map(section => section.trim());
    
    const processedSections = sections.map((section, index) => {
      // Convierte la sección a HTML usando marked
      const html = marked(section);
      
      // Si es la primera sección (encabezado) o la última (conclusiones),
      // se muestra completa sin toggle
      if (index === 0 || index === sections.length - 1) {
        return html;
      }
      
      // Crea un contenedor temporal para manipular el HTML
      const container = document.createElement('div');
      container.innerHTML = html;
      
      // Verifica que el HTML tenga al menos un elemento
      if (container.children.length > 0) {
        // Extrae el primer elemento como resumen
        const summaryElement = container.children[0].outerHTML;
        
        // El resto de los elementos se juntan como contenido adicional
        const remainingContent = Array.from(container.children)
          .slice(1)
          .map(child => child.outerHTML)
          .join('');
        
        // Envuelve todo en un elemento <details> para habilitar el toggle
        return `<details>
          <summary>${summaryElement}</summary>
          ${remainingContent}
        </details>`;
      }
      
      // Si no se encontró ningún elemento, retorna el HTML tal cual
      return html;
    });
    
    return processedSections;
  }
  
export function generateDoughnutCharts(primaryData, compareData = null, primaryLabel = 'Filtro 1', compareLabel = 'Filtro 2') {
    // Analizar y filtrar datos para comparación segura
    const { safePrimaryData, safeCompareData } = analyzeAndFilterData(primaryData, compareData);
    
    const primaryColors = [
        '#EB5A3C', '#DF9755', '#F0A04B', '#FF9100', '#D85C37', '#E67E22', '#F39C12',
        '#FFB74D', '#FFA726', '#D35400', '#FF6F00', '#F57C00', '#E64A19', '#FF8F00', '#FF5722'
    ];
    // Paleta azulada para el filtro de comparación
    const compareColors = [
        '#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3',
        '#42A5F5', '#64B5F6', '#90CAF9', '#64B5F6', '#42A5F5',
        '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#0B3C91'
    ];

    let chartsHTML = '';

    safePrimaryData.forEach((section, index) => {
        chartsHTML += `
            <div class="chart-box">
                <h3>${section.pregunta}</h3>
                <div class="doughnut-container">
                    <div class="doughnut-chart">
                        <canvas id="chart${index}"></canvas>
                    </div>
                    ${safeCompareData ? `<div class="doughnut-chart">
                        <canvas id="chart${index}Compare"></canvas>
                    </div>` : ''}
                </div>
                <div class="color-key-container">
                    <div class="color-key-section">
                        <h4>${primaryLabel}</h4>
                        <div class="color-key-items">
                            <div class="color-key-item">
                                <span class="color-dot" style="background-color: ${primaryColors[0]}"></span>
                                <span class="color-label">Color del filtro</span>
                            </div>
                        </div>
                    </div>
                    ${safeCompareData ? `
                    <div class="color-key-section">
                        <h4>${compareLabel}</h4>
                        <div class="color-key-items">
                            <div class="color-key-item">
                                <span class="color-dot" style="background-color: ${compareColors[0]}"></span>
                                <span class="color-label">Color del filtro</span>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
            <hr>
        `;
    });

    // Insertar el HTML generado en el contenedor
    const container = document.getElementById('charts-containerResumenIndividualContent');
    if (container) {
        container.innerHTML = chartsHTML;

        // Crear los gráficos después de insertar el HTML
        safePrimaryData.forEach((section, index) => {
            // Gráfico principal
            const ctx = document.getElementById(`chart${index}`).getContext('2d');
            createDoughnutChart(ctx, section, primaryColors, primaryLabel, false);

            // Gráfico de comparación si existe
            if (safeCompareData) {
                const compareSection = findCompareSection(section, safeCompareData, index);
                if (compareSection) {
                    const ctxCompare = document.getElementById(`chart${index}Compare`).getContext('2d');
                    createDoughnutChart(ctxCompare, compareSection, compareColors, compareLabel, true);
                }
            }
        });
    } else {
        console.error("El contenedor de gráficos no se encontró.");
    }
}

function findCompareSection(primarySection, compareData, index) {
    // Mapa para acceso rápido a secciones de comparación por pregunta
    const compareMap = new Map();
    let compareArray = Array.isArray(compareData) ? compareData : [];
    if (compareArray.length > 0) {
        compareArray.forEach(section => {
            compareMap.set(section.pregunta, section);
        });
    }

    // Prioridad 1: match por título de pregunta exacto
    let compareSection = compareMap.get(primarySection.pregunta);
    // Prioridad 2: fallback por índice si no hay match por título
    if (!compareSection && compareArray.length > index) {
        compareSection = compareArray[index];
    }

    return compareSection;
}

function createDoughnutChart(ctx, section, colors, label, isCompare = false) {
    // Ordenar respuestas de mayor a menor
    const sortedResponses = [...section.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
    
    const chartColors = sortedResponses.map((_, i) => colors[i % colors.length]);
    const chartColorsTranslucent = chartColors.map(color => color + '80');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sortedResponses.map(r => r.respuesta),
            datasets: [{
                label: label,
                data: sortedResponses.map(r => r.porcentaje),
                backgroundColor: chartColorsTranslucent,
                borderColor: chartColors,
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    bottom: 20
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeOutQuart'
            },
            cutout: '60%',
            radius: '90%'
        }
    });
}

/**
 * Analiza y filtra los datos para asegurar una comparación segura entre filtros
 * Usa comparación inteligente basada en similitud de texto para encontrar preguntas comunes
 * @param {Array} primaryData - Datos del filtro principal
 * @param {Array} compareData - Datos del filtro de comparación
 * @returns {Object} Objeto con datos seguros para comparación
 */
function analyzeAndFilterData(primaryData, compareData) {
    // Si no hay datos de comparación, retornar solo los datos principales
    if (!compareData || !Array.isArray(compareData) || compareData.length === 0) {
        return {
            safePrimaryData: primaryData || [],
            safeCompareData: null
        };
    }

    // Función para normalizar texto para comparación
    function normalizeText(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/\s+/g, ' ') // Normalizar espacios múltiples
            .replace(/[.,;:!?]/g, '') // Remover puntuación
            .replace(/[\[\]()]/g, '') // Remover corchetes y paréntesis
            .trim();
    }

    // Función para calcular similitud entre dos textos
    function calculateSimilarity(text1, text2) {
        const normalized1 = normalizeText(text1);
        const normalized2 = normalizeText(text2);
        
        // Si son exactamente iguales después de normalizar
        if (normalized1 === normalized2) return 1.0;
        
        // Si uno contiene al otro (comparación inteligente)
        if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
            return 0.9; // Alta similitud
        }
        
        // Calcular similitud por palabras comunes
        const words1 = new Set(normalized1.split(' ').filter(word => word.length > 2));
        const words2 = new Set(normalized2.split(' ').filter(word => word.length > 2));
        
        if (words1.size === 0 || words2.size === 0) return 0;
        
        const intersection = new Set([...words1].filter(word => words2.has(word)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    // Función para encontrar la mejor coincidencia
    function findBestMatch(primaryPregunta, compareData) {
        let bestMatch = null;
        let bestSimilarity = 0;
        const threshold = 0.6; // Umbral mínimo de similitud
        
        compareData.forEach(section => {
            if (section && section.pregunta) {
                const similarity = calculateSimilarity(primaryPregunta, section.pregunta);
                if (similarity > bestSimilarity && similarity >= threshold) {
                    bestSimilarity = similarity;
                    bestMatch = section;
                }
            }
        });
        
        return { match: bestMatch, similarity: bestSimilarity };
    }

    // Crear arrays de datos para procesamiento
    const primaryArray = primaryData && Array.isArray(primaryData) ? primaryData : [];
    const compareArray = compareData;
    
    // Encontrar coincidencias inteligentes
    const matches = [];
    
    primaryArray.forEach(primarySection => {
        if (primarySection && primarySection.pregunta) {
            const { match, similarity } = findBestMatch(primarySection.pregunta, compareArray);
            if (match) {
                matches.push({
                    primary: primarySection,
                    compare: match,
                    similarity: similarity
                });
                console.log(`Coincidencia encontrada (${(similarity * 100).toFixed(1)}%):`);
                console.log(`  Principal: ${primarySection.pregunta.substring(0, 80)}...`);
                console.log(`  Comparación: ${match.pregunta.substring(0, 80)}...`);
            }
        }
    });

    // Ordenar por similitud (mayor a menor) y eliminar duplicados
    const uniqueMatches = [];
    const usedCompareIndices = new Set();
    
    matches
        .sort((a, b) => b.similarity - a.similarity)
        .forEach(match => {
            const compareIndex = compareArray.indexOf(match.compare);
            if (!usedCompareIndices.has(compareIndex)) {
                uniqueMatches.push(match);
                usedCompareIndices.add(compareIndex);
            }
        });

    // Preparar datos seguros
    const safePrimaryData = uniqueMatches.map(match => match.primary);
    const safeCompareData = uniqueMatches.map(match => match.compare);

    console.log(`Análisis de datos: ${primaryArray.length} preguntas en filtro principal, ${compareArray.length} en comparación, ${safePrimaryData.length} preguntas comunes encontradas con comparación inteligente`);

    return {
        safePrimaryData: safePrimaryData,
        safeCompareData: safeCompareData
    };
}