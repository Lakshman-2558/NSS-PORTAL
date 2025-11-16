import toast from 'react-hot-toast';

/**
 * Universal download helper for both images (certificates) and PDFs (reports)
 * Handles mobile and desktop devices appropriately
 * 
 * @param {string} fileUrl - The URL of the file to download (Cloudinary or other)
 * @param {string} fileName - The desired filename for download
 * @param {string} fileType - 'image' or 'pdf' (optional, auto-detected if not provided)
 */
export const downloadFile = (fileUrl, fileName, fileType = null) => {
    try {
        // Detect mobile devices
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Auto-detect file type if not provided
        if (!fileType) {
            if (fileUrl.includes('.pdf') || fileUrl.includes('resource_type/raw')) {
                fileType = 'pdf';
            } else if (fileUrl.includes('.png') || fileUrl.includes('.jpg') || fileUrl.includes('.jpeg')) {
                fileType = 'image';
            } else {
                fileType = 'image'; // default
            }
        }

        console.log(`📥 Download request: ${fileName} (${fileType}) on ${isMobile ? 'mobile' : 'desktop'}`);

        if (isMobile) {
            // Mobile: Open in new tab for viewing
            window.open(fileUrl, '_blank', 'noopener,noreferrer');

            if (fileType === 'pdf') {
                toast.success('PDF opened! Use browser menu to download.');
            } else {
                toast.success('Certificate opened! Long press to save image.');
            }
        } else {
            // Desktop: Force download
            let downloadUrl = fileUrl;

            // For Cloudinary URLs, add fl_attachment flag to force download
            if (fileUrl.includes('cloudinary.com')) {
                // Check if URL already has transformations
                if (fileUrl.includes('/upload/')) {
                    // Insert fl_attachment after /upload/
                    downloadUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
                }
            }

            // Create temporary link and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Download started!');
        }
    } catch (error) {
        console.error('Download error:', error);
        // Fallback: open in new tab
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
        toast.error('Could not download. File opened in new tab.');
    }
};

/**
 * View file in new tab (for both mobile and desktop)
 * 
 * @param {string} fileUrl - The URL of the file to view
 */
export const viewFile = (fileUrl) => {
    try {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('View error:', error);
        toast.error('Could not open file');
    }
};

/**
 * Download certificate (PNG image)
 * 
 * @param {object} certificate - Certificate object with url and event details
 */
export const downloadCertificate = (certificate) => {
    const fileName = `Certificate_${certificate.event.title.replace(/\s+/g, '_')}.png`;
    downloadFile(certificate.certificate.url, fileName, 'image');
};

/**
 * Download report (PDF document)
 * 
 * @param {object} report - Report object with url and event details
 */
export const downloadReport = (report) => {
    const fileName = `Report_${report.event?.title?.replace(/\s+/g, '_') || 'Document'}.pdf`;
    downloadFile(report.url || report.fileUrl, fileName, 'pdf');
};

/**
 * Check if file is accessible (useful for validation)
 * 
 * @param {string} fileUrl - The URL to check
 * @returns {Promise<boolean>} - True if accessible, false otherwise
 */
export const isFileAccessible = async (fileUrl) => {
    try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('File accessibility check failed:', error);
        return false;
    }
};

/**
 * Get file extension from URL
 * 
 * @param {string} fileUrl - The URL to parse
 * @returns {string} - File extension (e.g., 'png', 'pdf')
 */
export const getFileExtension = (fileUrl) => {
    try {
        const url = new URL(fileUrl);
        const pathname = url.pathname;
        const extension = pathname.split('.').pop().toLowerCase();
        return extension;
    } catch (error) {
        return '';
    }
};

/**
 * Format file size for display
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., '2.5 MB')
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const downloadHelpers = {
    downloadFile,
    viewFile,
    downloadCertificate,
    downloadReport,
    isFileAccessible,
    getFileExtension,
    formatFileSize
};

export default downloadHelpers;
