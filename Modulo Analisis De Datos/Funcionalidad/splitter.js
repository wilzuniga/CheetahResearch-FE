
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


// utils.js

export function generateCharts(primaryData, compareData = null, primaryLabel = 'Filtro 1', compareLabel = 'Filtro 2') {
    const primaryColors = [
        '#EB5A3C', '#DF9755', '#F0A04B', '#FF9100', '#D85C37', '#E67E22', '#F39C12',
        '#FFB74D', '#FFA726', '#D35400', '#FF6F00', '#F57C00', '#E64A19', '#FF8F00', '#FF5722'
    ];
    const primaryTranslucent = primaryColors.map(color => color + '90');

    // Paleta secundaria diferenciada (azules)
    const compareColors = [
        '#1E88E5', '#42A5F5', '#64B5F6', '#1976D2', '#0D47A1', '#2196F3', '#90CAF9',
        '#1565C0', '#5E92F3', '#82B1FF', '#2979FF', '#448AFF', '#2962FF', '#3D5AFE', '#1A73E8'
    ];
    const compareTranslucent = compareColors.map(color => color + '90');

    // Mapa para acceso rápido a secciones de comparación por pregunta y acceso por índice
    const compareMap = new Map();
    let compareArray = Array.isArray(compareData) ? compareData : [];
    if (compareArray.length > 0) {
        compareArray.forEach(section => {
            compareMap.set(section.pregunta, section);
        });
    }

    let chartsHTML = '';

    primaryData.forEach((section, index) => {
        chartsHTML += `
            <div class="chart-box">
                <h3>${section.pregunta}</h3>
                <canvas id="chart${index}"></canvas>
            </div>
            <hr>
        `;
    });

    const container = document.getElementById('charts-containerResumenIndividualContent');
    if (!container) {
        console.error("El contenedor de gráficos no se encontró.");
        return;
    }

    container.innerHTML = chartsHTML;

    primaryData.forEach((section, index) => {
        const ctx = document.getElementById(`chart${index}`).getContext('2d');

        // Preparar etiquetas por sección
        const primaryLabels = section.respuestas.map(r => r.respuesta);
        // Prioridad 1: match por título de pregunta exacto
        let compareSection = compareMap.get(section.pregunta);
        // Prioridad 2: fallback por índice si no hay match por título
        if (!compareSection && compareArray.length > index) {
            compareSection = compareArray[index];
        }
        const compareLabels = compareSection ? compareSection.respuestas.map(r => r.respuesta) : [];

        let allLabels = [];
        let datasets = [];
        const transparent = 'rgba(0,0,0,0)';

        if (compareSection) {
            // Modo 50/50: mitad izquierda = filtro 1, separador, mitad derecha = filtro 2
            const dividerLabel = ' ';
            allLabels = [...primaryLabels, dividerLabel, ...compareLabels];

            const primaryValuesByLabel = new Map(section.respuestas.map(r => [r.respuesta, r.porcentaje]));
            const compareValuesByLabel = new Map(compareSection.respuestas.map(r => [r.respuesta, r.porcentaje]));

            const primaryData = [
                ...primaryLabels.map(label => primaryValuesByLabel.get(label) ?? 0),
                0, // separador
                ...compareLabels.map(() => 0)
            ];
            const compareDataVals = [
                ...primaryLabels.map(() => 0),
                0, // separador
                ...compareLabels.map(label => compareValuesByLabel.get(label) ?? 0)
            ];

            const primaryBg = [
                ...primaryLabels.map((_, i) => primaryTranslucent[i % primaryTranslucent.length]),
                transparent,
                ...compareLabels.map(() => transparent)
            ];
            const primaryBorder = [
                ...primaryLabels.map((_, i) => primaryColors[i % primaryColors.length]),
                transparent,
                ...compareLabels.map(() => transparent)
            ];

            const compareBg = [
                ...primaryLabels.map(() => transparent),
                transparent,
                ...compareLabels.map((_, i) => compareTranslucent[i % compareTranslucent.length])
            ];
            const compareBorder = [
                ...primaryLabels.map(() => transparent),
                transparent,
                ...compareLabels.map((_, i) => compareColors[i % compareColors.length])
            ];

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
            // Modo normal sin comparación
            allLabels = [...primaryLabels];
            const primaryValuesByLabel = new Map(section.respuestas.map(r => [r.respuesta, r.porcentaje]));
            const primaryValues = allLabels.map(label => primaryValuesByLabel.get(label) ?? 0);
            datasets = [{
                label: primaryLabel,
                data: primaryValues,
                backgroundColor: allLabels.map((_, i) => primaryTranslucent[i % primaryTranslucent.length]),
                borderColor: allLabels.map((_, i) => primaryColors[i % primaryColors.length]),
                borderWidth: 1
            }];
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: allLabels,
                datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    },
                    x: {
                        display: true
                    }
                }
            }
        });
    });
}

