// CSV Export Utilities for Cheetah Research Platform
// This file contains shared functions for CSV export with proper UTF-8 encoding

/**
 * Escapes text for CSV format
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text safe for CSV
 */
function escapeCSV(text) {
    if (text === null || text === undefined) return '';
    // Convert to string and escape double quotes
    let escaped = String(text).replace(/"/g, '""');
    // Replace newlines and carriage returns with spaces
    escaped = escaped.replace(/\n/g, ' ').replace(/\r/g, ' ');
    return escaped;
}

/**
 * Creates a CSV blob with proper UTF-8 encoding
 * @param {string} content - The CSV content
 * @returns {Blob} - Blob with UTF-8 BOM and proper MIME type
 */
function createCSVBlob(content) {
    // Add BOM for UTF-8 if content doesn't already have it
    let csvContent = content;
    if (!content.startsWith('\uFEFF')) {
        csvContent = '\uFEFF' + content;
    }
    
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Downloads a CSV file with proper UTF-8 encoding
 * @param {string} content - The CSV content
 * @param {string} filename - The filename for the download
 */
function downloadCSV(content, filename) {
    const blob = createCSVBlob(content);
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
    }
}

/**
 * Sanitizes a filename for safe download
 * @param {string} filename - The original filename
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/\s+/g, '_').replace(/[\/\\?*:|"<>]/g, '');
}

/**
 * Gets study name from sessionStorage
 * @returns {string} - Study name or default
 */
function getStudyName() {
    let studyName = '';
    try {
        const studyData = JSON.parse(sessionStorage.getItem('selectedStudyData'));
        studyName = studyData && studyData.title ? studyData.title : 'Estudio';
    } catch (e) {
        studyName = 'Estudio';
    }
    return studyName.replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        escapeCSV,
        createCSVBlob,
        downloadCSV,
        sanitizeFilename,
        getStudyName
    };
} else {
    // Browser environment - make functions globally available
    window.csvUtils = {
        escapeCSV,
        createCSVBlob,
        downloadCSV,
        sanitizeFilename,
        getStudyName
    };
} 