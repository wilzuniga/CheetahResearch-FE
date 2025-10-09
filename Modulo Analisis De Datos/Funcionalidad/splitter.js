
export function splitMarkdown(markdownText) {
    const sections = markdownText.split('---').map(section => section.trim());
    
    const parsedSections = [];
    
    sections.forEach(section => {
        const lines = section.split('\n');
        let pregunta = lines[0].replace(/^#+\s*/, '').trim(); // Extrae la pregunta principal
        pregunta = pregunta.replace(/^\*+|\*+$/g, '').trim(); 
        
        // Detectar si es una pregunta compuesta con subgráficos
        const subGraficos = [];
        let currentSubGrafico = null;
        let hasSubtitles = false;
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detectar subtítulos (formato **subtitulo** o ##### subtitulo)
            // También detectar subtítulos que pueden tener espacios o estar en líneas separadas
            // Mejorar la detección para casos como:
            // - **Distribución por Género**
            // - **Distribución por Género** (con espacios)
            // - Subtítulos en líneas separadas
            let subtitleMatch = line.match(/^\*\*(.*?)\*\*$|^#{1,6}\s*(.*?)$/);
            
            // Si no hay match directo, verificar si es una línea que solo contiene asteriscos
            if (!subtitleMatch && line.trim() === '**') {
                // Buscar la siguiente línea que contenga el subtítulo
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine && !nextLine.match(/^[-*]/) && !nextLine.match(/^\d+\.?\d*%/)) {
                        subtitleMatch = [null, nextLine, nextLine];
                        i++; // Saltar la siguiente línea ya que la procesamos aquí
                    }
                }
            }
            
            if (subtitleMatch) {
                hasSubtitles = true;
                // Si ya teníamos un subgráfico, guardarlo
                if (currentSubGrafico && currentSubGrafico.respuestas.length > 0) {
                    subGraficos.push(currentSubGrafico);
                }
                
                // Crear nuevo subgráfico
                const subtitle = subtitleMatch[1] || subtitleMatch[2];
                currentSubGrafico = {
                    subtitulo: subtitle.trim(),
                    respuestas: []
                };
            } else if (currentSubGrafico) {
                // Buscar respuestas con porcentajes en el subgráfico actual
                const match = line.match(/[-*]\s*(.*?):\s*(\d+\.?\d*)%/);
                if (match) {
                    currentSubGrafico.respuestas.push({
                        respuesta: match[1].trim(),
                        porcentaje: parseFloat(match[2])
                    });
                }
            } else {
                // Buscar respuestas con porcentajes fuera de subgráficos (pregunta simple)
                const match = line.match(/[-*]\s*(.*?):\s*(\d+\.?\d*)%/);
                if (match) {
                    if (!currentSubGrafico) {
                        // Es una pregunta simple, crear un subgráfico por defecto
                        currentSubGrafico = {
                            subtitulo: null, // null indica que es una pregunta simple
                            respuestas: []
                        };
                    }
                    currentSubGrafico.respuestas.push({
                        respuesta: match[1].trim(),
                        porcentaje: parseFloat(match[2])
                    });
                }
            }
        }
        
        // Agregar el último subgráfico si existe
        if (currentSubGrafico && currentSubGrafico.respuestas.length > 0) {
            subGraficos.push(currentSubGrafico);
        }
        
        // Solo agregar secciones que tengan respuestas
        if (subGraficos.some(sg => sg.respuestas.length > 0)) {
            parsedSections.push({
                pregunta: pregunta,
                subGraficos: subGraficos,
                isCompuesta: hasSubtitles
            });
        }
    });
    
    // console.log(JSON.stringify(parsedSections, null, 2));
    return parsedSections;
}

// utils.js

let delayed;

