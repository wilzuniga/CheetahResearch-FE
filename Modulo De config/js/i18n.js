// bt: button
// h: header
// s: span
// a: anchor
// w: warning
// in: input
// out: output
// opt: option

/*
Faltan:
Alertas
Encuesta.html

Lanzar Estudio:
Links
OTP No Generado
btEliminar Filtro/Modulo/Dominio

Encuesta: Nuevo Formato
Activado/Desactivado
*/

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
            admin_tools: "Herramientas"
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
            hPrompt: "Contexto del Estudio",              inPrompt: "Ingresa el contexto general de la encuesta",
            color1: "Color Principal del Estudio",      color2: "Color Secundario del Estudio",
            btSaveColors: "Guardar Colores",            btDefaultColors: "Colores Predefinidos",
            btCreate: "Crear Estudio",                  btUpdate: "Actualizar Estudio",

            wStudyCreated: "Estudio Creado Exitosamente",
            wStudyUpdated: "Estudio Actualizado Exitosamente",
            wColorsSaved: "Colores Guardados Exitosamente",
        },
        CrearEncuestador: {
            title: "Encuestador",                       createTitle: "Crear Encuestador",
            hImg: "",                                   selectImg: "Seleccionar Imagen",
            hInterviewerName: "Nombre del Encuestador", inInterviewerName: "Ingresa el Nombre del encuestador",
            hTone: "Tono Encuestador",                  inTone: "Ingresa el tono en el cual hablará el encuestador",
            hObservations: "Observaciones Importantes", inObservations: "Observaciones Importantes para el encuestador",
            hGreeting: "Saludo",                        inGreeting: "Ingresa el saludo del encuestador",
            btCreate: "Crear Encuestador",              btUpdate: "Actualizar Encuestador",

            wUpdated: "Encuestador actualizado exitosamente",
            wCreated: "Encuestador creado exitosamente",
            wCreate: "Error al crear el encuestador"
        },
        Encuesta: {
            title: "Crear Encuesta",
            hQuestion: "Nueva pregunta",                                  inQuestion: "Ingresa tu pregunta",                   inWeight: "Ingresa el peso",
            hAttachment: "Archivo",
            hEdtQuestion: "Editar Pregunta:",
            btAddQuestion: "Agregar Pregunta",
            btDelQuestion: "Eliminar",                              btAddSubQuestion: "Agregar Pregunta de Seguimiento", btEdtQuestion: "Editar",      btDelSubQuestion: "Eliminar Preguntas de Seguimiento",
            inAddSubQuestion: "Ingresa tu Pregunta de Seguimiento", btSaveSubQuestion: "Agregar Pregunta",               btCloseSubQuestion: "Cerrar",
            btSaveQuestionEdit: "Guardar",                          btCloseQuestionEdit: "Cerrar",
            btSaveSurvey: "Guardar Encuesta",

            wFollowUp: "Por favor, ingresa una pregunta de seguimiento.",
            wQuestionWeight: "Por favor, ingresa tanto la pregunta como el peso.",
            wEmptyQuestion: "La pregunta no puede estar vacía.",
            wImageTooLarge: "La imagen es muy grande, por favor selecciona una imagen de menos de 0.5 MB (500 kb).",
            wSurveySaved: "Encuesta guardada exitosamente.",
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
            modCustomerJourney: "Módulo Customer Journey",
            modReputacion: "Módulo Reputación",
            modPruebaProducto: "Módulo Prueba de Producto",

            hSuggQuestion: "Preguntas Sugeridas",                  inSuggQuestion: "Agrega preguntas sugeridas para Sócrates",
            hRecollectionModule: "Módulo de Recolección de Datos", aRecollectionModule: "RecoleccionDeDatos.com",
            hAnalysisModule: "Módulo de Recolección de Datos",     aAnalysisModule: "AnalisisDeDatos.com",
            btChangeState: "Cambiar Estado",                       btOTP: "Generar OTP",
            btLaunch: "Activar Links"
        },
        InformacionDelEstudio: {
            title: "Transcripción de Encuestas",
            hSurveyCount: "Encuestas Aplicadas:",
            btTranscriptions: "Descargar Transcripciones",
            btNonProcessedTranscriptions: "Descargar Transcripciones No Procesadas",
            btLogOTP: "Descargar Log de OTP",
            btDelFiles: "Eliminar Archivos",
        },
        VisualizacionDeResultado: {
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
            
            titleBig5:"Análisis Big 5", descBig5:"En esta sección se realiza un análisis de personalidad basado en el modelo Big 5 (Cinco Grandes Factores de Personalidad), evaluando las cinco dimensiones principales: Apertura a la experiencia, Responsabilidad, Extroversión, Amabilidad y Neuroticismo. Este análisis permite identificar patrones de personalidad dominantes en las respuestas y proporciona insights profundos sobre el perfil psicológico de los encuestados.",
            btBig5:"Big 5",


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
            
            btCustomerJourney:"Customer Journey", titleCustomerJourney:"Análisis de Customer Journey", descCustomerJourney:"Este análisis integral mapea y evalúa la experiencia completa del cliente a lo largo de su interacción con la marca. Se identifican los puntos de contacto críticos, momentos de verdad, emociones experimentadas en cada etapa, y se detectan oportunidades de mejora para optimizar el recorrido del cliente desde la conciencia inicial hasta la fidelización y recomendación.",
            
            btReputacion:"Reputación", titleReputacion:"Análisis de Reputación", descReputacion:"Este análisis integral evalúa la reputación de la marca a través de un estudio detallado que examina la percepción pública, credibilidad, confianza y prestigio asociados con la organización. Se analizan menciones, sentimientos, crisis reputacionales potenciales y se identifican oportunidades para fortalecer la imagen corporativa y gestionar eficazmente la reputación digital y tradicional.",
            
            btPruebaProducto:"Prueba de Producto", titlePruebaProducto:"Análisis de Prueba de Producto", descPruebaProducto:"Este análisis integral evalúa la efectividad y aceptación de productos a través de pruebas controladas con usuarios reales. Se examinan aspectos como usabilidad, funcionalidad, satisfacción del usuario, identificación de problemas y áreas de mejora. El análisis incluye métricas de rendimiento, feedback cualitativo y cuantitativo, y recomendaciones para optimizar el producto antes de su lanzamiento al mercado.",

            //Otros
            sSelectStyle:"Selecciona un estilo:",      sSelectFilter:"Selecciona un Filtro:", sSelectVisual:"Selecciona una Visualización:",//Quitar 'SELECCIONAR FILTRO' de combobox
            optNarrative:"Narrativo", optFactual:"Factual", optPercentage:"Porcentual",
            optVisualGraphics:"Visualización grafica", optVisualText:"Visualización textual",
            btEdit:"Editar",                           btSave:"Guardar Cambios",              btExport:"Exportar",
            btForceAnalysis:"Ejecutar Análisis",         btImport:"Importar Datos",
        },
        HerramientasDelAdministrador: {
            title: "Herramientas",
            hAccess: "Solicitudes de Acceso",
            btAccess: "Conceder Acceso",
            hDelStudy: "Eliminar Estudio",
            btDelStudy: "Eliminar"
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

            wStudyCreated: "Study Created Successfully",
            wStudyUpdated: "Study Updated Successfully",
            wColorsSaved: "Colors Saved Successfully",
        },
        CrearEncuestador: {
            title: "Interviewer",                       createTitle: "Create Interviewer",
            hImg: "",                                   selectImg: "Select Image",
            hInterviewerName: "Interviewer Name",      inInterviewerName: "Enter the interviewer's name",
            hTone: "Interviewer Tone",                 inTone: "Enter the tone in which the interviewer will speak",
            hObservations: "Important Observations",  inObservations: "Important observations for the interviewer",
            hGreeting: "Greeting",                     inGreeting: "Enter the interviewer's greeting",
            btCreate: "Create Interviewer",            btUpdate: "Update Interviewer",

            wUpdated: "Interviewer updated successfully",
            wCreated: "Interviewer created successfully",
            wCreate: "Error creating interviewer"
        },
        Encuesta: {
            title: "Create Survey",
            hQuestion: "Question",                                  inQuestion: "Enter your question",                   inWeight: "Enter the weight",
            hAttachment: "Attachment",
            hEdtQuestion: "Edit Question:",
            btAddQuestion: "Add Question",
            btDelQuestion: "Delete",                                btAddSubQuestion: "Add Follow-up Question",          btEdtQuestion: "Edit",      btDelSubQuestion: "Delete Follow-up Questions",
            inAddSubQuestion: "Enter your follow-up question",      btSaveSubQuestion: "Add Question",                   btCloseSubQuestion: "Close",
            btSaveQuestionEdit: "Save",                             btCloseQuestionEdit: "Close",
            btSaveSurvey: "Save Survey",

            wFollowUp: "Please enter a follow-up question.",
            wQuestionWeight: "Please enter both the question and the weight.",
            wEmptyQuestion: "The question cannot be empty.",
            wImageTooLarge: "The image is too large, please select an image smaller than 0.5 MB (500 kb).",
            wSurveySaved: "Survey saved successfully.",
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
            modCustomerJourney: "Customer Journey Module",
            modReputacion: "Reputation Module",
            modPruebaProducto: "Product Testing Module",

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
        },
        VisualizacionDeResultado: {
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
            
            titleBig5: "Big 5 Analysis", descBig5: "This section performs a personality analysis based on the Big 5 model (Five-Factor Model of Personality), evaluating the five main dimensions: Openness to experience, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. This analysis allows identification of dominant personality patterns in responses and provides deep insights into the psychological profile of respondents.",
            btBig5: "Big 5",

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
            
            // Customer Journey
            btCustomerJourney: "Customer Journey",
            titleCustomerJourney: "Customer Journey Analysis", descCustomerJourney: "This comprehensive analysis maps and evaluates the complete customer experience throughout their interaction with the brand. Critical touchpoints, moments of truth, emotions experienced at each stage are identified, and improvement opportunities are detected to optimize the customer journey from initial awareness to loyalty and recommendation.",
            
            // Reputation
            btReputacion: "Reputation",
            titleReputacion: "Reputation Analysis", descReputacion: "This comprehensive analysis evaluates the brand's reputation through a detailed study that examines public perception, credibility, trust and prestige associated with the organization. Mentions, sentiments, potential reputational crises are analyzed and opportunities are identified to strengthen corporate image and effectively manage digital and traditional reputation.",
            
            // Product Testing
            btPruebaProducto: "Product Testing",
            titlePruebaProducto: "Product Testing Analysis", descPruebaProducto: "This comprehensive analysis evaluates product effectiveness and acceptance through controlled testing with real users. Aspects such as usability, functionality, user satisfaction, problem identification and improvement areas are examined. The analysis includes performance metrics, qualitative and quantitative feedback, and recommendations to optimize the product before market launch.",
        
            // Others
            sSelectStyle: "Select a style:", sSelectFilter: "Select a Filter:", sSelectVisual: "Select a Visualization:",
            optNarrative: "Narrative", optFactual: "Factual", optPercentage: "Percentage",
            optVisualGraphics: "Graphic Visualization", optVisualText: "Textual Visualization",
            btEdit: "Edit", btSave: "Save Changes", btExport: "Export",
            btForceAnalysis: "Force Analysis", btImport: "Import Results",
        },
        HerramientasDelAdministrador: {
            title: "Admin Tools",
            hAccess: "Access Requests",
            btAccess: "Grant Access",
            hDelStudy: "Delete Study",
            btDelStudy: "Delete"
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

            wStudyCreated: "Estudo Criado com Sucesso",
            wStudyUpdated: "Estudo Atualizado com Sucesso",
            wColorsSaved: "Cores Salvas com Sucesso",
        },
        CrearEncuestador: {
            title: "Entrevistador",                     createTitle: "Criar Entrevistador",
            hImg: "",                                   selectImg: "Selecionar Imagem",
            hInterviewerName: "Nome do Entrevistador", inInterviewerName: "Insira o nome do entrevistador",
            hTone: "Tom do Entrevistador",              inTone: "Insira o tom no qual o entrevistador falará",
            hObservations: "Observações Importantes",  inObservations: "Observações importantes para o entrevistador",
            hGreeting: "Saudação",                      inGreeting: "Insira a saudação do entrevistador",
            btCreate: "Criar Entrevistador",            btUpdate: "Atualizar Entrevistador",

            wUpdated: "Entrevistador atualizado com sucesso",
            wCreated: "Entrevistador criado com sucesso",
            wCreate: "Erro ao criar o entrevistador"
        },
        Encuesta: {
            title: "Criar Pesquisa",
            hQuestion: "Pergunta",                                  inQuestion: "Digite sua pergunta",                   inWeight: "Digite o peso",
            hAttachment: "Anexo",
            hEdtQuestion: "Editar Pergunta:",
            btAddQuestion: "Adicionar Pergunta",
            btDelQuestion: "Excluir",                               btAddSubQuestion: "Adicionar Pergunta de Seguimento", btEdtQuestion: "Editar",      btDelSubQuestion: "Excluir Perguntas de Seguimento",
            inAddSubQuestion: "Digite sua pergunta de seguimento",  btSaveSubQuestion: "Adicionar Pergunta",              btCloseSubQuestion: "Fechar",
            btSaveQuestionEdit: "Salvar",                           btCloseQuestionEdit: "Fechar",
            btSaveSurvey: "Salvar Pesquisa",

            wFollowUp: "Por favor, insira uma pergunta de seguimento.",
            wQuestionWeight: "Por favor, insira tanto a pergunta quanto o peso.",
            wEmptyQuestion: "A pergunta não pode estar vazia.",
            wImageTooLarge: "A imagem é muito grande, por favor selecione uma imagem menor que 0.5 MB (500 kb).",
            wSurveySaved: "Pesquisa salva com sucesso.",
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
            modCustomerJourney: "Módulo Customer Journey",
            modReputacion: "Módulo Reputação",
            modPruebaProducto: "Módulo Teste de Produto",

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
        },
        VisualizacionDeResultado: {
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
            
            titleBig5: "Análise Big 5", descBig5: "Esta seção realiza uma análise de personalidade baseada no modelo Big 5 (Cinco Grandes Fatores de Personalidade), avaliando as cinco dimensões principais: Abertura à experiência, Conscienciosidade, Extroversão, Amabilidade e Neuroticismo. Esta análise permite identificar padrões de personalidade dominantes nas respostas e fornece insights profundos sobre o perfil psicológico dos respondentes.",
            btBig5: "Big 5",
        
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
            
            //Customer Journey
            btCustomerJourney: "Customer Journey",
            titleCustomerJourney: "Análise de Customer Journey", descCustomerJourney: "Esta análise abrangente mapeia e avalia a experiência completa do cliente ao longo de sua interação com a marca. São identificados os pontos de contato críticos, momentos da verdade, emoções experimentadas em cada etapa, e são detectadas oportunidades de melhoria para otimizar a jornada do cliente desde a conscientização inicial até a fidelização e recomendação.",
            
            //Reputação
            btReputacion: "Reputação",
            titleReputacion: "Análise de Reputação", descReputacion: "Esta análise abrangente avalia a reputação da marca por meio de um estudo detalhado que examina a percepção pública, credibilidade, confiança e prestígio associados à organização. São analisadas menções, sentimentos, crises reputacionais potenciais e são identificadas oportunidades para fortalecer a imagem corporativa e gerenciar eficazmente a reputação digital e tradicional.",
            
            //Teste de Produto
            btPruebaProducto: "Teste de Produto",
            titlePruebaProducto: "Análise de Teste de Produto", descPruebaProducto: "Esta análise abrangente avalia a eficácia e aceitação de produtos por meio de testes controlados com usuários reais. São examinados aspectos como usabilidade, funcionalidade, satisfação do usuário, identificação de problemas e áreas de melhoria. A análise inclui métricas de desempenho, feedback qualitativo e quantitativo, e recomendações para otimizar o produto antes de seu lançamento no mercado.",
        
            //Outros
            sSelectStyle: "Selecione um estilo:", sSelectFilter: "Selecione um Filtro:", sSelectVisual: "Selecione uma Visualização:",
            optNarrative: "Narrativo", optFactual: "Factual", optPercentage: "Percentual",
            optVisualGraphics: "Visualização Gráfica", optVisualText: "Visualização Textual",
            btEdit: "Editar", btSave: "Salvar Alterações", btExport: "Exportar",
            btForceAnalysis: "Forçar Análise", btImport: "Importar Resultados",
        },
        HerramientasDelAdministrador: {
            title: "Ferramentas do Administrador",
            hAccess: "Solicitações de Acesso",
            btAccess: "Conceder Acesso",
            hDelStudy: "Excluir Estudo",
            btDelStudy: "Excluir"
        }
    }
};

// Para hacer referencia a sub-elementos (Ej: navbar.results.title...)
function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}

// Setea el idioma en el DOM
function setLanguage(lang) {
    //Guarda idioma
    sessionStorage.setItem('language', lang);

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
        setLanguage(sessionStorage.getItem('language') || switcher.value || 'es');
        switcher.value = sessionStorage.getItem('language') || switcher.value || 'es';
    }
});