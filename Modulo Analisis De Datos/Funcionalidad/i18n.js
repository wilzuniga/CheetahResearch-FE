// bt: button
// h: header
// s: span
// a: anchor
// in: input
// out: output
// opt: option
// e: error

/*
Faltan:
Alertas
Revisar placeholders en js

PaginaPrincipal.js:
Tiene muchos avisos
*/

const translations = {
    es: {
        brand: "Cheetah Research",
        registered: "es una marca registrada de",
        company: "Marketing Total S.A.",
        rights: "Todos los derechos reservados.",
        AnalysisNavbar: {
            mainPage: "PÁGINA PRINCIPAL",
            dataAnalysis: "ANÁLISIS DE DATOS",
        },
        Overview: {
            //Overlay
            overlayTitle: "AVISO LEGAL", 
            s1Overlay:"Sobre el Contenido:",  
            s2Overlay:"Sobre la Plataforma:", 
            desc1Overlay:"Los datos recopilados y presentados en este estudio son confidenciales y propiedad exclusiva del cliente. El acceso está restringido por un código distribuido solo a usuarios autorizados. Cualquier reproducción total o parcial, distribución a terceros o modificación de este contenido fuera de esta plataforma será responsabilidad del cliente.",
            desc2Overlay:"Todos los elementos metodológicos, análisis, diseño, estructura y presentación de resultados en la plataforma Cheetah Research son propiedad intelectual de Marketing Total y protegidos por la ley de Derechos de Autor y Derechos Conexos. No deben ser objeto de plagio, reproducción, muestra o utilización por otro proveedor, ejecutor, contratista, ni transmisión a terceros o cualquier otro uso no previsto.", 
            desc3Overlay:"Al acceder al reporte, los usuarios aceptan cumplir con estas condiciones y dan por entendidas las responsabilidades de cualquier infracción que pueda surgir del uso indebido de la información o la plataforma.",
            btAccept:"Acceder al Reporte",

            sMailOTP:"Por favor, ingresa tu correo electrónico para solicitar el OTP.",
            inMailOTP:"Correo electrónico",
            btRequestOTP:"Solicitar OTP",

            warningOTP:"Para acceder a esta información, necesitas un código de acceso. Por favor, ingresa el código de acceso que te proporcionaron. Si no posees un OTP, selecciona el botón \"Solicitar OTP\" para obtener uno.",
            btVerifyOTP:"Verificar OTP",

            sStudyObjectives: "Objetivos del Estudio:",
            sTargetAudience: "Mercado Objetivo:",      
            sStudyDate: "Fecha del Estudio:",      
            sStudySummary: "Resumen:",   
            eRequestedStudy: "Estudio solicitado no encontrado.",
            eLoadStudies: "Error al cargar los estudios. Por favor, inténtalo de nuevo más tarde.",   
            eUnavailableLink: "Parece que el enlace ya no está disponible. Si necesitas acceder a esta información, no dudes en contactarnos, ¡estamos aquí para ayudarte a resolverlo!",
        },
        //data-i18n="Overview."
        //data-i18n-placeholder="Overview."
        //ANALISIS DE DATOS == VisualizacionDeResultado
    },

    en: {
        brand: "Cheetah Research",
        registered: "is a registered trademark of",
        company: "Marketing Total S.A.",
        rights: "All rights reserved.",
        AnalysisNavbar: {
            mainPage: "MAIN PAGE",
            dataAnalysis: "DATA ANALYSIS",
        },
        Overview: {
            //Overlay
            overlayTitle: "LEGAL NOTICE", 
            s1Overlay:"About the Content:",  
            s2Overlay:"About the Platform:", 
            desc1Overlay:"The data collected and presented in this study is confidential and the exclusive property of the client. Access is restricted by a code distributed only to authorized users. Any total or partial reproduction, distribution to third parties, or modification of this content outside this platform will be the client's responsibility.",
            desc2Overlay:"All methodological elements, analysis, design, structure, and presentation of results on the Cheetah Research platform are intellectual property of Marketing Total and protected by Copyright and Related Rights law. They should not be subject to plagiarism, reproduction, display, or use by another provider, executor, contractor, nor transmission to third parties or any other unintended use.", 
            desc3Overlay:"By accessing the report, users agree to comply with these conditions and acknowledge the responsibilities for any infringement that may arise from misuse of the information or the platform.",
            btAccept:"Access Report",

            sMailOTP:"Please enter your email to request the OTP.",
            inMailOTP:"Email",
            btRequestOTP:"Request OTP",

            warningOTP:"To access this information, you need an access code. Please enter the access code provided to you. If you do not have an OTP, select the \"Request OTP\" button to obtain one.",
            btVerifyOTP:"Verify OTP",

            sStudyObjectives: "Study Objectives:",
            sTargetAudience: "Target Market:",      
            sStudyDate: "Study Date:",      
            sStudySummary: "Summary:",   
            eRequestedStudy: "Requested study not found.",
            eLoadStudies: "Error loading studies. Please try again later.",   
            eUnavailableLink: "It seems that the link is no longer available. If you need access to this information, feel free to contact us; we are here to help you resolve it!",
        },
    },

    pt: {
        brand: "Cheetah Research",
        registered: "é uma marca registrada de",
        company: "Marketing Total S.A.",
        rights: "Todos os direitos reservados.",
        AnalysisNavbar: {
            mainPage: "PÁGINA PRINCIPAL",
            dataAnalysis: "ANÁLISE DE DADOS",
        },
        Overview: {
            //Overlay
            overlayTitle: "AVISO LEGAL", 
            s1Overlay:"Sobre o Conteúdo:",  
            s2Overlay:"Sobre a Plataforma:", 
            desc1Overlay:"Os dados coletados e apresentados neste estudo são confidenciais e propriedade exclusiva do cliente. O acesso é restrito por um código distribuído apenas a usuários autorizados. Qualquer reprodução total ou parcial, distribuição a terceiros ou modificação deste conteúdo fora desta plataforma será responsabilidade do cliente.",
            desc2Overlay:"Todos os elementos metodológicos, análises, design, estrutura e apresentação de resultados na plataforma Cheetah Research são propriedade intelectual da Marketing Total e protegidos pela lei de Direitos Autorais e Direitos Conexos. Não devem ser objeto de plágio, reprodução, exibição ou utilização por outro fornecedor, executor, contratante, nem transmissão a terceiros ou qualquer outro uso não previsto.", 
            desc3Overlay:"Ao acessar o relatório, os usuários concordam em cumprir estas condições e reconhecem as responsabilidades por qualquer infração que possa surgir do uso indevido das informações ou da plataforma.",
            btAccept:"Acessar Relatório",

            sMailOTP:"Por favor, insira seu e-mail para solicitar o OTP.",
            inMailOTP:"E-mail",
            btRequestOTP:"Solicitar OTP",

            warningOTP:"Para acessar esta informação, você precisa de um código de acesso. Por favor, insira o código de acesso fornecido a você. Se você não possui um OTP, selecione o botão \"Solicitar OTP\" para obter um.",
            btVerifyOTP:"Verificar OTP",

            sStudyObjectives: "Objetivos do Estudo:",
            sTargetAudience: "Mercado Alvo:",      
            sStudyDate: "Data do Estudo:",      
            sStudySummary: "Resumo:",   
            eRequestedStudy: "Estudo solicitado não encontrado.",
            eLoadStudies: "Erro ao carregar os estudos. Por favor, tente novamente mais tarde.",   
            eUnavailableLink: "Parece que o link não está mais disponível. Se você precisar acessar esta informação, não hesite em nos contatar; estamos aqui para ajudá-lo a resolver isso!",
        },
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