let filtros = [];
let modules = [];
let studyStatus = 0;


function load(){    // Actualizar el título del estudio desde localStorage
    const studyData = JSON.parse(localStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };
    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;
    
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

    url = 'https://api.cheetah-research.ai/configuration/info_study/' + localStorage.getItem('selectedStudyId');
    //{"status": "success", "studyDate": "2024-08-04T21:07:30.632822-06:00", "studyStatus": 0}
    axios.get(url)
        .then(response => {
            console.log(response.data);
            const data = response.data;
            studyStatus = data.studyStatus;
            if(data.studyStatus == 0){
                document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - No Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - No Activo';
            }else if(data.studyStatus == 1){
                document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - No Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - Activo';
            }else if(data.studyStatus == 2){
                document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - No Activo';
            }else if(data.studyStatus == 3){
                document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - Activo';
            }
        }
        ) 
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });

        //Agregar el event listener para el boton de cambio de estado de los links
        const cambiarEstadoBTN = document.getElementById('StatusBtn_Analisis');
        cambiarEstadoBTN.addEventListener('click', (e) => {
            e.preventDefault();
            if(studyStatus == 0 || studyStatus == 1){
                url = 'https://api.cheetah-research.ai/configuration/activateAnalisis/';
                formData = new FormData();
                formData.append('study_id', localStorage.getItem('selectedStudyId'));
                axios.post(url ,formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - Activo';
                            studyStatus = 3;
                            //reiniciar la pagina
                            alert('El módulo de análisis de datos ha sido activado');
                            location.reload();
                    }
                    )
                    .catch(error => {
                        console.error('Error al enviar los datos:', error);
                    });

                    
            }else if(studyStatus == 3 || studyStatus == 2){ 
                url = 'https://api.cheetah-research.ai/configuration/deactivateAnalisis/';
                formData = new FormData();
                formData.append('study_id', localStorage.getItem('selectedStudyId'));
                axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalAnalisis').innerText = 'Módulo de Análisis de Datos - No Activo';
                            studyStatus = 1;
                            //reiniciar la pagina
                            alert('El módulo de análisis de datos ha sido desactivado');
                            location.reload();
                        
                    }
                    )
                    .catch(error => {
                        console.error('Error al enviar los datos:', error);
                    }
                    );
            }
        });

        const cambiarEstadoBTN2 = document.getElementById('StatusBtn_Recoleccion');
        cambiarEstadoBTN2.addEventListener('click', (e) => {
            e.preventDefault();
            if(studyStatus == 0 || studyStatus == 2){
                url = 'https://api.cheetah-research.ai/configuration/activateCollection/';
                formData = new FormData();
                formData.append('study_id', localStorage.getItem('selectedStudyId'));
                axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - Activo';
                            studyStatus = 2;
                            //reiniciar la pagina
                            alert('El módulo de recolección de datos ha sido activado');
                            location.reload();
                        
                    }
                    )
                    .catch(error => {
                        console.error('Error al enviar los datos:', error);
                    });
            }else if(studyStatus == 3 || studyStatus == 1){ 
                url = 'https://api.cheetah-research.ai/configuration/deactivateCollection/';
                formData = new FormData();
                formData.append('study_id', localStorage.getItem('selectedStudyId'));
                axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalRecoleccion').innerText = 'Módulo de Recolección de Datos - No Activo';
                            studyStatus = 0;
                            //reiniciar la pagina
                            alert('El módulo de recolección de datos ha sido desactivado');
                            location.reload();
                        
                    }
                    )
                    .catch(error => {
                        console.error('Error al enviar los datos:', error);
                    });
            }
        }
        );



    URLOTP = 'https://api.cheetah-research.ai/configuration/api/get-otp/'
    formData = new FormData();
    formData.append('mongo_studio_id', localStorage.getItem('selectedStudyId'));

    //post 
    /*
    {
    "otp": "YWYKKU",
    "expires_at": "2024-11-17T02:57:16.117851Z",
    "used": true
    }
    */ 
    axios.post(URLOTP, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(response => {
            console.log(response.data);
            const data = response.data;
            let estatus = data.otp + " - " + data.expires_at + " - " + data.used;
            document.getElementById('OTP_Analisis').innerText = data.otp;
            
        }
        )
        .catch(error => {
            if(error.response.data.error == 'No valid OTP found for this studio'){
                document.getElementById('OTP_Analisis').innerText = 'OTP no generado';
            }
        });

    URLOTP = 'https://api.cheetah-research.ai/configuration/api/generate-otp/'
    //agregar un event listener para el boton OTPBtn_Analisis para generar el otp
    /*
    {
    "otp": "AN4W1O",
    "expires_at": "2024-11-17T04:11:15.309056Z"
    }
    */

    const OTPBtn_Analisis = document.getElementById('OTPBtn_Analisis');
    OTPBtn_Analisis.addEventListener('click', (e) => {
        e.preventDefault();
        axios.post(URLOTP, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
                console.log(response.data);
                const data = response.data;
                let estatus = data.otp + " - " + data.expires_at;
                document.getElementById('OTP_Analisis').innerText = estatus;
            }
            )
            .catch(error => {
                console.error('Error al enviar los datos:', error);
            });
    }
    );



    



    AgregarFiltros();
    AgregarModulos();

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
            filtroSpan.style.fontFamily = 'IBM Plex Sans';
            filtroItem.appendChild(filtroSpan);

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.innerText = 'Eliminar';
            eliminarBtn.addEventListener('click', () => {
                filtroItem.remove();
                //eliminar el filtro del arreglo
                const index = filtros.indexOf(filtroTxt);
                if (index > -1) {
                    filtros.splice(index, 1);
                }
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

function AgregarFiltros() {
    const url = "https://api.cheetah-research.ai/configuration/get_filters/" + localStorage.getItem('selectedStudyId');
    axios.get(url)
        .then(response => {
            console.log(response.data);
            const data = response.data.filters;
            //ciclar por la data
            data.forEach(filtro => {
                filtros.push(filtro);
                const filtroItem = document.createElement('li');
                filtroItem.classList.add('list-group-item');
                filtroItem.style.display = 'flex';
                filtroItem.style.justifyContent = 'space-between';
                filtroItem.style.alignItems = 'center';

                const filtroSpan = document.createElement('span');
                filtroSpan.innerText = filtro;
                filtroSpan.style.fontFamily = 'IBM Plex Sans';
                filtroItem.appendChild(filtroSpan);

                const eliminarBtn = document.createElement('button');
                eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                eliminarBtn.innerText = 'Eliminar';
                eliminarBtn.addEventListener('click', () => {
                    filtroItem.remove();
                    const index = filtros.indexOf(filtroTxt);
                if (index > -1) {
                    filtros.splice(index, 1);
                }
                });
                filtroItem.appendChild(eliminarBtn);
                filtrosLST.appendChild(filtroItem);
            });

        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}

function AgregarModulos() {
    const url = "https://api.cheetah-research.ai/configuration/get_modules/" + localStorage.getItem('selectedStudyId');
    axios.get(url)
        .then(response => {
            console.log(response.data);
            const data = response.data.modules;

            data.forEach(modulo => {
                modules.push(modulo);
                const moduloItem = document.createElement('li');
                moduloItem.classList.add('list-group-item');
                moduloItem.style.display = 'flex';
                moduloItem.style.justifyContent = 'space-between';
                moduloItem.style.alignItems = 'center';

                const moduloSpan = document.createElement('span');
                moduloSpan.innerText = modulo;
                moduloSpan.style.fontFamily = 'IBM Plex Sans';
                moduloItem.appendChild(moduloSpan);

                const eliminarBtn = document.createElement('button');
                eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                eliminarBtn.innerText = 'Eliminar';
                eliminarBtn.addEventListener('click', () => {
                    moduloItem.remove();
                });
                moduloItem.appendChild(eliminarBtn);

                modulosLST.appendChild(moduloItem);
            });
        })
        .catch(error => {
            console.error('Error al enviar los datos de los modulos :', error);
        });
}

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
        moduloSpan.style.fontFamily = 'IBM Plex Sans';
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
        copiarIcono.style.color = 'var(--bs-CR-orange-2)';

        copiarIcono.addEventListener('click', () => {
            navigator.clipboard.writeText(moduloElement.innerText).then(() => {
                alert(`Contenido copiado: ${moduloElement.innerText}`);
            });
        });

        cardHeader.appendChild(copiarIcono);
    });
};


// Agregar un event listener para el botón de guardar filtros

guardarFitroBTN.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData();
    //que al guardar se cicle por FiltrosLST y se guarde en el arreglo de filtros
    const filtrosLST = document.getElementById('FiltrosLST');
    const filtrosItems = filtrosLST.getElementsByTagName('li');
    filtros = [];
    for (let i = 0; i < filtrosItems.length; i++) {
        const filtroTxt = filtrosItems[i].getElementsByTagName('span')[0].innerText;
        filtros.push(filtroTxt);
    }
    const filtrosString = JSON.stringify(filtros);
    formData.append('filters', filtrosString);

    axios.post('https://api.cheetah-research.ai/configuration/filters/' + localStorage.getItem('selectedStudyId') , formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
            //alert 
            alert('Filtros guardados correctamente');
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}
);

// Agregar un event listener para el botón de guardar módulos
guardarModuloBTN.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData();
    //que al guardar se cicle por el coso de modulos y se guarde en el arreglo de modulos
    const modulosLST = document.getElementById('ModulesLST');
    const modulosItems = modulosLST.getElementsByTagName('li');
    modules = [];
    for (let i = 0; i < modulosItems.length; i++) {
        const moduloTxt = modulosItems[i].getElementsByTagName('span')[0].innerText;
        modules.push(moduloTxt);
    }
    const modulosString = JSON.stringify(modules);
    formData.append('modules', modulosString);

    axios.post('https://api.cheetah-research.ai/configuration/modules/' + localStorage.getItem('selectedStudyId'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
            //alert 
            alert('Módulos guardados correctamente');
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });

});



