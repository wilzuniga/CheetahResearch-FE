// bt: button
// h: header
// in: input

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
            title: "Creación de Estudio",               summaryTitle: "Creación de Estudio",
            hStudyTitle: "Titulo del Estudio",          inStudyTitle: "Titulo",
            hTargetAudience: "Mercado Objetivo",        inTargetAudience: "Mercado Objetivo",
            hStudyObjectives: "Objetivos del Estudio",  inStudyObjectives: "Objetivos generales del estudio, separados por comas (\",\")",
            hPrompt: "Prompt del Estudio",              inPrompt: "Ingresa el prompt general de la encuesta",
            color1: "Color Principal del Estudio",      color2: "Color Secundario del Estudio",
            btSaveColors: "Guardar Colores",            btDefaultColors: "Colores Predefinidos",
            btCreate: "Crear Estudio",                  btUpdate: "Actualizar Estudio",
        },
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