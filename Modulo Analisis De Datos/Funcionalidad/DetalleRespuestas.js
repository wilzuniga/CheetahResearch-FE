// agregarCard.js

function content() {
    
    const url = "http://ec2-44-203-206-68.compute-1.amazonaws.com/getSummaries/669ee33ec2af27bcc4720342";

    axios.get(url)
        .then(function (response) {
            // handle success
            console.log(response.data);
            var data = response.data.Questions;
            procesarPreguntas(data);
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
}

function procesarPreguntas(data) {
    for (let section in data) {
        var nuevaCard = document.createElement("div");
        nuevaCard.className = "shadow card mb-3";  // Añadir clase 'mb-3' para margen inferior de 15px
        nuevaCard.innerHTML = `
            <div class="d-flex justify-content-between align-items-center card-header fw-bold" >
                <h1>${section}</h1>
            </div>
        `;

        nuevaCard.className = "shadow card mb-3";  // Añadir clase 'mb-3' para margen inferior de 15px
        nuevaCard.style.border = "3px solid #007bff"; // Cambia el color del borde y el grosor
        nuevaCard.style.backgroundColor = "#f8f9fa"; // Cambia el color de fondo
        
        var contenedor = document.getElementById("contentCard_PaginaDetalleDeRespuesta");

        // Agregar la nueva tarjeta al contenedor
        contenedor.appendChild(nuevaCard);
      for (let category in data[section]) {
        var nuevaCard2 = document.createElement("div");
        nuevaCard2.className = "shadow card mb-3";  // Añadir clase 'mb-3' para margen inferior de 15px
        nuevaCard2.innerHTML = `
            <div class="d-flex justify-content-between align-items-center card-header fw-bold" >
                <h3>${category}</h3>
            </div>
        `;

        nuevaCard2.className = "shadow card mb-3";  // Añadir clase 'mb-3' para margen inferior de 15px
        nuevaCard2.style.border = "3px solid #007bff"; // Cambia el color del borde y el grosor
        nuevaCard2.style.backgroundColor = "#f8f9fa"; // Cambia el color de fondo
        
        var contenedor2 = document.getElementById("contentCard_PaginaDetalleDeRespuesta");
        contenedor2.appendChild(nuevaCard2);


        const preguntas = data[section][category].map(item => item.question);
        const resúmenes = data[section][category].map(item => JSON.stringify(item.summary));
        agregarCardPreguntas(preguntas, resúmenes);
      }
      
    }
  }

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



function contenido() {
    //generaar tarjeta de muestra

    var filtros = [
        "Masculino",
        "Femenino",
        "General"
    ];

    

    llenarFiltros(filtros);

    content();
    

}

// Función para agregar la tarjeta al documento HTML


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