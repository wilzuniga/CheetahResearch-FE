// agregarCard.js

function contenido() {
    //generaar tarjeta de muestra

    var filtros = [
        "Iluminación LED",
        "HVAC",
        "Materiales aislantes"
    ];

    // Array de preguntas
    const preguntas = [
        "¿Con qué frecuencia visitas nuestro restaurante?",
        "¿Qué tan satisfecho estás con la calidad de la comida?",
        "¿Cómo calificarías el servicio del restaurante?",
        "¿Recomendarías nuestro restaurante a tus amigos y familiares?",
        "¿Qué mejorarías de nuestra experiencia gastronómica?",
    ];

    // Array de resúmenes de respuestas detallados
    const resúmenesRespuestas = [
        "La mayoría de los encuestados visita el restaurante al menos una vez al mes, con un 40% de ellos acudiendo semanalmente. Un 20% lo hace quincenalmente y otro 10% solo en ocasiones especiales. Los clientes frecuentes valoran especialmente la consistencia en la calidad de la comida y el ambiente acogedor. Algunos de ellos mencionaron que el restaurante se ha convertido en su lugar favorito para relajarse después del trabajo o para celebrar eventos especiales con amigos y familiares. Los encuestados destacaron la importancia de las promociones regulares y los descuentos para clientes frecuentes, que incentivan visitas repetidas. Sin embargo, aquellos que visitan menos frecuentemente mencionan factores como la distancia y el precio como barreras para una mayor asiduidad. Algunos también señalaron que les gustaría ver más eventos temáticos y noches especiales que podrían motivarlos a visitar el restaurante con mayor frecuencia. La introducción de un programa de lealtad también fue una sugerencia popular entre los encuestados menos frecuentes.",
        
        "El 85% de los encuestados expresó una alta satisfacción con la calidad de la comida, destacando la frescura y el sabor de las alitas como puntos fuertes. Muchos mencionaron que las alitas siempre están bien cocidas y que las salsas ofrecen una variedad de sabores que se adaptan a todos los gustos. Algunos mencionaron que la variedad de salsas es un gran atractivo, especialmente las salsas picantes que parecen ser las favoritas entre los clientes regulares. Sin embargo, un 10% indicó que la calidad puede ser inconsistente, especialmente en horarios pico. Un encuestado mencionó que a veces las alitas llegan un poco frías cuando el restaurante está muy lleno. Un 5% de los encuestados sugirió la inclusión de más opciones vegetarianas o saludables, mencionando que les gustaría ver opciones como alitas de coliflor o ensaladas más variadas. Además, algunos clientes sugirieron que el menú podría beneficiarse de la incorporación de más platos de temporada, utilizando ingredientes frescos y locales para ofrecer una experiencia gastronómica única y siempre cambiante.",
        
        "El servicio del restaurante recibió una calificación excelente por parte del 75% de los encuestados, quienes valoraron la amabilidad y la atención del personal. Muchos destacaron que los camareros siempre están dispuestos a hacer recomendaciones y a personalizar los pedidos según las preferencias de los clientes. Un 15% calificó el servicio como bueno, aunque señalaron que en horas punta la atención puede ser más lenta. Algunos sugirieron que el restaurante podría beneficiarse de contratar más personal durante los fines de semana y las horas de mayor afluencia para asegurar que todos los clientes reciban un servicio rápido y eficiente. Un 10% tuvo experiencias mixtas, mencionando ocasionales errores en los pedidos o tiempos de espera prolongados. Un encuestado mencionó que una vez recibió un pedido equivocado, pero que el personal lo corrigió rápidamente y le ofreció un descuento como compensación. En general, la percepción del servicio es muy positiva, destacándose la disposición del personal para solucionar cualquier inconveniente. Algunos clientes también sugirieron que el restaurante podría ofrecer más capacitación a su personal sobre la carta de vinos y cervezas para mejorar la experiencia del cliente.",
        
        "Un 80% de los encuestados recomendaría el restaurante a sus amigos y familiares, citando la buena calidad de la comida y el ambiente agradable como razones principales. Muchos mencionaron que han llevado a amigos y familiares al restaurante y que estos también quedaron muy satisfechos con la experiencia. Un 10% se mostró neutral, mencionando que si bien disfrutan de la experiencia, no es su primera opción para recomendar debido a la competencia en la zona. Algunos señalaron que prefieren otros restaurantes que ofrecen una mayor variedad de platos o que tienen precios más bajos. Un 10% no recomendaría el restaurante, indicando insatisfacción con el precio o la experiencia de servicio en visitas anteriores. Algunos de estos encuestados mencionaron que el restaurante podría beneficiarse de revisar sus precios o de ofrecer más promociones y descuentos para atraer a más clientes. Otros sugirieron que el restaurante debería enfocarse en mejorar la consistencia de su servicio para asegurar que todos los clientes tengan una experiencia positiva en cada visita.",
        
        "Entre las mejoras sugeridas, un 30% de los encuestados pidió una mayor variedad en el menú de bebidas, incluyendo más opciones de cervezas artesanales y cócteles. Algunos mencionaron que les gustaría ver más bebidas temáticas y especiales que cambien regularmente. Un 25% sugirió la incorporación de nuevos postres, destacando que actualmente la oferta es limitada. Muchos mencionaron que les gustaría ver más opciones de postres caseros y de temporada. Un 20% mencionó la necesidad de mejorar el tiempo de espera durante los fines de semana. Algunos clientes sugirieron que el restaurante podría implementar un sistema de reservas en línea para reducir los tiempos de espera y mejorar la experiencia del cliente. Un 15% propuso más promociones y descuentos para clientes frecuentes, mencionando que esto podría incentivarlos a visitar el restaurante con mayor regularidad. El 10% restante ofreció diversas sugerencias, desde mejoras en la decoración hasta la organización de eventos temáticos. Algunos clientes mencionaron que les gustaría ver más noches de música en vivo o eventos especiales como concursos de comida y degustaciones de cervezas artesanales.",
       ];

    llenarFiltros(filtros);
    agregarCardPreguntas(preguntas, resúmenesRespuestas);
    

}

