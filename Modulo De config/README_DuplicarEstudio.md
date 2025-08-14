# Funcionalidad de Duplicación de Estudios

## Descripción
Esta funcionalidad permite duplicar un estudio existente, copiando todos sus datos principales y creando una nueva instancia con el título "[Título Original] - COPIA".

## Características
- **Duplicación completa**: Copia todos los datos del estudio original
- **Título automático**: Agrega "- COPIA" al título original
- **Colores preservados**: Mantiene los colores principal y secundario del estudio
- **Encuestador duplicado**: Copia completamente el encuestador asociado al estudio
- **Encuesta duplicada**: Copia todas las preguntas personalizadas de la encuesta
- **Configuración de lanzamiento duplicada**: Copia filtros, módulos, dominios, preguntas sugeridas y estado del estudio
- **Interfaz intuitiva**: Botón visible en la página de información del estudio
- **Confirmación de eliminación**: Alert de confirmación antes de eliminar estudios

## Datos que se copian
1. **Título del estudio** (con sufijo "- COPIA")
2. **Mercado objetivo**
3. **Objetivos del estudio**
4. **Prompt del estudio**
5. **Color principal del estudio**
6. **Color secundario del estudio**
7. **Encuestador completo**:
   - Nombre del encuestador
   - Imagen de perfil
   - Tono del encuestador
   - Saludo personalizado
   - Observaciones importantes
8. **Encuesta completa**:
   - Preguntas personalizadas (ignorando las 3 predeterminadas)
   - Peso de cada pregunta
   - URLs o archivos adjuntos
   - Preguntas de seguimiento (feedback_questions)
9. **Configuración de lanzamiento completa**:
   - Filtros del estudio
   - Módulos configurados
   - Dominios permitidos
   - Preguntas sugeridas
   - Estado de activación de módulos (análisis y recolección)

## Cómo usar

### 1. Acceder a la página de información del estudio
- Navega a la página de información del estudio (`/configuration/studyInfo/`)
- Asegúrate de que haya un estudio seleccionado

### 2. Localizar el botón de duplicación
- El botón "Duplicar Estudio" está ubicado en la sección de botones
- Se posiciona después del botón "Borrar Archivos"
- Está habilitado solo cuando hay un estudio seleccionado

### 3. Ejecutar la duplicación
- Haz clic en el botón "Duplicar Estudio"
- El sistema procesará la solicitud automáticamente
- Se duplicará el estudio, colores, encuestador, encuesta y configuración de lanzamiento en secuencia

### 4. Confirmación
- Se mostrará un alert de éxito cuando la duplicación se complete
- El nuevo estudio estará disponible en la lista de estudios
- El encuestador estará completamente configurado en el nuevo estudio
- La encuesta estará lista para usar con todas las preguntas personalizadas
- La configuración de lanzamiento estará completamente replicada

## Proceso de Duplicación

### Fase 1: Duplicación del Estudio
1. **Crear estudio**: Se crea un nuevo estudio con datos copiados
2. **Configurar colores**: Se aplican los colores del estudio original
3. **Verificar éxito**: Se confirma la creación exitosa

### Fase 2: Duplicación del Encuestador
1. **Obtener datos**: Se recupera la información del encuestador original
2. **Verificar existencia**: Se confirma que existe un encuestador para duplicar
3. **Crear encuestador**: Se crea el encuestador en el nuevo estudio
4. **Confirmar éxito**: Se verifica la duplicación exitosa

### Fase 3: Duplicación de la Encuesta
1. **Obtener encuesta**: Se recupera la encuesta del estudio original
2. **Filtrar preguntas**: Se separan las preguntas personalizadas de las predeterminadas
3. **Crear encuesta**: Se crea la encuesta en el nuevo estudio
4. **Confirmar éxito**: Se verifica la duplicación exitosa

### Fase 4: Duplicación de la Configuración de Lanzamiento ⭐ **NUEVA**
1. **Duplicar filtros**: Se copian todos los filtros configurados
2. **Duplicar módulos**: Se copian los módulos habilitados
3. **Duplicar dominios**: Se copian todos los dominios permitidos
4. **Duplicar preguntas sugeridas**: Se copian las preguntas sugeridas del estudio
5. **Duplicar estado del estudio**: Se replica el estado de activación de módulos

