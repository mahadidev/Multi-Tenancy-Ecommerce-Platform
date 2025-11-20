/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date string for display in tables
 * Handles various date formats and invalid dates gracefully
 */
export const formatTableDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    // Try to parse the date as-is first
    let date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        // Try parsing with space replaced by 'T' (for MySQL datetime format)
        const isoString = dateString.replace(/\s/, 'T');
        date = new Date(isoString);
        
        if (isNaN(date.getTime())) {
            // If still invalid, try other common formats
            const formats = [
                dateString.replace(/-/g, '/'), // Replace hyphens with slashes
                dateString.split(' ')[0], // Take only the date part
                dateString.replace(/T/, ' ') // Replace T with space
            ];
            
            for (const format of formats) {
                if (format) {
                    const testDate = new Date(format);
                    if (!isNaN(testDate.getTime())) {
                        date = testDate;
                        break;
                    }
                }
            }
            
            // If still invalid, return the original string
            if (isNaN(date.getTime())) {
                return dateString;
            }
        }
    }
    
    return date.toLocaleDateString();
};

/**
 * Format a date string with time for detailed views
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return formatTableDate(dateString);
    }
    
    return date.toLocaleString();
};

/**
 * Format a date string in ISO format (YYYY-MM-DD)
 */
export const formatDateISO = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return '';
    }
    
    const isoString = date.toISOString();
    return isoString.split('T')[0] || '';
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return formatTableDate(dateString);
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
        return date.toLocaleDateString();
    }
};