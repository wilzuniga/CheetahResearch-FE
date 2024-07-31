// agregarCard.js


function content() {
    
    const url = "http://ec2-44-203-206-68.compute-1.amazonaws.com/getSummaries/669ee33ec2af27bcc4720342";

    axios.get(url)
        .then(function (response) {
            // handle success
            console.log(response.data);
            var data = response.data;
            stringresponse= data.general.narrative.General;
            const coso = marked(stringresponse);


            //jsonstring = JSON.stringify(data);
            const htmlString = coso;

            agregarCard("Analisis de Datos, Resumen General", htmlString);
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

    contenido();
}




function contenido() {
    //generaar tarjeta de muestra

    var filtros = [
        "Masculino",
        "Femenino",
        "General"
    ];

    

    llenarFiltros(filtros);

}

// Función para agregar la tarjeta al documento HTML
function agregarCard(textoTitulo, textoParrafo) {
    // Crear el elemento div con las clases y contenido especificado
    var nuevaCard = document.createElement("div");
    nuevaCard.className = "card mb-4";

    // Generar un ID único para el contenido
    var contenidoId = `contenido-${Date.now()}`; // Usar timestamp para un ID único

    // Crear el contenido interno de la tarjeta con parámetros personalizables
    nuevaCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-center card-header fw-bold">
            <h6 class="m-0" style="font-weight: bold; font-size: 35px;">${textoTitulo}</h6>
            <button class="btn btn-sm text-white" style="background-color: #414656;" onclick="copiarContenido('${contenidoId}')">
                <i class="fas fa-copy"></i> <!-- Ícono de copiar -->
            </button>
        </div>
        <div id="${contenidoId}" class="card-body">
            <p class="m-0" style="border-color: var(--bs-emphasis-color); font-size: 16px;">${textoParrafo}</p>
        </div>
    `;

    // Obtener el contenedor donde se desea agregar la nueva tarjeta
    var contenedor = document.getElementById("contentCard_PaginaAnalisiDatos");

    // Agregar la nueva tarjeta al contenedor
    contenedor.appendChild(nuevaCard);
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