// Función para envolver texto a varias líneas por longitud máxima
function wrapTextToLines(text, maxCharsPerLine = 16) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";

    for (const word of words) {
        if (line.length + word.length <= maxCharsPerLine) {
            line += (line ? " " : "") + word;
        } else {
            if (line) lines.push(line);
            line = word;
        }
    }
    if (line) lines.push(line);
    
    return lines;
}

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
    let chartIndex = 0;

    safePrimaryData.forEach((section, sectionIndex) => {
        if (section.isCompuesta) {
            // Pregunta compuesta con subgráficos
            chartsHTML += `
                <div class="chart-section">
                    <h2 class="main-question">${section.pregunta}</h2>
            `;
            
            // Generar HTML para cada subgráfico
            section.subGraficos.forEach((subGrafico, subIndex) => {
                chartsHTML += `
                    <div class="chart-box">
                        <h3 class="subtitle">${subGrafico.subtitulo}</h3>
                        <canvas id="chart${chartIndex}"></canvas>
                    </div>
                `;
                chartIndex++;
            });
            
            chartsHTML += `
                </div>
                <hr class="section-divider">
            `;
        } else {
            // Pregunta simple (comportamiento anterior)
            section.subGraficos.forEach((subGrafico, subIndex) => {
                chartsHTML += `
                    <div class="chart-box">
                        <h3>${section.pregunta}</h3>
                        <canvas id="chart${chartIndex}"></canvas>
                    </div>
                    <hr>
                `;
                chartIndex++;
            });
        }
    });

    // Insertar el HTML generado en el contenedor
    const container = document.getElementById('charts-containerResumenIndividualContent');
    if (container) {
        container.innerHTML = chartsHTML;

        // Crear los gráficos después de insertar el HTML
        let chartIndex = 0;
        
        safePrimaryData.forEach((section, sectionIndex) => {
            if (section.isCompuesta) {
                // Crear gráficos para cada subgráfico de pregunta compuesta
                section.subGraficos.forEach((subGrafico, subIndex) => {
                    const ctx = document.getElementById(`chart${chartIndex}`).getContext('2d');
                    
                    // Buscar subgráfico de comparación por similitud de subtítulo
                    let compareSubGrafico = findCompareSubGrafico(subGrafico, section, safeCompareData);
                    
                    createBarChart(ctx, subGrafico, compareSubGrafico, primaryColors, compareColors, 
                                 primaryTranslucent, compareTranslucent, primaryLabel, compareLabel);
                    
                    chartIndex++;
                });
            } else {
                // Crear gráficos para pregunta simple (comportamiento anterior)
                section.subGraficos.forEach((subGrafico, subIndex) => {
                    const ctx = document.getElementById(`chart${chartIndex}`).getContext('2d');
                    
                    // Para preguntas simples, buscar comparación por título de pregunta
                    let compareSection = findCompareSection(section, safeCompareData, sectionIndex);
                    let compareSubGrafico = compareSection ? compareSection.subGraficos[0] : null;
                    
                    createBarChart(ctx, subGrafico, compareSubGrafico, primaryColors, compareColors, 
                                 primaryTranslucent, compareTranslucent, primaryLabel, compareLabel);
                    
                    chartIndex++;
                });
            }
        });
    } else {
        console.error("El contenedor de gráficos no se encontró.");
    }
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

    let chartIndex = 0;

    safePrimaryData.forEach((section, sectionIndex) => {
        if (section.isCompuesta) {
            // Pregunta compuesta con subgráficos
            chartsHTML += `
                <div class="chart-section">
                    <h2 class="main-question">${section.pregunta}</h2>
            `;
            
            // Generar HTML para cada subgráfico
            section.subGraficos.forEach((subGrafico, subIndex) => {
                chartsHTML += `
                    <div class="chart-box">
                        <h3 class="subtitle">${subGrafico.subtitulo}</h3>
                        <div class="doughnut-container">
                            <div class="doughnut-chart">
                                <canvas id="chart${chartIndex}"></canvas>
                            </div>
                            ${safeCompareData ? `<div class="doughnut-chart">
                                <canvas id="chart${chartIndex}Compare"></canvas>
                            </div>` : ''}
                        </div>
                        <div class="color-key-container">
                            <div class="color-key-item">
                                <span class="color-dot" style="background-color: ${primaryColors[0]}"></span>
                                <span class="color-label">${primaryLabel}</span>
                                ${safeCompareData ? `
                                <span class="color-dot" style="background-color: ${compareColors[0]}"></span>
                                <span class="color-label">${compareLabel}</span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
                chartIndex++;
            });
            
            chartsHTML += `
                </div>
                <hr class="section-divider">
            `;
        } else {
            // Pregunta simple (comportamiento anterior)
            section.subGraficos.forEach((subGrafico, subIndex) => {
                chartsHTML += `
                    <div class="chart-box">
                        <h3>${section.pregunta}</h3>
                        <div class="doughnut-container">
                            <div class="doughnut-chart">
                                <canvas id="chart${chartIndex}"></canvas>
                            </div>
                            ${safeCompareData ? `<div class="doughnut-chart">
                                <canvas id="chart${chartIndex}Compare"></canvas>
                            </div>` : ''}
                        </div>
                        <div class="color-key-container">
                            <div class="color-key-item">
                                <span class="color-dot" style="background-color: ${primaryColors[0]}"></span>
                                <span class="color-label">${primaryLabel}</span>
                                ${safeCompareData ? `
                                <span class="color-dot" style="background-color: ${compareColors[0]}"></span>
                                <span class="color-label">${compareLabel}</span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <hr>
                `;
                chartIndex++;
            });
        }
    });

    // Insertar el HTML generado en el contenedor
    const container = document.getElementById('charts-containerResumenIndividualContent');
    if (container) {
        container.innerHTML = chartsHTML;

        // Crear los gráficos después de insertar el HTML
        let chartIndex = 0;
        
        safePrimaryData.forEach((section, sectionIndex) => {
            if (section.isCompuesta) {
                // Crear gráficos para cada subgráfico de pregunta compuesta
                section.subGraficos.forEach((subGrafico, subIndex) => {
                    // Gráfico principal
                    const ctx = document.getElementById(`chart${chartIndex}`).getContext('2d');
                    createDoughnutChart(ctx, subGrafico, primaryColors, primaryLabel, false);

                    // Gráfico de comparación si existe
                    if (safeCompareData) {
                        const compareSubGrafico = findCompareSubGrafico(subGrafico, section, safeCompareData);
                        if (compareSubGrafico) {
                            const ctxCompare = document.getElementById(`chart${chartIndex}Compare`).getContext('2d');
                            createDoughnutChart(ctxCompare, compareSubGrafico, compareColors, compareLabel, false);
                        }
                    }
                    
                    chartIndex++;
                });
            } else {
                // Crear gráficos para pregunta simple (comportamiento anterior)
                section.subGraficos.forEach((subGrafico, subIndex) => {
                    // Gráfico principal
                    const ctx = document.getElementById(`chart${chartIndex}`).getContext('2d');
                    createDoughnutChart(ctx, subGrafico, primaryColors, primaryLabel, false);

                    // Gráfico de comparación si existe
                    if (safeCompareData) {
                        const compareSection = findCompareSection(section, safeCompareData, sectionIndex);
                        if (compareSection && compareSection.subGraficos && compareSection.subGraficos[0]) {
                            const ctxCompare = document.getElementById(`chart${chartIndex}Compare`).getContext('2d');
                            createDoughnutChart(ctxCompare, compareSection.subGraficos[0], compareColors, compareLabel, false);
                        }
                    }
                    
                    chartIndex++;
                });
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

/**
 * Busca un subgráfico de comparación basándose en la similitud del subtítulo
 * @param {Object} primarySubGrafico - Subgráfico principal
 * @param {Object} primarySection - Sección principal completa
 * @param {Array} compareData - Datos de comparación
 * @returns {Object|null} Subgráfico de comparación encontrado o null
 */
function findCompareSubGrafico(primarySubGrafico, primarySection, compareData) {
    if (!compareData || !Array.isArray(compareData) || compareData.length === 0) {
        return null;
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

    // Buscar en todas las secciones de comparación
    let bestMatch = null;
    let bestSimilarity = 0;
    const threshold = 0.1; // Umbral más bajo para detectar subpreguntas similares
    
    compareData.forEach(compareSection => {
        if (compareSection && compareSection.subGraficos) {
            compareSection.subGraficos.forEach(compareSubGrafico => {
                if (compareSubGrafico && compareSubGrafico.subtitulo) {
                    const similarity = calculateSimilarity(
                        primarySubGrafico.subtitulo, 
                        compareSubGrafico.subtitulo
                    );
                    
                    if (similarity > bestSimilarity && similarity >= threshold) {
                        bestSimilarity = similarity;
                        bestMatch = compareSubGrafico;
                    }
                }
            });
        }
    });

    if (bestMatch) {
        console.log(`Subgráfico encontrado (${(bestSimilarity * 100).toFixed(1)}% similitud):`);
        console.log(`  Principal: ${primarySubGrafico.subtitulo}`);
        console.log(`  Comparación: ${bestMatch.subtitulo}`);
    }

    return bestMatch;
}

/**
 * Crea un gráfico de barras con comparación o sin ella
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {Object} subGrafico - Subgráfico principal
 * @param {Object} compareSubGrafico - Subgráfico de comparación (opcional)
 * @param {Array} primaryColors - Colores principales
 * @param {Array} compareColors - Colores de comparación
 * @param {Array} primaryTranslucent - Colores principales translúcidos
 * @param {Array} compareTranslucent - Colores de comparación translúcidos
 * @param {string} primaryLabel - Etiqueta del filtro principal
 * @param {string} compareLabel - Etiqueta del filtro de comparación
 */
function createBarChart(ctx, subGrafico, compareSubGrafico, primaryColors, compareColors, 
                       primaryTranslucent, compareTranslucent, primaryLabel, compareLabel) {
    let allLabels = [];
    let datasets = [];
    const transparent = 'rgba(0,0,0,0)';

    if (compareSubGrafico) {
        // Modo 50/50: mitad izquierda = filtro 1, separador, mitad derecha = filtro 2
        const dividerLabel = ' ';
        
        // Ordenar Filtro 1 de mayor a menor
        const sortedPrimary = [...subGrafico.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
        const sortedPrimaryLabels = sortedPrimary.map(r => r.respuesta);
        
        // Ordenar Filtro 2 de mayor a menor
        const sortedCompare = [...compareSubGrafico.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
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
        const sortedPrimary = [...subGrafico.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
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
                    bottom: 45
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y ?? context.parsed;
                            return `${context.dataset.label}: ${value}%`;
                        }
                    }
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
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    position: 'bottom',
                    offset: true,
                    stacked: true,
                    ticks: {
                        callback: function(value, index) {
                            const label = this.getLabelForValue(value);
                            // Si es un separador, retornar string vacío
                            if (label === ' ' || label === '') return '';
                            
                            // Aplicar wrap de texto y retornar array de líneas
                            return wrapTextToLines(label, 18);
                        },
                        padding: 8,
                        crossAlign: 'near',
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

function createDoughnutChart(ctx, subGrafico, colors, label, isCompare = false) {
    // Validar que subGrafico y respuestas existan
    if (!subGrafico || !subGrafico.respuestas || !Array.isArray(subGrafico.respuestas)) {
        console.error('Error: subGrafico.respuestas no es válido:', subGrafico);
        return;
    }
    
    // Ordenar respuestas de mayor a menor (mismo orden que gráficos de barras)
    const sortedResponses = [...subGrafico.respuestas].sort((a, b) => b.porcentaje - a.porcentaje);
    
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
      let html = marked(section);
      
      // Verificar si esta sección contiene análisis NPS
      const npsData = parseNPSSection(section);
      if (npsData) {
        // Agregar el gráfico de dona después del análisis NPS
        const chartId = `nps-chart-${index}`;
        const chartHTML = generateNPSDonutChart(npsData, chartId);
        html += chartHTML;
      }
      
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

// Nueva función para procesar gráficos NPS después de insertar el HTML
export function processNPSCharts(markdownText) {
    if (markdownText.endsWith('---')) {
      markdownText = markdownText.slice(0, -3);
    }

    const sections = markdownText.split('---').map(section => section.trim());
    
    sections.forEach((section, index) => {
      const npsData = parseNPSSection(section);
      if (npsData) {
        const chartId = `nps-chart-${index}`;
        // Esperar un poco para que el DOM se actualice
        setTimeout(() => {
          createNPSDonutChart(chartId, npsData);
        }, 200);
      }
    });
  }

/**
 * Función para parsear una sección y extraer datos NPS
 * @param {string} section - Sección de texto markdown
 * @returns {Object|null} Datos NPS o null si no es una sección NPS
 */
function parseNPSSection(section) {
    // Función para calcular la similitud entre dos cadenas usando distancia de Levenshtein
    function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],     // deletion
                        dp[i][j - 1],     // insertion
                        dp[i - 1][j - 1]  // substitution
                    );
                }
            }
        }
        return dp[m][n];
    }

    // Función para calcular la similitud normalizada (0-1)
    function stringSimilarity(str1, str2) {
        const maxLength = Math.max(str1.length, str2.length);
        const distance = levenshteinDistance(str1, str2);
        return 1 - (distance / maxLength);
    }

    // Función auxiliar para extraer números de una línea después de dos puntos o igual
    function extractNumber(line) {
        // Buscar patrones como "label: 42%" o "label: 42" o "label = 42"
        // Primero intentamos encontrar el último número en la línea después de : o =
        const patterns = [
            /:\s*(\d+\.?\d*)%?\s*$/,  // Después de dos puntos al final
            /:\s*(\d+\.?\d*)%?/,  // Después de dos puntos
            /=\s*(\d+\.?\d*)%?\s*$/,  // Después de igual al final
            /=\s*(\d+\.?\d*)%?/,  // Después de igual
            /(\d+\.?\d*)%?\s*$/  // Número al final de la línea
        ];
        
        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match && match[1]) {
                const value = parseFloat(match[1]);
                // Solo retornar valores que tengan sentido como porcentajes (0-100)
                if (value >= 0 && value <= 100) {
                    return value;
                }
            }
        }
        return null;
    }

    // Limpiamos el texto de markdown y caracteres especiales
    const cleanText = section.replace(/[#*_]/g, '').trim();
    const lines = cleanText.split('\n').map(line => line.trim());
    
    let npsTotal = null;
    let promotores = null, indiferentes = null, detractores = null;
    
    const similarityThreshold = 0.4; // Umbral de similitud (40%)

    // Patrones base para buscar NPS
    const npsBasePatterns = [
        "Análisis NPS: NPS = % Promotores - % Detractores =",
        "NPS = % Promotores - % Detractores =",
        "Net Promoter Score:",
        "Resultado NPS:",
        "NPS Total:",
        "NPS General:",
        "Índice NPS:",
        "Puntuación NPS:",
        "NPS Score:",
        "NPS Value:"
    ];

    // Buscar NPS Total con similitud
    for (const line of lines) {
        for (const pattern of npsBasePatterns) {
            if (stringSimilarity(line.toLowerCase(), pattern.toLowerCase()) >= similarityThreshold) {
                // Para NPS total, buscar específicamente números con signo (positivos o negativos)
                const npsMatch = line.match(/:\s*(-?\d+\.?\d*)%?|=\s*(-?\d+\.?\d*)%?/);
                if (npsMatch) {
                    const value = npsMatch[1] || npsMatch[2];
                    if (value !== undefined && value !== null) {
                        npsTotal = parseFloat(value);
                        break;
                    }
                }
            }
        }
        if (npsTotal !== null) break;
    }

    if (npsTotal === null) {
        return null;
    }

    // Patrones base para buscar porcentajes
    const promotoresBasePatterns = [
        "Promotores:",
        "% Promotores:",
        "Promotores (%)",
        "Porcentaje de Promotores:"
    ];

    const indiferentesBasePatterns = [
        "Indiferentes:", 
        "% Indiferentes:",
        "Indiferentes (%)",
        "Porcentaje de Indiferentes:",
        "Pasivos:",
        "Neutros:"
    ];

    const detractoresBasePatterns = [
        "Detractores:",
        "% Detractores:", 
        "Detractores (%)",
        "Porcentaje de Detractores:"
    ];

    // Buscar promotores con similitud
    for (const line of lines) {
        for (const pattern of promotoresBasePatterns) {
            const similarity = stringSimilarity(line.toLowerCase(), pattern.toLowerCase());
            if (similarity >= similarityThreshold) {
                const value = extractNumber(line);
                console.log(`Debug Promotores - Línea: "${line}", Pattern: "${pattern}", Similitud: ${similarity.toFixed(2)}, Valor: ${value}`);
                if (value !== null && value >= 0) {
                    promotores = value;
                    break;
                }
            }
        }
        if (promotores !== null) break;
    }

    // Buscar indiferentes con similitud 
    for (const line of lines) {
        for (const pattern of indiferentesBasePatterns) {
            const similarity = stringSimilarity(line.toLowerCase(), pattern.toLowerCase());
            if (similarity >= similarityThreshold) {
                const value = extractNumber(line);
                console.log(`Debug Indiferentes - Línea: "${line}", Pattern: "${pattern}", Similitud: ${similarity.toFixed(2)}, Valor: ${value}`);
                if (value !== null && value >= 0) {
                    indiferentes = value;
                    break;
                }
            }
        }
        if (indiferentes !== null) break;
    }

    // Buscar detractores con similitud
    for (const line of lines) {
        for (const pattern of detractoresBasePatterns) {
            const similarity = stringSimilarity(line.toLowerCase(), pattern.toLowerCase());
            if (similarity >= similarityThreshold) {
                const value = extractNumber(line);
                console.log(`Debug Detractores - Línea: "${line}", Pattern: "${pattern}", Similitud: ${similarity.toFixed(2)}, Valor: ${value}`);
                if (value !== null && value >= 0) {
                    detractores = value;
                    break;
                }
            }
        }
        if (detractores !== null) break;
    }
    
    // Validar que tenemos todos los valores necesarios
    if (npsTotal === null || promotores === null || indiferentes === null || detractores === null) {
        console.log('Debug NPS - No se encontraron todos los valores:', {
            npsTotal, promotores, indiferentes, detractores, 
            section: section.substring(0, 300) + '...'
        });
        return null;
    }
    
    // Validar que los porcentajes sumen aproximadamente 100
    const suma = promotores + indiferentes + detractores;
    if (Math.abs(suma - 100) > 5) { // Permitir un margen de error de 5%
        console.log('Debug NPS - Los porcentajes no suman 100:', {
            promotores, indiferentes, detractores, suma
        });
    }
    
    console.log('Debug NPS - Valores encontrados:', {
        npsTotal, promotores, indiferentes, detractores, suma
    });
    
    return {
        npsTotal: npsTotal,
        promotores: promotores,
        indiferentes: indiferentes,
        detractores: detractores
    };
}

/**
 * Genera el HTML para el gráfico de barra NPS personalizado
 * @param {Object} npsData - Datos NPS parseados
 * @param {string} chartId - ID único para el gráfico
 * @returns {string} HTML del contenedor del gráfico
 */
function generateNPSDonutChart(npsData, chartId) {
    const detractoresWidth = npsData.detractores;
    const indiferentesWidth = npsData.indiferentes;
    const promotoresWidth = npsData.promotores;
    
    // Generar iconos basados en los porcentajes (máximo 10 iconos por segmento)
    const getIcons = (percentage, iconType) => {
        const iconCount = Math.max(1, Math.min(10, Math.round(percentage / 10)));
        let iconHTML = '';
        for (let i = 0; i < iconCount; i++) {
            iconHTML += `<span class="nps-icon nps-icon-${iconType}">😞</span>`;
        }
        return iconHTML;
    };

    const detractoresIcons = getIcons(detractoresWidth, 'sad').replace(/😞/g, '😞');
    const indiferentesIcons = getIcons(indiferentesWidth, 'neutral').replace(/😞/g, '😐');
    const promotoresIcons = getIcons(promotoresWidth, 'happy').replace(/😞/g, '😊');

    return `
        <div class="nps-chart-container" style="margin: 20px 0; padding: 20px; background: white; border-radius: 13px; border: 1px solid #e0e0e0;">
            <h4 style="text-align: center; margin-bottom: 20px; font-family: hedliner; color: #333;">
                NPS TOTAL: ${npsData.npsTotal}%
            </h4>
            
            <!-- Iconos encima de la barra -->
            <div class="nps-icons-container" style="display: flex; justify-content: space-between; margin-bottom: 10px; height: 40px; align-items: end;">
                <div class="nps-icons-section" style="width: ${detractoresWidth}%; display: flex; justify-content: center; flex-wrap: wrap;">
                    ${detractoresIcons}
                </div>
                <div class="nps-icons-section" style="width: ${indiferentesWidth}%; display: flex; justify-content: center; flex-wrap: wrap;">
                    ${indiferentesIcons}
                </div>
                <div class="nps-icons-section" style="width: ${promotoresWidth}%; display: flex; justify-content: center; flex-wrap: wrap;">
                    ${promotoresIcons}
                </div>
            </div>
            
            <!-- Barra NPS -->
            <div class="nps-bar-container" style="width: 100%; height: 60px; display: flex; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 10px 0;">
                <!-- Segmento Detractores -->
                <div class="nps-segment nps-detractores" style="
                    width: ${detractoresWidth}%; 
                    background: linear-gradient(45deg, #dc3545, #c82333);
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    position: relative;
                ">
                    ${detractoresWidth > 8 ? detractoresWidth + '%' : ''}
                </div>
                
                <!-- Segmento Indiferentes -->
                <div class="nps-segment nps-indiferentes" style="
                    width: ${indiferentesWidth}%; 
                    background: linear-gradient(45deg, #ffc107, #e0a800);
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    position: relative;
                ">
                    ${indiferentesWidth > 8 ? indiferentesWidth + '%' : ''}
                </div>
                
                <!-- Segmento Promotores -->
                <div class="nps-segment nps-promotores" style="
                    width: ${promotoresWidth}%; 
                    background: linear-gradient(45deg, #28a745, #218838);
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    position: relative;
                ">
                    ${promotoresWidth > 8 ? promotoresWidth + '%' : ''}
                </div>
            </div>
            
            <!-- Etiquetas de rangos -->
            <div class="nps-labels-container" style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 15px; color: #666;">
                <div class="nps-label" style="text-align: left;">
                    <strong style="color: #dc3545;">Detractores</strong><br>
                    Puntuación: 0-6
                </div>
                <div class="nps-label" style="text-align: center;">
                    <strong style="color: #ffc107;">Indiferentes</strong><br>
                    Puntuación: 7-8
                </div>
                <div class="nps-label" style="text-align: right;">
                    <strong style="color: #28a745;">Promotores</strong><br>
                    Puntuación: 9-10
                </div>
            </div>
        </div>
        
        <style>
            .nps-icon {
                font-size: 18px;
                margin: 0 2px;
                display: inline-block;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
            }
            
            .nps-icon-sad {
                color: #dc3545;
            }
            
            .nps-icon-neutral {
                color: #ffc107;
            }
            
            .nps-icon-happy {
                color: #28a745;
            }
            
            .nps-segment {
                transition: all 0.3s ease;
                border-right: 1px solid rgba(255,255,255,0.2);
            }
            
            .nps-segment:last-child {
                border-right: none;
            }
            
            .nps-segment:hover {
                transform: scaleY(1.05);
                box-shadow: inset 0 0 20px rgba(255,255,255,0.2);
            }
            
            .nps-icons-section {
                transition: transform 0.2s ease;
            }
            
            .nps-icons-section:hover {
                transform: translateY(-2px);
            }
        </style>
    `;
}

/**
 * Función simplificada para NPS - ya no necesita Chart.js
 * @param {string} chartId - ID del canvas (ya no se usa)
 * @param {Object} npsData - Datos NPS (ya no se usa, el HTML se genera directamente)
 */
function createNPSDonutChart(chartId, npsData) {
    // Esta función ya no es necesaria porque el gráfico se genera completamente en HTML/CSS
    // Se mantiene para compatibilidad pero no hace nada
    console.log('NPS chart generated with HTML/CSS - Chart.js no longer needed');
}

/**
 * Analiza y filtra los datos para asegurar una comparación segura entre filtros
 * Usa comparación inteligente basada en similitud de texto para encontrar preguntas comunes
 * @param {Array} primaryData - Datos del filtro principal
 * @param {Array} compareData - Datos del filtro de comparación
 * @returns {Object} Objeto con datos seguros para comparación
 */
function analyzeAndFilterData(primaryData, compareData) {
    // Si no hay datos de comparación, retornar solo los datos principales en orden original
    if (!compareData || !Array.isArray(compareData) || compareData.length === 0) {
        return {
            safePrimaryData: primaryData && Array.isArray(primaryData) ? primaryData : [],
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
        const threshold = 0.1; // Umbral mínimo de similitud
        
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

    // Eliminar duplicados manteniendo el orden original
    const uniqueMatches = [];
    const usedCompareIndices = new Set();
    const usedPrimaryIndices = new Set();
    
    // Mantener el orden original de las preguntas principales
    matches.forEach(match => {
        const compareIndex = compareArray.indexOf(match.compare);
        const primaryIndex = primaryArray.indexOf(match.primary);
        
        // Solo agregar si no hemos usado esta comparación ni esta pregunta principal
        if (!usedCompareIndices.has(compareIndex) && !usedPrimaryIndices.has(primaryIndex)) {
            uniqueMatches.push(match);
            usedCompareIndices.add(compareIndex);
            usedPrimaryIndices.add(primaryIndex);
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