// Función para agregar la tarjeta al documento HTML
function agregarCardPreguntas(preguntas, resúmenes) {
    preguntas.forEach((pregunta, index) => {
        // Crear el elemento div con las clases y contenido especificado
        var nuevaCard = document.createElement("div");
        nuevaCard.className = "shadow card mb-3";  // Añadir clase 'mb-3' para margen inferior de 15px

        // Generar un ID único para el contenido
        var contenidoId = `contenido-${index + 1}`;

        // Crear el contenido interno de la tarjeta con parámetros personalizables
        nuevaCard.innerHTML = `
            <div class="d-flex justify-content-between align-items-center card-header fw-bold">
                <span>${pregunta}</span>
                <button class="btn btn-sm text-white" style="background-color: #414656;" onclick="copiarContenido('${contenidoId}')">
                <i class="fas fa-copy"></i> <!-- Ícono de copiar -->
            </button>
            </div>
            <div id="${contenidoId}" class="card-body">
                <p class="m-0">${resúmenes[index]}</p>
            </div>
        `;
        // Obtener el contenedor donde se desea agregar la nueva tarjeta
        var contenedor = document.getElementById("contentCard_PaginaDetalleDeRespuesta");

        // Agregar la nueva tarjeta al contenedor
        contenedor.appendChild(nuevaCard);
    });
}

function llenarFiltros(filtros) {
    //<a class="dropdown-item" href="#">Third Item</a>
    var dropdown = document.getElementById("dropdoswnMenu");
    for (var i = 0; i < filtros.length; i++) {
        var a = document.createElement("a");
        a.className = "dropdown-item";
        a.href = "#";
        a.innerHTML = filtros[i];
        dropdown.appendChild(a);
    }
}

// Función para copiar el contenido
function copiarContenido(contenidoId) {
    // Obtener el contenido a copiar
    var contenido = document.getElementById(contenidoId).innerText;

    // Crear un elemento temporal para copiar el contenido
    var tempInput = document.createElement("textarea");
    tempInput.value = contenido;
    document.body.appendChild(tempInput);

    // Seleccionar y copiar el contenido
    tempInput.select();
    document.execCommand("copy");

    // Eliminar el elemento temporal
    document.body.removeChild(tempInput);

    // Alertar al usuario que el contenido fue copiado
    alert("Contenido copiado al portapapeles");
}