# Sistema de Manejo de Study ID por Usuario

## Descripción

Este sistema permite manejar múltiples `study_id` sin que se sobrescriban entre usuarios. Cada usuario tiene su propio `study_id` almacenado con una clave única que incluye su identificador.

## Ventajas

- **Múltiples usuarios**: Cada usuario puede tener su propio `study_id` sin interferir con otros
- **Compatibilidad**: Mantiene compatibilidad con el código existente
- **Seguridad**: Los datos están aislados por usuario
- **Flexibilidad**: Permite especificar usuarios específicos o usar el usuario actual

## Funciones Disponibles

### Funciones Principales

#### `getCurrentUserId()`
Obtiene el ID del usuario actual desde localStorage.
```javascript
const userId = getCurrentUserId();
```

#### `setStudyIdForUser(studyId, userId = null)`
Guarda el `study_id` asociado al usuario actual o a un usuario específico.
```javascript
// Para el usuario actual
setStudyIdForUser('abc123');

// Para un usuario específico
setStudyIdForUser('def789', 'user_456');
```

#### `getStudyIdForUser(userId = null)`
Obtiene el `study_id` del usuario actual o de un usuario específico.
```javascript
// Para el usuario actual
const studyId = getStudyIdForUser();

// Para un usuario específico
const studyId = getStudyIdForUser('user_456');
```

#### `removeStudyIdForUser(userId = null)`
Elimina el `study_id` del usuario actual o de un usuario específico.
```javascript
// Para el usuario actual
removeStudyIdForUser();

// Para un usuario específico
removeStudyIdForUser('user_456');
```

#### `hasStudyIdForUser(userId = null)`
Verifica si existe un `study_id` para el usuario actual o un usuario específico.
```javascript
// Para el usuario actual
const existe = hasStudyIdForUser();

// Para un usuario específico
const existe = hasStudyIdForUser('user_456');
```

### Funciones de Compatibilidad

#### `getSelectedStudyId()`
Función de compatibilidad que obtiene el `study_id` usando el nuevo sistema pero mantiene la clave `selectedStudyId` para compatibilidad.
```javascript
const studyId = getSelectedStudyId();
```

#### `setSelectedStudyId(studyId)`
Función de compatibilidad que guarda el `study_id` usando el nuevo sistema pero mantiene la clave `selectedStudyId` para compatibilidad.
```javascript
setSelectedStudyId('abc123');
```

## Estructura de Almacenamiento

El sistema utiliza claves únicas para cada usuario:

```
localStorage:
├── user_id: "user_123"
├── study_id_user_123: "abc123"
├── study_id_user_456: "def789"
└── selectedStudyId: "abc123" (compatibilidad)
```

## Ejemplos de Uso

### Ejemplo Básico
```javascript
// Obtener el usuario actual
const userId = getCurrentUserId();

// Guardar study_id para el usuario actual
setStudyIdForUser('abc123');

// Obtener study_id del usuario actual
const studyId = getStudyIdForUser();
```

### Ejemplo con Múltiples Usuarios
```javascript
// Guardar study_id para diferentes usuarios
setStudyIdForUser('study_001', 'user_1');
setStudyIdForUser('study_002', 'user_2');
setStudyIdForUser('study_003', 'user_3');

// Obtener study_id de cada usuario
const study1 = getStudyIdForUser('user_1'); // "study_001"
const study2 = getStudyIdForUser('user_2'); // "study_002"
const study3 = getStudyIdForUser('user_3'); // "study_003"
```

### Ejemplo de Migración
```javascript
// Migrar desde el sistema anterior
const studyIdAnterior = localStorage.getItem('selectedStudyId');
if (studyIdAnterior) {
    setStudyIdForUser(studyIdAnterior);
    // Opcional: eliminar el anterior
    // localStorage.removeItem('selectedStudyId');
}
```

## Integración en el Proyecto

### 1. Incluir el archivo
Agregar el script en las páginas HTML:
```html
<script src="js/studyIdManager.js"></script>
```

### 2. Reemplazar llamadas existentes
Cambiar las llamadas existentes:
```javascript
// Antes
localStorage.setItem('selectedStudyId', studyId);
const studyId = localStorage.getItem('selectedStudyId');
localStorage.removeItem('selectedStudyId');

// Después
setStudyIdForUser(studyId);
const studyId = getStudyIdForUser();
removeStudyIdForUser();
```

### 3. Mantener compatibilidad
El sistema mantiene compatibilidad automática con el código existente, por lo que no es necesario cambiar todas las llamadas de inmediato.

## Consideraciones

### Ventajas
- ✅ Múltiples `study_id` sin conflictos
- ✅ Compatibilidad con código existente
- ✅ Aislamiento de datos por usuario
- ✅ Fácil migración

### Desventajas
- ⚠️ Requiere que siempre sepas el ID del usuario activo
- ⚠️ Aumenta ligeramente la complejidad del código
- ⚠️ Necesita incluir el archivo de utilidades en todas las páginas

## Archivos Modificados

- `Modulo De config/js/studyIdManager.js` - Nuevo archivo de utilidades
- `Modulo De config/js/script_PPCrearEstudio.js` - Actualizado para usar el nuevo sistema
- `Modulo De config/js/Script_LogOutAuth.js` - Actualizado para limpiar datos del usuario
- `Modulo De config/PaginaPrincipal.html` - Incluye el nuevo script
- `Modulo De config/LanzarEstudio.html` - Incluye el nuevo script
- `Modulo Analisis De Datos/AnalisisDeDatos.html` - Incluye el nuevo script

## Pruebas

Para probar el sistema, puedes usar la consola del navegador:

```javascript
// Ejecutar ejemplos
ejecutarEjemplos();

// Probar funciones individuales
setStudyIdForUser('test_123');
console.log(getStudyIdForUser());
``` 