
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

export function generateCharts(data) {
    const colors = [
        '#EB5A3C', '#DF9755', '#F0A04B', '#FF9100', '#D85C37', '#E67E22', '#F39C12',
        '#FFB74D', '#FFA726', '#D35400', '#FF6F00', '#F57C00', '#E64A19', '#FF8F00', '#FF5722'
    ];

    const translucentColors = colors.map(color => color + '90');

    let chartsHTML = '';

    data.forEach((section, index) => {
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
        container.innerHTML = chartsHTML; // Insertar todos los gráficos en el contenedor de una vez

        // Crear los gráficos después de insertar el HTML
        data.forEach((section, index) => {
            const ctx = document.getElementById(`chart${index}`).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: section.respuestas.map(r => r.respuesta),
                    datasets: [{
                        data: section.respuestas.map(r => r.porcentaje),
                        backgroundColor: section.respuestas.map((_, i) => translucentColors[i % translucentColors.length]),
                        borderColor: section.respuestas.map((_, i) => colors[i % colors.length]), // Bordes sin transparencia
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        },
                        x: {
                            display: false
                        }
                    }
                }
            });
        });
        // console.log("Gráficos generados correctamente.");
    } else {
        console.error("El contenedor de gráficos no se encontró.");
    }
}
