
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
    const threshold = 0.2; // Umbral más bajo para detectar subpreguntas similares
    
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