### APIs utilizadas en secuencia completa
- `POST /configuration/createStudy/` - Crear el estudio duplicado
- `POST /configuration/set_colors/{studyId}` - Configurar los colores
- `POST /configuration/getInterviewer/` - Obtener datos del encuestador original
- `POST /configuration/addInterviewer/` - Crear el encuestador duplicado
- `GET /configuration/get_survey/{studyId}` - Obtener datos de la encuesta original
- `POST /configuration/createQuestion/{studyId}/` - Crear la encuesta duplicada
- `GET /configuration/get_filters/{studyId}` - Obtener filtros del estudio original ⭐
- `POST /configuration/filters/{studyId}` - Crear filtros en el nuevo estudio ⭐
- `GET /configuration/get_modules/{studyId}` - Obtener módulos del estudio original ⭐
- `POST /configuration/modules/{studyId}` - Crear módulos en el nuevo estudio ⭐
- `POST /configuration/api/get-list-domains/` - Obtener dominios del estudio original ⭐
- `POST /configuration/api/add-domain/` - Agregar dominios al nuevo estudio ⭐
- `GET /configuration/get_questions/{studyId}` - Obtener preguntas sugeridas del estudio original ⭐
- `POST /configuration/suggested_questions/{studyId}` - Crear preguntas sugeridas en el nuevo estudio ⭐
- `GET /configuration/info_study/{studyId}` - Obtener estado del estudio original ⭐
- `POST /configuration/activateAnalisis/` - Activar módulo de análisis si corresponde ⭐
- `POST /configuration/activateCollection/` - Activar módulo de recolección si corresponde ⭐

## Funcionalidad de Eliminación con Confirmación

### Alert de Confirmación
- Antes de eliminar un estudio, se muestra un alert de confirmación
- Mensaje: "¿Estás seguro de que quieres eliminar este estudio? Esta acción no se puede deshacer."
- El usuario debe confirmar para proceder con la eliminación
- Si se cancela, la operación se detiene

### Manejo de Errores
- Alert informativo si no se selecciona un estudio
- Alert de error si falla la eliminación
- Logs en consola para debugging

## Archivos involucrados
- `js/script_DuplicarEstudio.js` - Lógica principal de duplicación (estudio + encuestador + encuesta + configuración de lanzamiento)
- `js/Script_EliminarEstudio.js` - Lógica de eliminación con confirmación
- `InformacionDelEstudio.html` - Página donde aparece el botón de duplicación
- `CreacionDeEstudio.html` - Ya no incluye el script de duplicación

## Requisitos técnicos
- **Axios**: Para las llamadas a la API
- **SessionStorage**: Para obtener los datos del estudio actual
- **Token de autorización**: Para autenticar las solicitudes a la API
- **Fetch API**: Para la eliminación de estudios
- **FormData**: Para el manejo de datos del encuestador, encuesta y configuración de lanzamiento

## APIs utilizadas
- `POST /configuration/createStudy/` - Crear el estudio duplicado
- `POST /configuration/set_colors/{studyId}` - Configurar los colores del estudio duplicado
- `POST /configuration/getInterviewer/` - Obtener datos del encuestador original
- `POST /configuration/addInterviewer/` - Crear el encuestador duplicado
- `GET /configuration/get_survey/{studyId}` - Obtener datos de la encuesta original
- `POST /configuration/createQuestion/{studyId}/` - Crear la encuesta duplicada
- `GET /configuration/get_filters/{studyId}` - Obtener filtros del estudio original ⭐
- `POST /configuration/filters/{studyId}` - Crear filtros en el nuevo estudio ⭐
- `GET /configuration/get_modules/{studyId}` - Obtener módulos del estudio original ⭐
- `POST /configuration/modules/{studyId}` - Crear módulos en el nuevo estudio ⭐
- `POST /configuration/api/get-list-domains/` - Obtener dominios del estudio original ⭐
- `POST /configuration/api/add-domain/` - Agregar dominios al nuevo estudio ⭐
- `GET /configuration/get_questions/{studyId}` - Obtener preguntas sugeridas del estudio original ⭐
- `POST /configuration/suggested_questions/{studyId}` - Crear preguntas sugeridas en el nuevo estudio ⭐
- `GET /configuration/info_study/{studyId}` - Obtener estado del estudio original ⭐
- `POST /configuration/activateAnalisis/` - Activar módulo de análisis si corresponde ⭐
- `POST /configuration/activateCollection/` - Activar módulo de recolección si corresponde ⭐
- `DELETE /configuration/deleteStudy/` - Eliminar estudio (con confirmación)

