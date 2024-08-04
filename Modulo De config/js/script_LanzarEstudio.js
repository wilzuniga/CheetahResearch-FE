let filtros = [];
let modules = [];


function load(){    // Actualizar el título del estudio desde localStorage
    const datos = localStorage.getItem('selectedStudyData');
    console.log(datos);
    if (datos) {
        const estudio = JSON.parse(datos);
        console.log(estudio.summary);

        let coso = estudio.prompt;
        //pasar de markdown a html

        // Insertar el HTML en el div

        document.getElementById('TituloEstudioLBL').innerText = estudio.title;
        document.getElementById('ResumenEstudioLBL').innerText = coso;
    }

    url = 'https://api.cheetah-research.ai/configuration/test/' + localStorage.getItem('selectedStudyId');
    axios.get(url)
        .then(response => {
            console.log(response.data);
            const data = response.data;
                if(data.test){
                    let coso = document.getElementById('test_Switch');
                    coso.checked = true;
                }else{
                    let coso = document.getElementById('test_Switch');
                    coso.checked = false;
                }
        }
        )
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });

    // Manejar el evento del botón de agregar filtro
    const agregarFiltroBtn = document.getElementById('AgregarFiltroBTN');
    const filtrosLST = document.getElementById('FiltrosLST');

    agregarFiltroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const filtroTxt = document.getElementById('FiltrosTXT').value;
        if (filtroTxt) {
            filtros.push(filtroTxt);
            const filtroItem = document.createElement('li');
            filtroItem.classList.add('list-group-item');
            filtroItem.style.display = 'flex';
            filtroItem.style.justifyContent = 'space-between';
            filtroItem.style.alignItems = 'center';

            const filtroSpan = document.createElement('span');
            filtroSpan.innerText = filtroTxt;
            filtroItem.appendChild(filtroSpan);

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.innerText = 'Eliminar';
            eliminarBtn.addEventListener('click', () => {
                filtroItem.remove();
            });
            filtroItem.appendChild(eliminarBtn);

            filtrosLST.appendChild(filtroItem);
            document.getElementById('FiltrosTXT').value = ''; // Limpiar el campo de texto
        }
    });

    // manejar el evento del boton agregar modulo
    const agregarModuloBtn = document.getElementById('AgregarModuloBTN');
const modulosLST = document.getElementById('ModulesLST');
const comboboxModules = document.getElementById('Combobox_Modules');

agregarModuloBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const moduloTxt = comboboxModules.options[comboboxModules.selectedIndex].text;
    if (moduloTxt) {
        modules.push(comboboxModules.options[comboboxModules.selectedIndex].value);
        const moduloItem = document.createElement('li');
        moduloItem.classList.add('list-group-item');
        moduloItem.style.display = 'flex';
        moduloItem.style.justifyContent = 'space-between';
        moduloItem.style.alignItems = 'center';

        const moduloSpan = document.createElement('span');
        moduloSpan.innerText = moduloTxt;
        moduloItem.appendChild(moduloSpan);

        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        eliminarBtn.innerText = 'Eliminar';
        eliminarBtn.addEventListener('click', () => {
            moduloItem.remove();
        });
        moduloItem.appendChild(eliminarBtn);

        modulosLST.appendChild(moduloItem);
    }
});


    // Añadir botones de copiar en las tarjetas de módulos
    const modulos = [
        { id: 'ModuloDeRecoleccionURL', label: 'Modulo de Recolección de Datos' },
        { id: 'ModuloDeAnalisisURL', label: 'Modulo de Análisis de Datos' }
    ];

    modulos.forEach(modulo => {
        const moduloElement = document.getElementById(modulo.id);
        const cardHeader = moduloElement.closest('.card').querySelector('.card-header');

        const copiarIcono = document.createElement('i');
        copiarIcono.classList.add('fa', 'fa-copy');
        copiarIcono.style.cursor = 'pointer';
        copiarIcono.style.marginLeft = '10px';
        copiarIcono.style.color = '#eb7e20';

        copiarIcono.addEventListener('click', () => {
            navigator.clipboard.writeText(moduloElement.innerText).then(() => {
                alert(`Contenido copiado: ${moduloElement.innerText}`);
            });
        });

        cardHeader.appendChild(copiarIcono);
    });
};



/*agregfar un event listwener que al tocar el boton de guardar filtros vacie el arreglo de filtros en la siguinte manera
axios = require('axios');
form = require('form-data');

const filters = ["Genero Masculino", "Genero Femenino"]

const formData = new form();
formData.append('filters', filters);


axios.post('http://localhost:8000/filters/66a3248d3839de61044a2a28', formData,{
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error al enviar los datos:', error);
});

guardarFitroBTN

*/

guardarFitroBTN.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData();
    const filtrosString = JSON.stringify(filtros);
    formData.append('filters', filtrosString);

    axios.post('https://api.cheetah-research.ai/configuration/filters/' + localStorage.getItem('selectedStudyId') , formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}
);

// Agregar un event listener para el botón de guardar módulos
guardarModuloBTN.addEventListener('click', (e) => {
    e.preventDefault();
    const modulesString = JSON.stringify(modules);
    const formData = new FormData();
    formData.append('modules', modulesString);

    axios.post('https://api.cheetah-research.ai/configuration/modules/' + localStorage.getItem('selectedStudyId'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
});



