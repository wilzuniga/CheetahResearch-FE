// bt: button
// h: header
// a: anchor
// in: input
// out: output

const translations = {
    es: {
        brand: "Cheetah Research",
        registered: "es una marca registrada de",
        company: "Marketing Total S.A.",
        rights: "Todos los derechos reservados.",
        navbar: {
            create_study: "CREACION DE ESTUDIO",
            pollster: "ENCUESTADOR",
            survey: "ENCUESTA",
            launch_study: "LANZAR ESTUDIO",
            study_info: "INFORMACION DE ESTUDIO",
            results: "VISUALIZACION DE RESULTADOS",
            admin_tools: "HERRAMIENTAS DEL ADMINISTRADOR"
        },
        PaginaPrincipal: {
            title: "Seleccionar Estudio",
            searchBar: "Buscar Estudio",
            btCreate: "Crear Estudio",
            btLogOff: "Cerrar Sesión"
        },
        CreacionDeEstudio: {
            title: "Creación de Estudio",               summaryTitle: "Resumen del Estudio",
            hStudyTitle: "Titulo del Estudio",          inStudyTitle: "Titulo",
            hTargetAudience: "Mercado Objetivo",        inTargetAudience: "Mercado Objetivo",
            hStudyObjectives: "Objetivos del Estudio",  inStudyObjectives: "Objetivos generales del estudio, separados por comas (\",\")",
            hPrompt: "Prompt del Estudio",              inPrompt: "Ingresa el prompt general de la encuesta",
            color1: "Color Principal del Estudio",      color2: "Color Secundario del Estudio",
            btSaveColors: "Guardar Colores",            btDefaultColors: "Colores Predefinidos",
            btCreate: "Crear Estudio",                  btUpdate: "Actualizar Estudio",
        },
        CrearEncuestador: {
            title: "Encuestador",                       createTitle: "Crear Encuestador",
            hImg: "",                                   selectImg: "Seleccionar Imagen",
            hInterviewerName: "Nombre del Encuestador", inInterviewerName: "Ingresa el Nombre del encuestador",
            hTone: "Tono Encuestador",                  inTone: "Ingresa el tono en el cual hablará el encuestador",
            hObservations: "Observaciones Importantes", inObservations: "Observaciones Importantes para el encuestador",
            hGreeting: "Saludo",                        inGreeting: "Ingresa el saludo del encuestador",
            btCreate: "Crear Encuestador",              btUpdate: "Actualizar Encuestador",
        },
        Encuesta: {
            title: "Crear Encuesta",
            hQuestion: "Pregunta",                      inQuestion: "Ingresa tu pregunta",                   inWeight: "Ingresa el peso",
            hAttachment: "Archivo",
            btAddQuestion: "Agregar Pregunta",
            btDelQuestion: "Eliminar",                  btAddSubQuestion: "Agregar Pregunta de Seguimiento", btEdtQuestion: "Editar",       btDelSubQuestion: "Eliminar Preguntas de Seguimiento",
            inAddSubQuestion: "Ingresa tu Pregunta de Seguimiento", btSaveSubQuestion: "Agregar Pregunta",   btCloseSubQuestion: "Cerrar",
            //Poner los de arriba en Editar Pregunta
            btSaveQuestionEdit: "Guardar",              btCloseQuestionEdit: "Cerrar",
            btSaveSurvey: "Guardar Encuesta"
            //Falta el html en JS
        },
        LanzarEstudio: {
            title: "Lanzar Estudio",                    hStudyTitle: "Titulo del Estudio",//Verificar que no sobreponga titulo actual
            btAdd: "Agregar",                           btSave: "Guardar",
            hFilters: "Filtros",                        inFilters: "Agrega filtros para el Módulo de Análisis",
            hDomains: "Dominios Autorizados",
            hDeployConfig: "Configurar Despliegue de analisis de datos",
            //Modulos en ComboBox
            modGeneral: "Módulo de Análisis General",
            modAnalysis: "Módulo de Análisis Individual",
            modPsicographic: "Módulo de Análisis Psicográficos",
            modUserPersona: "Módulo de User Personas",
            modCustomerExperience: "Módulo Customer Experience",
            modCustomerSatisfaction: "Módulo NPS y Satisfacción",
            modBrandStatus: "Módulo Brand Status",
            modClimaLaboral: "Módulo Clima Laboral",

            hSuggQuestion: "Preguntas Sugeridas",       inSuggQuestion: "Agrega preguntas sugeridas para Sócrates",
            hRecollectionModule: "Módulo de Recolección de Datos", aRecollectionModule: "RecoleccionDeDatos.com",
            hAnalysisModule: "Módulo de Recolección de Datos",  aAnalysisModule: "AnalisisDeDatos.com",
            btChangeState: "Cambiar Estado",            btOTP: "Generar OTP",
            btLaunch: "Lanzar Estudio"
        },
        InformacionDelEstudio: {
            title: "Transcripción de Encuestas",
            hSurveyCount: "Encuestas Aplicadas:",
            btTranscriptions: "Descargar Transcripciones",
            btNonProcessedTranscriptions: "Descargar Transcripciones No Procesadas",
            btLogOTP: "Descargar Log de OTP",
            btDelFiles: "Eliminar Archivos",
        }
    },

    en: {
        brand: "Cheetah Research",
        registered: "is a registered trademark of",
        company: "Marketing Total S.A.",
        rights: "All rights reserved.",
        navbar: {
            create_study: "CREATE STUDY",
            pollster: "INTERVIEWER",
            survey: "SURVEY",
            launch_study: "LAUNCH STUDY",
            study_info: "STUDY INFO",
            results: "RESULTS VIEW",
            admin_tools: "ADMIN TOOLS"
        },
        PaginaPrincipal: {
            title: "Select Study",
            searchBar: "Search Study",
            btCreate: "Create Study",
            btLogOff: "Log Off"
        },
        CreacionDeEstudio: {
            title: "Create Study",                      summaryTitle: "Create Study",
            hStudyTitle: "Study Title",                 inStudyTitle: "Title",
            hTargetAudience: "Target Audience",         inTargetAudience: "Target Audience",
            hStudyObjectives: "Study Objectives",       inStudyObjectives: "General objectives of the study, separated by commas (\",\")",
            hPrompt: "Study Prompt",                    inPrompt: "Enter the general prompt of the survey",
            color1: "Primary Color of the Study",       color2: "Secondary Color of the Study",
            btSaveColors: "Save Colors",                btDefaultColors: "Default Colors",
            btCreate: "Create Study",                   btUpdate: "Update Study",
        },
        LanzarEstudio: {
            title: "Launch Study",                      hStudyTitle: "Study Title",
            btAdd: "Add",                               btSave: "Save",
            hFilters: "Filters",                        inFilters: "Add filters for the Analysis Module",
            hDomains: "Authorized Domains",
            hDeployConfig: "Configure Data Analysis Deployment",
            //Modulos en ComboBox
            modGeneral: "General Analysis Module",
            modAnalysis: "Individual Analysis Module",
            modPsicographic: "Psychographic Analysis Module",
            modUserPersona: "User Personas Module",
            modCustomerExperience: "Customer Experience Module",
            modCustomerSatisfaction: "NPS and Satisfaction Module",
            modBrandStatus: "Brand Status Module",
            modClimaLaboral: "Work Environment Module",

            hSuggQuestion: "Suggested Questions",       inSuggQuestion: "Add suggested questions for Socrates",
            hRecollectionModule: "Data Collection Module", aRecollectionModule: "DataCollection.com",
            hAnalysisModule: "Data Analysis Module",    aAnalysisModule: "DataAnalysis.com",
            btChangeState: "Change State",              btOTP: "Generate OTP",
            btLaunch: "Launch Study"
        },
        InformacionDelEstudio: {
            title: "Survey Transcriptions",
            hSurveyCount: "Surveys Applied:",
            btTranscriptions: "Download Transcriptions",
            btNonProcessedTranscriptions: "Download Non-Processed Transcriptions",
            btLogOTP: "Download OTP Log",
            btDelFiles: "Delete Files",
        }
    },

    pt: {
        brand: "Cheetah Research",
        registered: "é uma marca registrada de",
        company: "Marketing Total S.A.",
        rights: "Todos os direitos reservados.",
        navbar: {
            create_study: "CRIAÇÃO DE ESTUDO",
            pollster: "ENTREVISTADOR",
            survey: "PESQUISA",
            launch_study: "LANÇAR ESTUDO",
            study_info: "INFORMAÇÕES DO ESTUDO",
            results: "VISUALIZAÇÃO DE RESULTADOS",
            admin_tools: "FERRAMENTAS DO ADMINISTRADOR"
        },
        PaginaPrincipal: {
            title: "Selecionar Estudo",
            searchBar: "Buscar Estudo",
            btCreate: "Criar Estudo",
            btLogOff: "Sair"
        },
        CreacionDeEstudio: {
            title: "Criação de Estudo",                 summaryTitle: "Criação de Estudo",
            hStudyTitle: "Título do Estudo",            inStudyTitle: "Título",
            hTargetAudience: "Público Alvo",            inTargetAudience: "Público Alvo",
            hStudyObjectives: "Objetivos do Estudo",    inStudyObjectives: "Objetivos gerais do estudo, separados por vírgulas (\",\")",
            hPrompt: "Prompt do Estudo",                inPrompt: "Insira o prompt geral da pesquisa",
            color1: "Cor Primária do Estudo",           color2: "Cor Secundária do Estudo",
            btSaveColors: "Salvar Cores",               btDefaultColors: "Cores Padrão",
            btCreate: "Criar Estudo",                   btUpdate: "Atualizar Estudo",
        },
        LanzarEstudio: {
            title: "Lançar Estudo",                     hStudyTitle: "Título do Estudo",
            btAdd: "Adicionar",                         btSave: "Salvar",
            hFilters: "Filtros",                        inFilters: "Adicione filtros para o Módulo de Análise",
            hDomains: "Domínios Autorizados",
            hDeployConfig: "Configurar Desdobramento de análise de dados",
            //Modulos en ComboBox
            modGeneral: "Módulo de Análise Geral",
            modAnalysis: "Módulo de Análise Individual",
            modPsicographic: "Módulo de Análise Psicográfica",
            modUserPersona: "Módulo de User Personas",
            modCustomerExperience: "Módulo Customer Experience",
            modCustomerSatisfaction: "Módulo NPS e Satisfação",
            modBrandStatus: "Módulo Brand Status",
            modClimaLaboral: "Módulo Clima Laboral",

            hSuggQuestion: "Perguntas Sugeridas",       inSuggQuestion: "Adicione perguntas sugeridas para Sócrates",
            hRecollectionModule: "Módulo de Coleta de Dados", aRecollectionModule: "ColetaDeDados.com",
            hAnalysisModule: "Módulo de Análise de Dados",  aAnalysisModule: "AnaliseDeDados.com",
            btChangeState: "Alterar Estado",            btOTP: "Gerar OTP",
            btLaunch: "Lançar Estudo"
        },
        InformacionDelEstudio: {
            title: "Transcrição de Pesquisas",
            hSurveyCount: "Pesquisas Aplicadas:",
            btTranscriptions: "Baixar Transcrições",
            btNonProcessedTranscriptions: "Baixar Transcrições Não Processadas",
            btLogOTP: "Baixar Log de OTP",
            btDelFiles: "Excluir Arquivos",
        }
    }
};

// Para hacer referencia a sub-elementos (Ej: navbar.results.title...)
function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}

// Setea el idioma en el DOM
function setLanguage(lang) {
    // Texto
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            el.textContent = translation;
        }
    });
    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            el.setAttribute('placeholder', translation);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const switcher = document.getElementById('languageSwitcher');
    if (switcher) {
        switcher.addEventListener('change', function () {
            setLanguage(this.value);
        });
        setLanguage(switcher.value || 'es');
    }
});