// PDF validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const ALLOWED_MIME_TYPES = ['application/pdf'];
export const ALLOWED_FILE_EXTENSIONS = ['.pdf'];

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates if a file is a valid PDF within size limits
 */
export function validatePdfFile(file: File): ValidationResult {
    // Check if file exists
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Only PDF files are supported. Received: ${file.type}`,
        };
    }

    // Check file extension
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
        return {
            valid: false,
            error: `Invalid file extension. Only .pdf files are supported. Received: ${fileExtension}`,
        };
    }

    return { valid: true };
}

/**
 * Validates PDF buffer (server-side validation)
 */
export function validatePdfBuffer(buffer: Buffer, filename: string): ValidationResult {
    // Check buffer size
    if (buffer.length > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds 10MB limit. Current size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`,
        };
    }

    // Check PDF magic number (PDF files start with %PDF-)
    const pdfHeader = buffer.slice(0, 5).toString('utf-8');
    if (!pdfHeader.startsWith('%PDF-')) {
        return {
            valid: false,
            error: 'Invalid PDF file. File does not have a valid PDF header.',
        };
    }

    // Check file extension
    const fileExtension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
        return {
            valid: false,
            error: `Invalid file extension. Only .pdf files are supported. Received: ${fileExtension}`,
        };
    }

    return { valid: true };
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
