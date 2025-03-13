
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
    
    console.log(JSON.stringify(parsedSections, null, 2));
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
        console.log("Gráficos generados correctamente.");
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
  