/**
 * Utilidades para manejar study_id por usuario
 * Permite mantener múltiples study_id sin que se sobrescriban entre usuarios
 */

/**
 * Obtiene el ID del usuario actual desde localStorage
 * @returns {string|null} El user_id o null si no existe
 */
function getCurrentUserId() {
    return localStorage.getItem('user_id');
}

/**
 * Guarda el study_id asociado al usuario actual
 * @param {string} studyId - El ID del estudio a guardar
 * @param {string} [userId] - ID del usuario (opcional, si no se proporciona usa el actual)
 */
function setStudyIdForUser(studyId, userId = null) {
    const currentUserId = userId || getCurrentUserId();
    if (!currentUserId) {
        console.error('No se pudo obtener el user_id para guardar el study_id');
        return;
    }
    
    const key = `study_id_${currentUserId}`;
    localStorage.setItem(key, studyId);
    console.log(`Study ID guardado para usuario ${currentUserId}: ${studyId}`);
}

/**
 * Obtiene el study_id del usuario actual
 * @param {string} [userId] - ID del usuario (opcional, si no se proporciona usa el actual)
 * @returns {string|null} El study_id o null si no existe
 */
function getStudyIdForUser(userId = null) {
    const currentUserId = userId || getCurrentUserId();
    if (!currentUserId) {
        console.error('No se pudo obtener el user_id para obtener el study_id');
        return null;
    }
    
    const key = `study_id_${currentUserId}`;
    const studyId = localStorage.getItem(key);
    console.log(`Study ID obtenido para usuario ${currentUserId}: ${studyId}`);
    return studyId;
}

/**
 * Elimina el study_id del usuario actual
 * @param {string} [userId] - ID del usuario (opcional, si no se proporciona usa el actual)
 */
function removeStudyIdForUser(userId = null) {
    const currentUserId = userId || getCurrentUserId();
    if (!currentUserId) {
        console.error('No se pudo obtener el user_id para eliminar el study_id');
        return;
    }
    
    const key = `study_id_${currentUserId}`;
    localStorage.removeItem(key);
    console.log(`Study ID eliminado para usuario ${currentUserId}`);
}

/**
 * Verifica si existe un study_id para el usuario actual
 * @param {string} [userId] - ID del usuario (opcional, si no se proporciona usa el actual)
 * @returns {boolean} true si existe, false en caso contrario
 */
function hasStudyIdForUser(userId = null) {
    const currentUserId = userId || getCurrentUserId();
    if (!currentUserId) {
        return false;
    }
    
    const key = `study_id_${currentUserId}`;
    return localStorage.getItem(key) !== null;
}

/**
 * Función de compatibilidad para mantener el comportamiento actual
 * Obtiene el study_id usando el nuevo sistema pero mantiene la clave 'selectedStudyId' para compatibilidad
 * @returns {string|null} El study_id o null si no existe
 */
function getSelectedStudyId() {
    const studyId = getStudyIdForUser();
    if (studyId) {
        // Mantener compatibilidad guardando también en la clave original
        localStorage.setItem('selectedStudyId', studyId);
    }
    return studyId;
}

/**
 * Función de compatibilidad para mantener el comportamiento actual
 * Guarda el study_id usando el nuevo sistema pero mantiene la clave 'selectedStudyId' para compatibilidad
 * @param {string} studyId - El ID del estudio a guardar
 */
function setSelectedStudyId(studyId) {
    setStudyIdForUser(studyId);
    // Mantener compatibilidad guardando también en la clave original
    localStorage.setItem('selectedStudyId', studyId);
}

// Exportar funciones para uso global
window.getCurrentUserId = getCurrentUserId;
window.setStudyIdForUser = setStudyIdForUser;
window.getStudyIdForUser = getStudyIdForUser;
window.removeStudyIdForUser = removeStudyIdForUser;
window.hasStudyIdForUser = hasStudyIdForUser;
window.getSelectedStudyId = getSelectedStudyId;
window.setSelectedStudyId = setSelectedStudyId; 