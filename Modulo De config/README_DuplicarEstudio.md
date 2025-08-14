# Funcionalidad de Duplicación de Estudios

## Descripción
Esta funcionalidad permite duplicar un estudio existente, copiando todos sus datos principales y creando una nueva instancia con el título "[Título Original] - COPIA".

## Características
- **Duplicación completa**: Copia todos los datos del estudio original
- **Título automático**: Agrega "- COPIA" al título original
- **Colores preservados**: Mantiene los colores principal y secundario del estudio
- **Interfaz intuitiva**: Botón visible en la página de información del estudio

## Datos que se copian
1. **Título del estudio** (con sufijo "- COPIA")
2. **Mercado objetivo**
3. **Objetivos del estudio**
4. **Prompt del estudio**
5. **Color principal del estudio**
6. **Color secundario del estudio**

## Cómo usar

### 1. Acceder a la página del estudio
- Navega a la página de información del estudio
- Asegúrate de que haya un estudio seleccionado

### 2. Localizar el botón de duplicación
- El botón "🔄 Duplicar Estudio" aparecerá automáticamente
- Se posiciona después del botón "Actualizar Estudio"

### 3. Ejecutar la duplicación
- Haz clic en el botón "🔄 Duplicar Estudio"
- El sistema procesará la solicitud automáticamente

### 4. Confirmación
- Se mostrará un alert de éxito cuando la duplicación se complete
- El nuevo estudio estará disponible en la lista de estudios

## Archivos involucrados
- `js/script_DuplicarEstudio.js` - Lógica principal de duplicación
- `CreacionDeEstudio.html` - Página donde aparece el botón
- `InformacionDelEstudio.html` - Página que incluye el script

## Requisitos técnicos
- **Axios**: Para las llamadas a la API
- **SessionStorage**: Para obtener los datos del estudio actual
- **Token de autorización**: Para autenticar las solicitudes a la API

## APIs utilizadas
- `POST /configuration/createStudy/` - Crear el estudio duplicado
- `POST /configuration/set_colors/{studyId}` - Configurar los colores del estudio duplicado

## Manejo de errores
- **Estudio no encontrado**: Alert informativo si no hay datos del estudio
- **Error de autorización**: Alert si no hay token válido
- **Error de API**: Alert si falla la creación o configuración de colores
- **Timeout**: Sistema de timeout para evitar bucles infinitos

## Logs de consola
El sistema genera logs detallados en la consola del navegador para facilitar el debugging:
- Inicialización de la funcionalidad
- Búsqueda del formulario
- Agregado del botón
- Proceso de duplicación
- Configuración de colores
- Errores y excepciones

## Notas importantes
- Solo funciona cuando hay un estudio seleccionado en sessionStorage
- El botón se agrega automáticamente después de que el formulario se renderice
- Los colores se configuran automáticamente si están disponibles
- La funcionalidad es independiente del encuestador y la encuesta (se implementará en futuras versiones)

## Solución de problemas

### El botón no aparece
1. Verificar que estés en la página correcta (`/configuration/study/`)
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
