document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el título del estudio desde localStorage
    const tituloDelEstudio = localStorage.getItem('tituloDelEstudio');
    if (tituloDelEstudio) {
        document.getElementById('TituloEstudioLBL').innerText = tituloDelEstudio;
    }

    // Manejar el evento del botón de agregar filtro
    const agregarFiltroBtn = document.getElementById('AgregarFiltroBTN');
    const filtrosLST = document.getElementById('FiltrosLST');

    agregarFiltroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const filtroTxt = document.getElementById('FiltrosTXT').value;
        if (filtroTxt) {
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
});
