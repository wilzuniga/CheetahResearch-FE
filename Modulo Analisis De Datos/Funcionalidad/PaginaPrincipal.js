// agregarCard.js

function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');

    console.log('study_id param ejemplo: ?id=66ac6dfbfc65e4742d415b60');
    console.log('Utilizar Puerto 8080');

    if (study_id) {
        console.log('ID de estudio:', study_id);
        loadInterviewer(study_id);
    } else {
        console.error('No se encontró el parámetro id en la URL.');
    }
}

function contenido() {
    //generaar tarjeta de muestra
    var nombreEstudio = "Estudio sobre la Eficiencia Energética en Edificios";
    var resumen = "Este estudio analiza la eficiencia energética en edificios modernos, destacando las prácticas y tecnologías más efectivas.";

    var filtros = [
        "Iluminación LED",
        "HVAC",
        "Materiales aislantes"
    ];
    
    var titulosConclusiones = [
        "Impacto de la iluminación LED",
        "Optimización del sistema HVAC",
        "Uso de materiales aislantes",
        "Eficiencia de las ventanas",
        "Monitorización y control energético",
        "Impacto del diseño arquitectónico"
    ];
    
    var conclusiones = [
        "La implementación de iluminación LED redujo el consumo energético en un 30%.",
        "La optimización del sistema HVAC mejoró la eficiencia térmica del edificio en un 25%.",
        "El uso de materiales aislantes redujo las pérdidas de calor en un 20% durante el invierno.",
        "Las ventanas de doble cristal con tratamiento bajo emisivo redujeron la transferencia de calor en un 15%.",
        "La monitorización y control energético permitió ajustes finos que mejoraron la eficiencia global del edificio.",
        "El diseño arquitectónico integrado con elementos pasivos mejoró la iluminación natural y redujo la carga térmica."
    ];
    

    agregarEstudio(nombreEstudio, resumen, titulosConclusiones, conclusiones);

    llenarFiltros(filtros);
}

// agregarEstudio.js

// Función para agregar el elemento del estudio al documento HTML con parámetros personalizables
function agregarEstudio(nombreEstudio, resumen, titulosConclusiones, conclusiones) {
    // Crear el elemento div con las clases y contenido especificado
    var nuevoEstudio = document.createElement("div");
    nuevoEstudio.className = "container text-white border rounded border-0 p-4 p-lg-5 py-4 py-xl-5";
    nuevoEstudio.style.backgroundColor = "#eb7e20"; // Añadir el color de fondo

    // Crear el contenido interno del estudio con parámetros personalizables
    nuevoEstudio.innerHTML = `
        <div class="row mb-5">
            <div class="col-md-8 col-xl-6 text-center mx-auto">
                <h2 class="text-white">${nombreEstudio}</h2>
                <p class="w-lg-50">${resumen}</p>
            </div>
        </div>
        <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-xl-3">
            ${generarConclusionesHTML(titulosConclusiones, conclusiones)}
        </div>
    `;

    // Obtener el contenedor donde se desea agregar el nuevo estudio
    var contenedor = document.getElementById("contentCard_PaginaOverview");

    // Agregar el nuevo estudio al contenedor
    contenedor.appendChild(nuevoEstudio);
}

// Función auxiliar para generar el HTML de las conclusiones
function generarConclusionesHTML(titulos, textos) {
    var html = '';
    for (var i = 0; i < titulos.length; i++) {
        html += `
            <div class="col">
                <div class="d-flex">
                    <div class="bs-icon-sm bs-icon-rounded bs-icon-semi-white text-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon">
                        <svg class="bi bi-dot" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"></path>
                        </svg>
                    </div>
                    <div class="px-3">
                        <h4 class="text-white">${titulos[i]}</h4>
                        <p>${textos[i]}</p>
                    </div>
                </div>
            </div>
        `;
    }
    return html;
}

function llenarFiltros(filtros) {
    //<a class="dropdown-item" href="#">Third Item</a>
    var dropdown = document.getElementById("dropdownMenu");
    for (var i = 0; i < filtros.length; i++) {
        var a = document.createElement("a");
        a.className = "dropdown-item";
        a.href = "#";
        a.innerHTML = filtros[i];
        dropdown.appendChild(a);
    }
}
