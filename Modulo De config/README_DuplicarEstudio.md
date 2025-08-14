# Funcionalidad de Duplicación de Estudios

## Descripción
Esta funcionalidad permite duplicar un estudio existente, copiando todos sus datos principales y creando una nueva instancia con el título "[Título Original] - COPIA".

## Características
- **Duplicación completa**: Copia todos los datos del estudio original
- **Título automático**: Agrega "- COPIA" al título original
- **Colores preservados**: Mantiene los colores principal y secundario del estudio
- **Interfaz intuitiva**: Botón visible en la página de información del estudio
- **Confirmación de eliminación**: Alert de confirmación antes de eliminar estudios

## Datos que se copian
1. **Título del estudio** (con sufijo "- COPIA")
2. **Mercado objetivo**
3. **Objetivos del estudio**
4. **Prompt del estudio**
5. **Color principal del estudio**
6. **Color secundario del estudio**

## Cómo usar

### 1. Acceder a la página de información del estudio
- Navega a la página de información del estudio (`/configuration/studyInfo/`)
- Asegúrate de que haya un estudio seleccionado

### 2. Localizar el botón de duplicación
- El botón "🔄 Duplicar Estudio" está ubicado en la sección de botones
- Se posiciona después del botón "Borrar Archivos"
- Está habilitado solo cuando hay un estudio seleccionado

### 3. Ejecutar la duplicación
- Haz clic en el botón "🔄 Duplicar Estudio"
- El sistema procesará la solicitud automáticamente

### 4. Confirmación
- Se mostrará un alert de éxito cuando la duplicación se complete
- El nuevo estudio estará disponible en la lista de estudios

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
- `js/script_DuplicarEstudio.js` - Lógica principal de duplicación
- `js/Script_EliminarEstudio.js` - Lógica de eliminación con confirmación
- `InformacionDelEstudio.html` - Página donde aparece el botón de duplicación
- `CreacionDeEstudio.html` - Ya no incluye el script de duplicación

## Requisitos técnicos
- **Axios**: Para las llamadas a la API
- **SessionStorage**: Para obtener los datos del estudio actual
- **Token de autorización**: Para autenticar las solicitudes a la API
- **Fetch API**: Para la eliminación de estudios

## APIs utilizadas
- `POST /configuration/createStudy/` - Crear el estudio duplicado
- `POST /configuration/set_colors/{studyId}` - Configurar los colores del estudio duplicado
- `DELETE /configuration/deleteStudy/` - Eliminar estudio (con confirmación)

## Manejo de errores
- **Estudio no encontrado**: Alert informativo si no hay datos del estudio
- **Error de autorización**: Alert si no hay token válido
- **Error de API**: Alert si falla la creación o configuración de colores
- **Confirmación cancelada**: La eliminación se detiene si el usuario cancela
- **Validación de selección**: Alert si no se selecciona un estudio para eliminar

## Logs de consola
El sistema genera logs detallados en la consola del navegador para facilitar el debugging:
- Inicialización de la funcionalidad
- Configuración del botón de duplicación
- Proceso de duplicación
- Configuración de colores
- Confirmación de eliminación
- Errores y excepciones

## Notas importantes
- El botón de duplicación solo funciona cuando hay un estudio seleccionado en sessionStorage
- El botón se habilita/deshabilita automáticamente según el estado del estudio
- Los colores se configuran automáticamente si están disponibles
- La funcionalidad es independiente del encuestador y la encuesta (se implementará en futuras versiones)
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

### Problemas con la eliminación
1. Verificar que se haya seleccionado un estudio
2. Confirmar la acción cuando aparezca el alert
3. Revisar la consola para errores específicos
4. Verificar permisos de administrador
