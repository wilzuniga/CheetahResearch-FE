# Funcionalidad de Duplicación de Estudios

## Descripción
Esta funcionalidad permite duplicar un estudio existente, copiando todos sus datos principales y creando una nueva instancia con el título "[Título Original] - COPIA".

## Características
- **Duplicación completa**: Copia todos los datos del estudio original
- **Título automático**: Agrega "- COPIA" al título original
- **Colores preservados**: Mantiene los colores principal y secundario del estudio
- **Encuestador duplicado**: Copia completamente el encuestador asociado al estudio
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
- Se duplicará el estudio, colores y encuestador en secuencia

### 4. Confirmación
- Se mostrará un alert de éxito cuando la duplicación se complete
- El nuevo estudio estará disponible en la lista de estudios
- El encuestador estará completamente configurado en el nuevo estudio

## Proceso de Duplicación

### Fase 1: Duplicación del Estudio
1. **Crear estudio**: Se crea un nuevo estudio con datos copiados
2. **Configurar colores**: Se aplican los colores del estudio original
3. **Verificar éxito**: Se confirma la creación exitosa

### Fase 2: Duplicación del Encuestador
1. **Obtener datos**: Se recupera la información del encuestador original
2. **Verificar existencia**: Se confirma que existe un encuestador para duplicar
3. **Crear encuestador**: Se crea el encuestador en el nuevo estudio
4. **Confirmar éxito**: Se verifica la duplicación completa

### APIs utilizadas en secuencia
- `POST /configuration/createStudy/` - Crear el estudio duplicado
- `POST /configuration/set_colors/{studyId}` - Configurar los colores
- `POST /configuration/getInterviewer/` - Obtener datos del encuestador original
- `POST /configuration/addInterviewer/` - Crear el encuestador duplicado

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
- `js/script_DuplicarEstudio.js` - Lógica principal de duplicación (estudio + encuestador)
- `js/Script_EliminarEstudio.js` - Lógica de eliminación con confirmación
- `InformacionDelEstudio.html` - Página donde aparece el botón de duplicación
- `CreacionDeEstudio.html` - Ya no incluye el script de duplicación

## Requisitos técnicos
- **Axios**: Para las llamadas a la API
- **SessionStorage**: Para obtener los datos del estudio actual
- **Token de autorización**: Para autenticar las solicitudes a la API
- **Fetch API**: Para la eliminación de estudios
- **FormData**: Para el manejo de datos del encuestador

## APIs utilizadas
- `POST /configuration/createStudy/` - Crear el estudio duplicado
- `POST /configuration/set_colors/{studyId}` - Configurar los colores del estudio duplicado
- `POST /configuration/getInterviewer/` - Obtener datos del encuestador original
- `POST /configuration/addInterviewer/` - Crear el encuestador duplicado
- `DELETE /configuration/deleteStudy/` - Eliminar estudio (con confirmación)

## Manejo de errores
- **Estudio no encontrado**: Alert informativo si no hay datos del estudio
- **Error de autorización**: Alert si no hay token válido
- **Error de API**: Alert si falla la creación o configuración de colores
- **Error de encuestador**: Alert si falla la duplicación del encuestador
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
- Confirmación de éxito completo

### Errores y Excepciones
- Errores de API con detalles de respuesta
- Estados HTTP de las solicitudes
- Fallos en la duplicación del encuestador
- Manejo de casos sin encuestador

## Notas importantes
- El botón de duplicación solo funciona cuando hay un estudio seleccionado en sessionStorage
- El botón se habilita/deshabilita automáticamente según el estado del estudio
- Los colores se configuran automáticamente si están disponibles
- El encuestador se duplica completamente, incluyendo imagen de perfil
- Si no hay encuestador en el estudio original, se omite esta fase
- La funcionalidad es independiente de la encuesta (se implementará en futuras versiones)
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

### Problemas con la eliminación
1. Verificar que se haya seleccionado un estudio
2. Confirmar la acción cuando aparezca el alert
3. Revisar la consola para errores específicos
4. Verificar permisos de administrador

## Casos de uso

### Estudio con encuestador completo
- Se duplica todo: estudio, colores y encuestador
- Mensaje de éxito completo
- Nuevo estudio listo para usar

### Estudio sin encuestador
- Se duplica solo el estudio y colores
- Se omite la fase de encuestador
- Mensaje informativo sobre la omisión

### Estudio con errores parciales
- Si fallan los colores, se continúa con el encuestador
- Si falla el encuestador, se mantiene el estudio duplicado
- Mensajes informativos sobre qué se completó y qué falló