## Manejo de errores
- **Estudio no encontrado**: Alert informativo si no hay datos del estudio
- **Error de autorización**: Alert si no hay token válido
- **Error de API**: Alert si falla la creación o configuración de colores
- **Error de encuestador**: Alert si falla la duplicación del encuestador
- **Error de encuesta**: Alert si falla la duplicación de la encuesta
- **Error de configuración de lanzamiento**: Alert si falla la duplicación de la configuración ⭐
- **Confirmación cancelada**: La eliminación se detiene si el usuario cancela
- **Validación de selección**: Alert si no se selecciona un estudio para eliminar

## Logs de consola
El sistema genera logs detallados en la consola del navegador para facilitar el debugging:

### Duplicación del Estudio
- Inicialización de la funcionalidad
- Datos del estudio a duplicar
- Solicitud de creación del estudio
- Configuración de colores
- Confirmación de éxito

### Duplicación del Encuestador
- Inicio de duplicación del encuestador
- Obtención de datos del encuestador original
- Preparación de datos para duplicación
- Creación del encuestador en el nuevo estudio
- Confirmación de éxito

### Duplicación de la Encuesta
- Inicio de duplicación de la encuesta
- Obtención de datos de la encuesta original
- Filtrado de preguntas personalizadas
- Preparación de datos para duplicación
- Creación de la encuesta en el nuevo estudio
- Confirmación de éxito

### Duplicación de la Configuración de Lanzamiento ⭐ **NUEVA**
- Inicio de duplicación de la configuración de lanzamiento
- Duplicación de filtros del estudio original
- Duplicación de módulos configurados
- Duplicación de dominios permitidos
- Duplicación de preguntas sugeridas
- Duplicación del estado de activación de módulos
- Confirmación de éxito completo

### Errores y Excepciones
- Errores de API con detalles de respuesta
- Estados HTTP de las solicitudes
- Fallos en la duplicación del encuestador
- Fallos en la duplicación de la encuesta
- Fallos en la duplicación de la configuración de lanzamiento ⭐
- Manejo de casos sin encuestador, encuesta o configuración de lanzamiento

## Notas importantes
- El botón de duplicación solo funciona cuando hay un estudio seleccionado en sessionStorage
- El botón se habilita/deshabilita automáticamente según el estado del estudio
- Los colores se configuran automáticamente si están disponibles
- El encuestador se duplica completamente, incluyendo imagen de perfil
- La encuesta se duplica ignorando las 3 preguntas predeterminadas del sistema
- Solo se copian las preguntas personalizadas creadas por el usuario
- La configuración de lanzamiento se duplica completamente incluyendo filtros, módulos, dominios y preguntas sugeridas ⭐
- El estado de activación de módulos se replica exactamente como en el estudio original ⭐
- Si no hay encuestador, encuesta o configuración de lanzamiento en el estudio original, se omite esa fase
- La funcionalidad es completamente independiente y robusta
- La eliminación de estudios requiere confirmación explícita del usuario

## Solución de problemas

### El botón no aparece o está deshabilitado
1. Verificar que estés en la página correcta (`/configuration/studyInfo/`)
2. Verificar que haya un estudio seleccionado
3. Revisar la consola del navegador para errores
4. Recargar la página

### Error al duplicar
1. Verificar que el token de autorización sea válido
2. Revisar la consola para mensajes de error específicos
3. Verificar la conectividad con la API
4. Intentar nuevamente

