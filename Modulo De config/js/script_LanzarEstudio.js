let filtros = [];
let modules = [];
let dominios = [];
let preguntas = [];
let studyStatus = 0;
let isKioskoMode = false;
let formData = new FormData();  



function load(){    // Actualizar el título del estudio desde sessionStorage
    //Idioma
    const lang = sessionStorage.getItem('language') || 'es';
    setLanguage(lang);
    
    const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
    const selectedStudyData = {
        tituloDelEstudio: studyData.title,
        mercadoObjetivo: studyData.marketTarget,
        objetivosDelEstudio: studyData.studyObjectives,
        Resumen: studyData.prompt,
    };
    document.getElementById('nombreProyectoLbl').innerText = selectedStudyData.tituloDelEstudio;
    
    const datos = sessionStorage.getItem('selectedStudyData');
    // console.log(datos);

    const studyId = sessionStorage.getItem('selectedStudyId');
    setColorsFromAPI(studyId);//Setea colores

    url = 'https://api.cheetah-research.ai/configuration/info_study/' + sessionStorage.getItem('selectedStudyId');
    //{"status": "success", "studyDate": "2024-08-04T21:07:30.632822-06:00", "studyStatus": 0}
    axios.get(url)
        .then(response => {
            // console.log(response.data);
            const data = response.data;
            studyStatus = data.studyStatus;
            
            // Actualizar estado de los módulos
            if(data.studyStatus == 0){
                document.getElementById('HeaderPrincipalAnalisis').innerHTML = '<i class="fas fa-chart-bar"></i> Módulo de Análisis de Datos - No Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerHTML = '<i class="fas fa-database"></i> Modulo de Recolección de Datos - No Activo';
            }else if(data.studyStatus == 1){
                document.getElementById('HeaderPrincipalAnalisis').innerHTML = '<i class="fas fa-chart-bar"></i> Módulo de Análisis de Datos - No Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerHTML = '<i class="fas fa-database"></i> Modulo de Recolección de Datos - Activo';
            }else if(data.studyStatus == 2){
                document.getElementById('HeaderPrincipalAnalisis').innerHTML = '<i class="fas fa-chart-bar"></i> Módulo de Análisis de Datos - Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerHTML = '<i class="fas fa-database"></i> Modulo de Recolección de Datos - No Activo';
            }else if(data.studyStatus == 3){
                document.getElementById('HeaderPrincipalAnalisis').innerHTML = '<i class="fas fa-chart-bar"></i> Módulo de Análisis de Datos - Activo';
                document.getElementById('HeaderPrincipalRecoleccion').innerHTML = '<i class="fas fa-database"></i> Modulo de Recolección de Datos - Activo';
            }
            
            // Actualizar estado del Modo Kiosko
            isKioskoMode = data.isKiosk === true;
            updateKioskoUI(isKioskoMode);
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
                formData.append('study_id', sessionStorage.getItem('selectedStudyId'));
                axios.post(url ,formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        // console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalAnalisis').innerHTML = '<i class="fas fa-chart-bar"></i> Módulo de Análisis de Datos - Activo';
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
                formData.append('study_id', sessionStorage.getItem('selectedStudyId'));
                axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        // console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalAnalisis').innerHTML = '<i class="fas fa-chart-bar"></i> Módulo de Análisis de Datos - No Activo';
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
                formData.append('study_id', sessionStorage.getItem('selectedStudyId'));
                axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        // console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalRecoleccion').innerHTML = '<i class="fas fa-database"></i> Modulo de Recolección de Datos - Activo';
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
                formData.append('study_id', sessionStorage.getItem('selectedStudyId'));
                axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(response => {
                        // console.log(response.data);
                        const data = response.data;
                            document.getElementById('HeaderPrincipalRecoleccion').innerHTML = '<i class="fas fa-database"></i> Modulo de Recolección de Datos - No Activo';
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
    formData.append('mongo_studio_id', sessionStorage.getItem('selectedStudyId'));

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
            // console.log(response.data);
            const data = response.data;
            let estatus = data.otp + "      - " + data.expires_at + " - " + data.used;
            document.getElementById('OTP_Analisis').innerText = estatus;
            
        }
        )
        .catch(error => {
            if(error.response.data.error == 'No valid OTP found for this studio'){
                document.getElementById('OTP_Analisis').innerText = 'OTP no generado';
            }
        });

    URLOTP = 'https://api.cheetah-research.ai/configuration/api/generate_otp_from_platform/'
    let formDataa = new FormData();
    formDataa.append('mongo_studio_id', sessionStorage.getItem('selectedStudyId'));
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
        axios.post(URLOTP, formDataa, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
                // console.log(response.data);
                const data = response.data;
                let estatus = data.otp + "      - " + data.expires_at;
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
    AgregarDominios();
    AgregarPreguntas()

    //Manejar el evento del boton de agregar Preguntas
    const AgregarPreguntaBtn = document.getElementById('AgregarPreguntaBTN');
    const PreguntasLST = document.getElementById('PreguntasLST');
    
    AgregarPreguntaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const preguntaTxt = document.getElementById('PreguntasTXT').value;
        if (preguntaTxt) {
            preguntas.push(preguntaTxt);
            const preguntaItem = document.createElement('li');
            preguntaItem.classList.add('list-group-item');
            preguntaItem.style.display = 'flex';
            preguntaItem.style.justifyContent = 'space-between';
            preguntaItem.style.alignItems = 'center';

            const preguntaSpan = document.createElement('span');
            preguntaSpan.innerText = preguntaTxt;
            preguntaSpan.style.fontFamily = 'IBM Plex Sans';
            preguntaItem.appendChild(preguntaSpan);

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
            eliminarBtn.addEventListener('click', () => {
                preguntaItem.remove();
                //eliminar el filtro del arreglo
                const index = preguntas.indexOf(preguntaTxt);
                if (index > -1) {
                    preguntas.splice(index, 1);
                }
            });
            preguntaItem.appendChild(eliminarBtn);

            PreguntasLST.appendChild(preguntaItem);
            document.getElementById('PreguntasTXT').value = ''; // Limpiar el campo de texto
        }
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
            filtroSpan.style.fontFamily = 'IBM Plex Sans';
            filtroItem.appendChild(filtroSpan);

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
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

    const agregarDominioBtn = document.getElementById('AgregarDominioBTN');
    const dominiosLST = document.getElementById('DominiosLST');

    agregarDominioBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let dominioTxt = document.getElementById('DominiosTXT').value;
        //eliminar caracter @ de dominioTXT
        dominioTxt = dominioTxt.replace('@', '');

        if (dominioTxt && !dominios.includes("@")) {
            dominios.push(dominioTxt);
            const dominioItem = document.createElement('li');
            dominioItem.classList.add('list-group-item');
            dominioItem.style.display = 'flex';
            dominioItem.style.justifyContent = 'space-between';
            dominioItem.style.alignItems = 'center';

            const dominioSpan = document.createElement('span');
            dominioSpan.innerText = dominioTxt;
            dominioSpan.style.fontFamily = 'IBM Plex Sans';
            dominioItem.appendChild(dominioSpan);

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
            eliminarBtn.addEventListener('click', () => {
                dominioItem.remove();
                //eliminar el filtro del arreglo
                const index = dominios.indexOf(dominioTxt);
                if (index > -1) {
                    dominios.splice(index, 1);
                }

                eliminarDominio(dominioTxt);
            });
            dominioItem.appendChild(eliminarBtn);

            dominiosLST.appendChild(dominioItem);
            document.getElementById('DominiosTXT').value = ''; // Limpiar el campo de texto
        }else{
            alert('Dominio invalido, recuerda que no debe contener el caracter "@"');
        }
    });


    // manejar el evento del boton agregar modulo
    const agregarModuloBtn = document.getElementById('AgregarModuloBTN');
    const modulosLST = document.getElementById('ModulesLST');
    const comboboxModules = document.getElementById('Combobox_Modules');

function AgregarFiltros() {
    const url = "https://api.cheetah-research.ai/configuration/get_filters/" + sessionStorage.getItem('selectedStudyId');
    axios.get(url)
        .then(response => {
            // console.log(response.data);
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
                eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
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

//Agrefar Preguntas  
function AgregarPreguntas() {
    const url = "https://api.cheetah-research.ai/configuration/get_questions/" + sessionStorage.getItem('selectedStudyId');
    axios.get(url)
        .then(response => {
            // console.log(response.data);
            const data = response.data.suggested_questions;
            //ciclar por la data
            data.forEach(pregunta => {
                preguntas.push(pregunta);
                const preguntaItem = document.createElement('li');
                preguntaItem.classList.add('list-group-item');
                preguntaItem.style.display = 'flex';
                preguntaItem.style.justifyContent = 'space-between';
                preguntaItem.style.alignItems = 'center';
                
                const preguntaSpan = document.createElement('span');
                preguntaSpan.innerText = pregunta;
                preguntaSpan.style.fontFamily = 'IBM Plex Sans';
                preguntaItem.appendChild(preguntaSpan);

                const eliminarBtn = document.createElement('button');
                eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
                eliminarBtn.addEventListener('click', () => {
                    preguntaItem.remove();
                    const index = preguntas.indexOf(preguntaTxt);
                    if (index > -1) {
                        preguntas.splice(index, 1);
                    }
                });
                preguntaItem.appendChild(eliminarBtn);
                PreguntasLST.appendChild(preguntaItem);
            });

        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}


function eliminarDominio(dominio) {
    const studyId = sessionStorage.getItem('selectedStudyId');
    const formData = new FormData();
    formData.append('study_id', studyId);
    formData.append('domain', dominio);

    axios.delete("https://api.cheetah-research.ai/configuration/api/delete-domain/", {
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
            // console.log('Dominio eliminado correctamente:', response.data);
            alert('Dominio eliminado correctamente');
        })
        .catch(error => {
            console.error('Error al eliminar el dominio:', error);
            alert('Ocurrió un error al eliminar el dominio. Revisa la consola para más detalles.');
        });
}




function AgregarDominios() {
    const url = "https://api.cheetah-research.ai/configuration/api/get-list-domains/"

    formData = new FormData();
    formData.append('study_id', sessionStorage.getItem('selectedStudyId'));


    axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }
    )
        .then(response => {
            // console.log(response.data);
            const data = response.data.domains;
            //ciclar por la data
            data.forEach(dominio => {
                dominios.push(dominio);
                const dominioItem = document.createElement('li');
                dominioItem.classList.add('list-group-item');
                dominioItem.style.display = 'flex';
                dominioItem.style.justifyContent = 'space-between';
                dominioItem.style.alignItems = 'center';

                const dominioSpan = document.createElement('span');
                dominioSpan.innerText = dominio;
                const dominioTxt = dominio;  
                dominioSpan.style.fontFamily = 'IBM Plex Sans';
                dominioItem.appendChild(dominioSpan);

                const eliminarBtn = document.createElement('button');
                eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
                eliminarBtn.addEventListener('click', () => {
                    dominioItem.remove();
                    const index = dominios.indexOf(dominioTxt);
                    if (index > -1) {
                        dominios.splice(index, 1);  
                    }
                    eliminarDominio(dominioTxt);  
                });
                
                dominioItem.appendChild(eliminarBtn);
                dominiosLST.appendChild(dominioItem);
            });

        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}

function AgregarModulos() {
    const url = "https://api.cheetah-research.ai/configuration/get_modules/" + sessionStorage.getItem('selectedStudyId');
    axios.get(url)
        .then(response => {
            // console.log(response.data);
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
                eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
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
        eliminarBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
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

    axios.post('https://api.cheetah-research.ai/configuration/filters/' + sessionStorage.getItem('selectedStudyId') , formData, {
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

guardarPreguntaBTN.addEventListener('click', (e) => {
    e.preventDefault();

    const preguntasLST = document.getElementById('PreguntasLST');
    const preguntasItems = preguntasLST.getElementsByTagName('li');
    let preguntas = [];

    for (let i = 0; i < preguntasItems.length; i++) {
        const preguntaTxt = preguntasItems[i].getElementsByTagName('span')[0].innerText;
        preguntas.push(preguntaTxt);
    }

    const data = {
        suggested_questions: preguntas
    };

    axios.post(
        `https://api.cheetah-research.ai/configuration/suggested_questions/${sessionStorage.getItem('selectedStudyId')}`,
        data,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    .then(response => {
        alert('Preguntas guardadas correctamente');
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });
});


guardarDominioBTN.addEventListener('click', (e) => {
    e.preventDefault();
    const dominiosLST = document.getElementById('DominiosLST');
    const dominiosItems = dominiosLST.getElementsByTagName('li');
    const dominios = [];

    for (let i = 0; i < dominiosItems.length; i++) {
        const dominioTxt = dominiosItems[i].getElementsByTagName('span')[0].innerText;
        dominios.push(dominioTxt);
    }

    // Ciclar los dominios y enviarlos uno por uno
    const studyId = sessionStorage.getItem('selectedStudyId');
    const apiUrl = `https://api.cheetah-research.ai/configuration/api/add-domain/`;
    const enviarDominio = (dominio) => {
        const formData = new FormData();
        formData.append('study_id', studyId);
        formData.append('domain', dominio);

        return axios.post(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    };

    // Enviar cada dominio individualmente
    const requests = dominios.map(enviarDominio);

    Promise.all(requests)
        .then(() => {
            alert('Todos los dominios se han guardado correctamente');
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            alert('Ocurrió un error al guardar los dominios. Revisa la consola para más detalles.');
        });
});


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

    axios.post('https://api.cheetah-research.ai/configuration/modules/' + sessionStorage.getItem('selectedStudyId'), formData, {
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

//Colores
function setColorsFromAPI(studyId) {
    const url = 'https://api.cheetah-research.ai/configuration/info_study/' + studyId;
    return axios.get(url)
        .then(response => {
            const colors = {
                color1: response.data.primary_color,
                color2: response.data.secondary_color
            };

            applyColors(colors);

            return colors;
        })
        .catch(error => {
            console.error('Error capturando colores desde API:', error);
            return { color1: null, color2: null };
        });
}

function applyColors(colors) {//Colors es un array
    if (colors.color1) {
        document.documentElement.style.setProperty('--bs-CR-orange', colors.color1);

        document.documentElement.style.setProperty('--bs-CR-orange-2', brightColorVariant(colors.color1));
    }
    if (colors.color2) {
        document.documentElement.style.setProperty('--bs-CR-gray', colors.color2);

        document.documentElement.style.setProperty('--bs-CR-gray-dark', darkColorVariant(colors.color2));
    }
}
function darkColorVariant (color) {
    return adjustColor(color, -10);
}
function brightColorVariant (color) {
    return adjustColor(color, 10);
}
function adjustColor(color, percent) {//Funcion loca de chatsito
    const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16).slice(1).toUpperCase()}`;
}

// ============ MODO KIOSKO ============

// Función para actualizar la UI del estado del Modo Kiosko
function updateKioskoUI(isActive) {
    const statusElement = document.getElementById('KioskoStatus');
    
    if (isActive) {
        statusElement.innerHTML = '<i class="fas fa-circle" style="font-size: 8px;"></i> Activo';
        statusElement.style.background = '#d4edda';
        statusElement.style.color = '#155724';
        statusElement.style.border = '1px solid #c3e6cb';
    } else {
        statusElement.innerHTML = '<i class="fas fa-circle" style="font-size: 8px;"></i> Inactivo';
        statusElement.style.background = '#f8d7da';
        statusElement.style.color = '#721c24';
        statusElement.style.border = '1px solid #f5c6cb';
    }
}

// Event Listener para el botón de información del Modo Kiosko
document.addEventListener('DOMContentLoaded', function() {
    const infoKioskoBtn = document.getElementById('InfoKioskoBtn');
    const statusKioskoBtn = document.getElementById('StatusBtn_Kiosko');
    
    // Botón de información
    if (infoKioskoBtn) {
        infoKioskoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showKioskoInfoOverlay();
        });
    }
    
    // Botón de cambiar estado
    if (statusKioskoBtn) {
        statusKioskoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleKioskoMode();
        });
    }
});

// Función para mostrar el overlay de información del Modo Kiosko
function showKioskoInfoOverlay() {
    const overlay = document.getElementById('overlay');
    
    overlay.innerHTML = `
        <div id="overlayContent" style="max-width: 600px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <i class="fas fa-desktop" style="font-size: 60px; color: var(--bs-CR-orange);"></i>
                <h3 style="font-family: hedliner; color: var(--bs-CR-black-dark); margin-top: 15px; margin-bottom: 10px;">
                    Modo Kiosko
                </h3>
            </div>
            
            <div style="font-family: IBM Plex Sans; color: #495057; line-height: 1.6; text-align: left;">
                <h5 style="font-family: hedliner; color: var(--bs-CR-black-dark); margin-bottom: 15px;">
                    <i class="fas fa-question-circle" style="color: var(--bs-CR-orange);"></i>
                    ¿Qué es el Modo Kiosko?
                </h5>
                <p style="margin-bottom: 20px;">
                    El <strong>Modo Kiosko</strong> es una configuración especial que permite que la encuesta se realice 
                    múltiples veces desde el mismo dispositivo sin restricciones.
                </p>
                
                <h5 style="font-family: hedliner; color: var(--bs-CR-black-dark); margin-bottom: 15px;">
                    <i class="fas fa-check-circle" style="color: #28a745;"></i>
                    Cuándo usar el Modo Kiosko:
                </h5>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">
                        <strong>Eventos presenciales:</strong> Cuando tienes un dispositivo compartido en ferias, 
                        conferencias o puntos de venta.
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Encuestas en punto de venta:</strong> Para recopilar feedback inmediato de múltiples 
                        clientes desde un mismo dispositivo.
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Tablets compartidas:</strong> Ideal para entrevistas cara a cara donde el encuestador 
                        usa el mismo dispositivo con diferentes personas.
                    </li>
                </ul>
                
                <h5 style="font-family: hedliner; color: var(--bs-CR-black-dark); margin-bottom: 15px;">
                    <i class="fas fa-times-circle" style="color: #dc3545;"></i>
                    Cuándo NO usar el Modo Kiosko:
                </h5>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">
                        <strong>Encuestas online remotas:</strong> Cuando los participantes responden desde sus propios 
                        dispositivos personales.
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Control de duplicados:</strong> Si necesitas evitar que una persona responda varias 
                        veces (en este caso, déjalo desactivado).
                    </li>
                </ul>
                
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
                    <strong style="color: #856404;">
                        <i class="fas fa-exclamation-triangle"></i> Importante:
                    </strong>
                    <p style="margin: 8px 0 0 0; color: #856404;">
                        Con el Modo Kiosko <strong>desactivado</strong>, cada dispositivo solo podrá responder la 
                        encuesta una vez cada 2 días. Esto ayuda a prevenir respuestas duplicadas.
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
                <button id="closeKioskoBtn" class="btn btn-primary" style="font-family: hedliner; padding: 12px 30px;">
                    <i class="fas fa-check"></i>
                    Entendido
                </button>
            </div>
        </div>
    `;
    
    overlay.style.display = 'flex';
    
    // Agregar event listener al botón de cerrar después de crear el contenido
    const closeBtn = document.getElementById('closeKioskoBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeKioskoOverlay);
    }
    
    // También permitir cerrar haciendo clic fuera del contenido
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeKioskoOverlay();
        }
    });
}

// Función para cerrar el overlay
function closeKioskoOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Función para cambiar el estado del Modo Kiosko
function toggleKioskoMode() {
    const studyId = sessionStorage.getItem('selectedStudyId');
    const newKioskoState = !isKioskoMode;
    
    const confirmMessage = newKioskoState
        ? '¿Está seguro de que desea ACTIVAR el Modo Kiosko?\n\nEsto permitirá que múltiples personas respondan la encuesta desde el mismo dispositivo sin restricciones.'
        : '¿Está seguro de que desea DESACTIVAR el Modo Kiosko?.';
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    const url = `https://api.cheetah-research.ai/configuration/updateKiosk/${studyId}`;
    
    axios.post(url, {
        isKiosk: newKioskoState
    }, {
        headers: {
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.status === 'success') {
            isKioskoMode = newKioskoState;
            updateKioskoUI(isKioskoMode);
            
            const successMessage = isKioskoMode
                ? 'El Modo Kiosko ha sido ACTIVADO exitosamente.\n\nAhora múltiples personas pueden responder desde el mismo dispositivo.'
                : 'El Modo Kiosko ha sido DESACTIVADO exitosamente.\n\nCada dispositivo ahora está limitado a una respuesta cada 2 días.';
            
            alert(successMessage);
        } else {
            alert('Error al cambiar el estado del Modo Kiosko. Por favor, intente nuevamente.');
        }
    })
    .catch(error => {
        console.error('Error al cambiar el estado del Modo Kiosko:', error);
        
        let errorMessage = 'Error al cambiar el estado del Modo Kiosko.';
        
        if (error.response) {
            if (error.response.status === 403) {
                errorMessage = 'No tiene permisos para modificar este estudio.';
            } else if (error.response.status === 404) {
                errorMessage = 'Estudio no encontrado.';
            } else if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        }
        
        alert(errorMessage);
    });
}

