// agregarCard.js

function initializePage() {
    console.log('Page initialized');
    const study_id = new URLSearchParams(window.location.search).get('id');
    if (study_id) {
        console.log('ID de estudio:', study_id);
        hideOverlay();

        contenido(study_id);
    } else {
        console.error('No se encontró el parámetro id en la URL.');
        //show overlay
        showOverlay();
    }
}

function contenido(study) {
    var div = document.getElementById("contentCard_PaginaOverview");

    formData = new FormData();
    formData.append('filter', 'General');
    formData.append('module', 'general');
    formData.append('sub_module', 'narrative');
    const url = "https://api.cheetah-research.ai/configuration/getSummaries/" + study;
    axios.post(url, formData)
        .then(function (response) {
            var data = response.data;
            const coso = marked(data);      
            div.innerHTML = coso;                      

            console.log(data);
        })
        .catch(function (error) {
            div.innerHTML = "<p>No se encontraron datos para la selección actual.</p>";
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

//Link Desactivado
//poner un cuadrito pequeño con bordes redondeados que diga que el link está desactivado
function linkDesactivado() {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
        <div id="overlayContent" style="
            height: auto;
            background-color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 25px;
            text-align: center;
            text-color: black;
            padding: 20px;
        ">
            <p>Parece que el enlace ya no está disponible. Si necesitas acceder a esta información, no dudes en contactarnos, ¡estamos aquí para ayudarte a resolverlo!</p>
        </div>
    `;

    removeLinks();
}   

function removeLinks() {
    var link = document.getElementById('socrates-link');
    var link2 = document.getElementById('analis-link');
    var link3 = document.getElementById('home-link');
    var link4 = document.getElementById('home-link2');

    // Remueve los atributos href de cada enlace
    link.removeAttribute('href');
    link2.removeAttribute('href');
    link3.removeAttribute('href');
    link4.removeAttribute('href');
}

function verificarLink() {
    //verificar si el link esta activp
    //si esta activo, 
}



function showOverlay() {    
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block'; // Muestra el overlay
    linkDesactivado();
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none'; // Oculta el overlay
}