### Colores no se copian
1. Verificar que el estudio original tenga colores configurados
2. Revisar la consola para errores en la configuración de colores
3. Los colores se pueden configurar manualmente después de la duplicación

### Encuestador no se duplica
1. Verificar que el estudio original tenga un encuestador configurado
2. Revisar la consola para errores en la duplicación del encuestador
3. El encuestador se puede crear manualmente después de la duplicación
4. Verificar que la imagen del encuestador esté disponible

### Encuesta no se duplica
1. Verificar que el estudio original tenga preguntas personalizadas
2. Revisar la consola para errores en la duplicación de la encuesta
3. La encuesta se puede crear manualmente después de la duplicación
4. Verificar que las preguntas no sean solo las predeterminadas del sistema

### Configuración de lanzamiento no se duplica ⭐ **NUEVO**
1. Verificar que el estudio original tenga filtros, módulos, dominios o preguntas sugeridas configurados
2. Revisar la consola para errores en la duplicación de la configuración de lanzamiento
3. La configuración se puede configurar manualmente después de la duplicación
4. Verificar que los módulos estén en el estado correcto en el estudio original

### Problemas con la eliminación
1. Verificar que se haya seleccionado un estudio
2. Confirmar la acción cuando aparezca el alert
3. Revisar la consola para errores específicos
4. Verificar permisos de administrador

## Casos de uso

### Estudio completo con encuestador, encuesta y configuración de lanzamiento
- Se duplica todo: estudio, colores, encuestador, encuesta y configuración completa
- Mensaje de éxito completo
- Nuevo estudio 100% funcional y listo para usar

### Estudio sin encuestador
- Se duplica estudio, colores, encuesta y configuración de lanzamiento
- Se omite la fase de encuestador
- Mensaje informativo sobre la omisión

### Estudio sin encuesta personalizada
- Se duplica estudio, colores, encuestador y configuración de lanzamiento
- Se omite la fase de encuesta
- Mensaje informativo sobre la omisión

### Estudio sin configuración de lanzamiento
- Se duplica estudio, colores, encuestador y encuesta
- Se omite la fase de configuración de lanzamiento
- Mensaje informativo sobre la omisión

### Estudio con errores parciales
- Si fallan colores → continúa con encuestador, encuesta y configuración de lanzamiento
- Si falla encuestador → continúa con encuesta y configuración de lanzamiento
- Si falla encuesta → continúa con configuración de lanzamiento
- Si falla configuración de lanzamiento → mantiene estudio, colores, encuestador y encuesta
- Mensajes informativos sobre qué se completó y qué falló

## Flujo de duplicación completo

```
1. Usuario hace clic en "Duplicar Estudio"
2. Se crea el nuevo estudio con datos básicos
3. Se configuran los colores automáticamente
4. Se verifica si existe encuestador → Si existe, se duplica
5. Se verifica si existe encuesta personalizada → Si existe, se duplica
6. Se verifica si existe configuración de lanzamiento → Si existe, se duplica
7. Se muestra mensaje de éxito completo
8. El nuevo estudio está listo para usar
```

## Consideraciones técnicas

### Manejo de archivos
- Las imágenes del encuestador se crean como archivos PNG vacíos
- Los archivos adjuntos de las preguntas se referencian por URL o file_path
- Se mantiene la estructura de datos original de la encuesta

### Filtrado de preguntas
- Se ignoran automáticamente las 3 preguntas predeterminadas del sistema
- Solo se copian las preguntas personalizadas creadas por el usuario
- Se preservan los pesos, URLs y preguntas de seguimiento

### Configuración de lanzamiento
- Los filtros se copian como JSON string en FormData
- Los módulos se copian como JSON string en FormData
- Los dominios se agregan uno por uno individualmente
- Las preguntas sugeridas se copian como JSON en el body
- El estado del estudio se replica activando/desactivando módulos según corresponda

### Robustez del sistema
- Si falla una fase, se continúa con las siguientes
- Cada fase es independiente y no bloquea las demás
- Se proporciona feedback detallado sobre el progreso
- Los errores se manejan graciosamente sin interrumpir el proceso
- La duplicación de configuración de lanzamiento es completamente asíncrona y robusta
