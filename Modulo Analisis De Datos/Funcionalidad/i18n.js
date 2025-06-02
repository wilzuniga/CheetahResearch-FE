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

Cambiar filtros de fecha a puro numero en AnalisisDeDatos.html?
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
        AnalisisDeDatos: {//Falta Bullet Points en EKMAN
            //Resumen General
            titleGeneral:"Resumen General", descGeneral:"En esta sección se muestra un resumen general de los resultados obtenidos. Puedes seleccionar un estilo de visualización y aplicar filtros para obtener información específica.",
            
            //Resumen Individual
            titleIndividual:"Resumen Individual", descIndividual:"En esta sección se muestra un resumen individual por pregunta. Puedes seleccionar un estilo de visualización y aplicar filtros para obtener información específica.",
            
            //User Persona y Arquetipo
            btUP_Archetype:"User Persona y Arquetipo", 
            titleUserPersona:"User Persona",     descUserPersona:"En esta sección se muestra información sobre el perfil del usuario objetivo, conocido como User Persona. Puedes seleccionar un filtro específico para obtener detalles relevantes.",
            titleUserArchetype:"User Arquetipo", descUserArchetype:"En esta sección se muestra información sobre el arquetipo de persona. Puedes seleccionar un filtro específico para obtener detalles relevantes.",
            
            //Experiencia de Usuario
            titleCustomerExperience:"Experiencia de Usuario", descCustomerExperience:"En esta sección se evalúa las percepciones, emociones y comportamiento de los clientes en cada punto de interacción con una marca, para identificar áreas de mejora y fortalecer la satisfacción y fidelización. Puedes seleccionar un filtro específico para obtener detalles relevantes.",
            
            //Psicográficos
            btPsicographics:"Análisis Psicográficos",
            titleEKMAN:"Análisis Psicográfico - Ekman",              descEKMAN:"En esta sección se presenta un análisis psicográfico basado en las respuestas escritas, utilizando el modelo de Ekman. Este análisis se desglosa en los siguientes aspectos:", 
            s1EKMAN:"Emociones Básicas",                             s2EKMAN:"Microexpresiones Textuales", 
            desc1EKMAN:"Se identifican y clasifican las emociones primarias reflejadas en el contenido textual.", desc2EKMAN:"Se detectan y analizan sutiles indicios emocionales que podrían estar presentes en la redacción, similares a las microexpresiones faciales.",
            titlePersonality:"Análisis de Rasgos de Personalidad",   descPersonality:"En esta sección se lleva a cabo un análisis exhaustivo de los rasgos de personalidad reflejados en las respuestas escritas, identificando y clasificando estos rasgos para obtener una visión más detallada del perfil del usuario objetivo.",
            titlePsicSegments:"Análisis de Segmentos Psicográficos", descPsicSegments:"En esta sección se realiza un análisis detallado de los segmentos psicográficos a partir de las respuestas escritas, con el objetivo de identificar y clasificar diferentes perfiles de usuarios en función de sus características psicológicas, comportamientos, valores y estilos de vida. Los segmentos incluyen perfiles como usuarios leales, indistintos y críticos.",
            titleCommStyles:"Análisis de Estilos de Comunicación",   descCommStyles:"En esta sección se realiza un análisis de los estilos de comunicación de los encuestados, categorizándolos en Reveladores, Factuales, Informativos y Buscadores de Acción. Estos estilos se determinan en base a cómo los encuestados expresan sus opiniones y preferencias.",
            btEKMAN:"EKMAN", 
            btPersonality:"Rasgos de Personalidad", 
            btPsicSegments:"Segmentos Psicográficos",
            btCommStyles:"Estilo de Comunicación",


            //NPS y Satisfacción
            btNPS_Satisfaction:"NPS y Satisfacción",
            titleCustomerSatisfaction:"Análisis de Satisfacción", descCustomerSatisfaction:"Este análisis integral evalúa la satisfacción del cliente a través de un estudio detallado que identifica factores clave, tendencias en los comentarios y áreas críticas de mejora. Se examinan correlaciones, se segmentan los clientes y se aplican modelos como Kano y ACSI para ofrecer una visión profunda de la situación actual y recomendaciones estratégicas.",
            titleNPS:"Análisis de NPS",                           descNPS:"En esta sección se realiza un análisis del Net Promoter Score (NPS) a partir de las respuestas escritas. El NPS es una métrica utilizada para medir la lealtad de los clientes y su disposición a recomendar un producto o servicio.",
            btCustomerSatisfaction:"Satisfacción",
            btNPS:"NPS",

            //Brand Status
            btBrandStatus:"Estatus de Marca",
            titleBrandStrength:"Análisis: Fortaleza de Marca", descBrandStrength:"Este análisis integral evalúa la fortaleza de la marca a través de un estudio detallado que identifica factores clave, percepciones del consumidor y áreas de oportunidad. Se examinan atributos de marca, asociaciones, lealtad y métricas como el reconocimiento y la relevancia para ofrecer una visión profunda de la situación actual y recomendaciones estratégicas.",
            titleBrandEquity:"Análisis: Equidad de Marca",     descBrandEquity:"Este análisis integral evalúa el valor de marca a través de un estudio detallado que identifica factores clave, percepciones del consumidor y áreas de oportunidad. Se examinan atributos de marca, asociaciones, lealtad y métricas como el Net Promoter Score (NPS) para ofrecer una visión profunda de la fortaleza de la marca y recomendaciones estratégicas.",
            btBrandStrength:"Fortaleza de Marca",
            btBrandEquity:"Equidad de Marca",

            //Clima Laboral
            btClimaLaboral:"Clima Laboral",
            titleClimaLaboral:"Análisis de Clima Laboral", descClimaLaboral:"Este análisis integral evalúa el clima laboral a través de un estudio detallado que identifica factores clave, tendencias en los comentarios y áreas críticas de mejora. Se examinan correlaciones, se segmentan los empleados y se aplican modelos como Kano y ACSI para ofrecer una visión profunda de la situación actual y recomendaciones estratégicas.",

            //Otros
            sSelectStyle:"Selecciona un estilo:",      sSelectFilter:"Selecciona un Filtro:", sSelectVisual:"Selecciona una Visualización:",//Quitar 'SELECCIONAR FILTRO' de combobox
            optNarrative:"Narrativo", optFactual:"Factual", optPercentage:"Porcentual", optGeneral:"General",
            optVisualGraphics:"Visualización grafica", optVisualText:"Visualización textual",
            btEdit:"Editar",                           btSave:"Guardar Cambios",              btExport:"Exportar",
            btForceAnalysis:"Forzar Análisis",         btImport:"Importar Resultados",
        },
        //data-i18n="AnalisisDeDatos."
        //data-i18n-placeholder="AnalisisDeDatos."
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
        AnalisisDeDatos: {
            // General Summary
            titleGeneral: "General Summary", descGeneral: "This section shows a general summary of the results obtained. You can select a visualization style and apply filters to obtain specific information.",
        
            // Individual Summary
            titleIndividual: "Individual Summary", descIndividual: "This section shows an individual summary by question. You can select a visualization style and apply filters to obtain specific information.",
        
            // User Persona & Archetype
            btUP_Archetype: "User Persona and Archetype",
            titleUserPersona: "User Persona", descUserPersona: "This section shows information about the target user's profile, known as User Persona. You can select a specific filter to get relevant details.",
            titleUserArchetype: "User Archetype", descUserArchetype: "This section shows information about the person archetype. You can select a specific filter to get relevant details.",
        
            // User Experience
            titleCustomerExperience: "User Experience", descCustomerExperience: "This section evaluates the perceptions, emotions, and behavior of customers at each point of interaction with a brand, to identify areas for improvement and strengthen satisfaction and loyalty. You can select a specific filter to get relevant details.",
        
            // Psychographics
            btPsicographics: "Psychographic Analysis",
            titleEKMAN: "Psychographic Analysis - Ekman", descEKMAN: "This section presents a psychographic analysis based on written responses, using the Ekman model. This analysis is broken down into the following aspects:",
            s1EKMAN: "Basic Emotions", s2EKMAN: "Textual Microexpressions",
            desc1EKMAN: "Primary emotions reflected in the textual content are identified and classified.", desc2EKMAN: "Subtle emotional cues that may be present in the writing, similar to facial microexpressions, are detected and analyzed.",
            titlePersonality: "Personality Traits Analysis", descPersonality: "This section carries out a thorough analysis of the personality traits reflected in the written responses, identifying and classifying these traits to obtain a more detailed view of the target user's profile.",
            titlePsicSegments: "Psychographic Segments Analysis", descPsicSegments: "This section provides a detailed analysis of psychographic segments based on written responses, aiming to identify and classify different user profiles according to their psychological characteristics, behaviors, values, and lifestyles. Segments include profiles such as loyal, indifferent, and critical users.",
            titleCommStyles: "Communication Styles Analysis", descCommStyles: "This section analyzes the communication styles of respondents, categorizing them as Revealing, Factual, Informative, and Action Seekers. These styles are determined based on how respondents express their opinions and preferences.",
            btEKMAN: "EKMAN",
            btPersonality: "Personality Traits",
            btPsicSegments: "Psychographic Segments",
            btCommStyles: "Communication Style",

            // NPS & Satisfaction
            btNPS_Satisfaction: "NPS and Satisfaction",
            titleCustomerSatisfaction: "Satisfaction Analysis", descCustomerSatisfaction: "This comprehensive analysis evaluates customer satisfaction through a detailed study that identifies key factors, trends in comments, and critical areas for improvement. Correlations are examined, customers are segmented, and models such as Kano and ACSI are applied to provide a deep insight into the current situation and strategic recommendations.",
            titleNPS: "NPS Analysis", descNPS: "This section analyzes the Net Promoter Score (NPS) based on written responses. NPS is a metric used to measure customer loyalty and their willingness to recommend a product or service.",
            btCustomerSatisfaction: "Satisfaction",
            btNPS: "NPS",

            // Brand Status
            btBrandStatus: "Brand Status",
            titleBrandStrength: "Analysis: Brand Strength", descBrandStrength: "This comprehensive analysis evaluates brand strength through a detailed study that identifies key factors, consumer perceptions, and areas of opportunity. Brand attributes, associations, loyalty, and metrics such as recognition and relevance are examined to provide a deep insight into the current situation and strategic recommendations.",
            titleBrandEquity: "Analysis: Brand Equity", descBrandEquity: "This comprehensive analysis evaluates brand value through a detailed study that identifies key factors, consumer perceptions, and areas of opportunity. Brand attributes, associations, loyalty, and metrics such as Net Promoter Score (NPS) are examined to provide a deep insight into brand strength and strategic recommendations.",
            btBrandStrength: "Brand Strength",
            btBrandEquity: "Brand Equity",

            // Work Environment
            btClimaLaboral: "Work Environment",
            titleClimaLaboral: "Work Environment Analysis", descClimaLaboral: "This comprehensive analysis evaluates the work environment through a detailed study that identifies key factors, trends in comments, and critical areas for improvement. Correlations are examined, employees are segmented, and models such as Kano and ACSI are applied to provide a deep insight into the current situation and strategic recommendations.",
        
            // Others
            sSelectStyle: "Select a style:", sSelectFilter: "Select a Filter:", sSelectVisual: "Select a Visualization:",
            optNarrative: "Narrative", optFactual: "Factual", optPercentage: "Percentage",
            optVisualGraphics: "Graphic Visualization", optVisualText: "Textual Visualization",
            btEdit: "Edit", btSave: "Save Changes", btExport: "Export",
            btForceAnalysis: "Force Analysis", btImport: "Import Results",
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
        AnalisisDeDatos: {
            //Resumo Geral
            titleGeneral: "Resumo Geral", descGeneral: "Esta seção mostra um resumo geral dos resultados obtidos. Você pode selecionar um estilo de visualização e aplicar filtros para obter informações específicas.",
        
            //Resumo Individual
            titleIndividual: "Resumo Individual", descIndividual: "Esta seção mostra um resumo individual por pergunta. Você pode selecionar um estilo de visualização e aplicar filtros para obter informações específicas.",
        
            //User Persona e Arquétipo
            btUP_Archetype: "User Persona e Arquétipo",
            titleUserPersona: "User Persona", descUserPersona: "Esta seção mostra informações sobre o perfil do usuário alvo, conhecido como User Persona. Você pode selecionar um filtro específico para obter detalhes relevantes.",
            titleUserArchetype: "User Arquétipo", descUserArchetype: "Esta seção mostra informações sobre o arquétipo da pessoa. Você pode selecionar um filtro específico para obter detalhes relevantes.",
        
            //Experiência do Usuário
            titleCustomerExperience: "Experiência do Usuário", descCustomerExperience: "Esta seção avalia as percepções, emoções e comportamento dos clientes em cada ponto de interação com uma marca, para identificar áreas de melhoria e fortalecer a satisfação e fidelização. Você pode selecionar um filtro específico para obter detalhes relevantes.",
        
            //Psicográficos
            btPsicographics: "Análise Psicográfica",
            titleEKMAN: "Análise Psicográfica - Ekman", descEKMAN: "Esta seção apresenta uma análise psicográfica baseada em respostas escritas, utilizando o modelo de Ekman. Esta análise é dividida nos seguintes aspectos:",
            s1EKMAN: "Emoções Básicas", s2EKMAN: "Microexpressões Textuais",
            desc1EKMAN: "As emoções primárias refletidas no conteúdo textual são identificadas e classificadas.", desc2EKMAN: "Sutis indícios emocionais que podem estar presentes na escrita, semelhantes às microexpressões faciais, são detectados e analisados.",
            titlePersonality: "Análise de Traços de Personalidade", descPersonality: "Esta seção realiza uma análise detalhada dos traços de personalidade refletidos nas respostas escritas, identificando e classificando esses traços para obter uma visão mais detalhada do perfil do usuário alvo.",
            titlePsicSegments: "Análise de Segmentos Psicográficos", descPsicSegments: "Esta seção fornece uma análise detalhada dos segmentos psicográficos com base nas respostas escritas, visando identificar e classificar diferentes perfis de usuários de acordo com suas características psicológicas, comportamentos, valores e estilos de vida. Os segmentos incluem perfis como usuários leais, indiferentes e críticos.",
            titleCommStyles: "Análise de Estilos de Comunicação", descCommStyles: "Esta seção analisa os estilos de comunicação dos respondentes, categorizando-os como Reveladores, Fatuais, Informativos e Buscadores de Ação. Esses estilos são determinados com base em como os respondentes expressam suas opiniões e preferências.",
            btEKMAN: "EKMAN",
            btPersonality: "Traços de Personalidade",
            btPsicSegments: "Segmentos Psicográficos",
            btCommStyles: "Estilo de Comunicação",
        
            //NPS e Satisfação
            btNPS_Satisfaction: "NPS e Satisfação",
            titleCustomerSatisfaction: "Análise de Satisfação", descCustomerSatisfaction: "Esta análise abrangente avalia a satisfação do cliente por meio de um estudo detalhado que identifica fatores-chave, tendências nos comentários e áreas críticas de melhoria. São examinadas correlações, os clientes são segmentados e modelos como Kano e ACSI são aplicados para fornecer uma visão aprofundada da situação atual e recomendações estratégicas.",
            titleNPS: "Análise de NPS", descNPS: "Esta seção analisa o Net Promoter Score (NPS) com base nas respostas escritas. O NPS é uma métrica usada para medir a lealdade do cliente e sua disposição em recomendar um produto ou serviço.",
            btCustomerSatisfaction: "Satisfação",
            btNPS: "NPS",
        
            //Estatus da Marca
            btBrandStatus: "Estatus da Marca",
            titleBrandStrength: "Análise: Força da Marca", descBrandStrength: "Esta análise abrangente avalia a força da marca por meio de um estudo detalhado que identifica fatores-chave, percepções do consumidor e áreas de oportunidade. São examinados atributos da marca, associações, lealdade e métricas como reconhecimento e relevância para fornecer uma visão aprofundada da situação atual e recomendações estratégicas.",
            titleBrandEquity: "Análise: Equidade da Marca", descBrandEquity: "Esta análise abrangente avalia o valor da marca por meio de um estudo detalhado que identifica fatores-chave, percepções do consumidor e áreas de oportunidade. São examinados atributos da marca, associações, lealdade e métricas como Net Promoter Score (NPS) para fornecer uma visão aprofundada da força da marca e recomendações estratégicas.",
            btBrandStrength: "Força da Marca",
            btBrandEquity: "Equidade da Marca",
        
            //Clima Organizacional
            btClimaLaboral: "Clima Organizacional",
            titleClimaLaboral: "Análise de Clima Organizacional", descClimaLaboral: "Esta análise abrangente avalia o clima organizacional por meio de um estudo detalhado que identifica fatores-chave, tendências nos comentários e áreas críticas de melhoria. São examinadas correlações, os funcionários são segmentados e modelos como Kano e ACSI são aplicados para fornecer uma visão aprofundada da situação atual e recomendações estratégicas.",
        
            //Outros
            sSelectStyle: "Selecione um estilo:", sSelectFilter: "Selecione um Filtro:", sSelectVisual: "Selecione uma Visualização:",
            optNarrative: "Narrativo", optFactual: "Factual", optPercentage: "Percentual",
            optVisualGraphics: "Visualização Gráfica", optVisualText: "Visualização Textual",
            btExport: "Exportar",
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