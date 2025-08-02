/**
 * Ejemplo de uso del nuevo sistema de study_id por usuario
 * 
 * Este archivo muestra cómo usar las nuevas funciones para manejar
 * múltiples study_id sin que se sobrescriban entre usuarios.
 */

// Ejemplo 1: Guardar un study_id para el usuario actual
function ejemploGuardarStudyId() {
    const userId = getCurrentUserId(); // Obtiene el user_id del localStorage
    console.log('Usuario actual:', userId);
    
    // Guardar un study_id para el usuario actual
    setStudyIdForUser('abc123');
    
    // Verificar que se guardó correctamente
    const studyId = getStudyIdForUser();
    console.log('Study ID guardado:', studyId);
}

// Ejemplo 2: Guardar study_id para un usuario específico
function ejemploGuardarStudyIdParaUsuarioEspecifico() {
    const userIdEspecifico = 'user_456';
    setStudyIdForUser('def789', userIdEspecifico);
    
    // Verificar que se guardó para el usuario específico
    const studyId = getStudyIdForUser(userIdEspecifico);
    console.log(`Study ID para usuario ${userIdEspecifico}:`, studyId);
}

// Ejemplo 3: Verificar si existe un study_id
function ejemploVerificarStudyId() {
    const existe = hasStudyIdForUser();
    console.log('¿Existe study_id para el usuario actual?', existe);
}

// Ejemplo 4: Eliminar study_id
function ejemploEliminarStudyId() {
    removeStudyIdForUser();
    console.log('Study ID eliminado para el usuario actual');
}

// Ejemplo 5: Usar las funciones de compatibilidad
function ejemploCompatibilidad() {
    // Estas funciones mantienen compatibilidad con el código existente
    setSelectedStudyId('xyz999');
    const studyId = getSelectedStudyId();
    console.log('Study ID usando compatibilidad:', studyId);
}

// Ejemplo 6: Manejar múltiples usuarios
function ejemploMultiplesUsuarios() {
    // Simular diferentes usuarios
    const usuarios = ['user_1', 'user_2', 'user_3'];
    const studyIds = ['study_001', 'study_002', 'study_003'];
    
    // Guardar study_id para cada usuario
    usuarios.forEach((usuario, index) => {
        setStudyIdForUser(studyIds[index], usuario);
    });
    
    // Verificar que cada usuario tiene su propio study_id
    usuarios.forEach(usuario => {
        const studyId = getStudyIdForUser(usuario);
        console.log(`Usuario ${usuario} tiene study_id: ${studyId}`);
    });
}

// Ejemplo 7: Migración desde el sistema anterior
function ejemploMigracion() {
    // Si existe un study_id en el sistema anterior, migrarlo al nuevo
    const studyIdAnterior = localStorage.getItem('selectedStudyId');
    if (studyIdAnterior) {
        console.log('Migrando study_id anterior:', studyIdAnterior);
        setStudyIdForUser(studyIdAnterior);
        
        // Opcional: eliminar el anterior
        // localStorage.removeItem('selectedStudyId');
    }
}

// Función para ejecutar todos los ejemplos
function ejecutarEjemplos() {
    console.log('=== Ejemplos del nuevo sistema de study_id por usuario ===');
    
    ejemploGuardarStudyId();
    ejemploGuardarStudyIdParaUsuarioEspecifico();
    ejemploVerificarStudyId();
    ejemploEliminarStudyId();
    ejemploCompatibilidad();
    ejemploMultiplesUsuarios();
    ejemploMigracion();
    
    console.log('=== Fin de ejemplos ===');
}

// Exportar para uso global
window.ejecutarEjemplos = ejecutarEjemplos; 