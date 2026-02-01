/**
 * Security Utilities for Event Management Website
 * Implements input validation, sanitization, and XSS protection
 */

const SecurityUtils = {
    /**
     * Sanitize input to prevent XSS attacks
     * @param {string} input - User input string
     * @returns {string} - Sanitized string
     */
    sanitizeInput: function(input) {
        if (typeof input !== 'string') {
            return '';
        }

        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        return input.replace(/[&<>"'`=\/]/g, (char) => map[char]);
    },

    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid
     */
    validateEmail: function(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const maxLength = 254; // RFC 5321
        
        if (email.length > maxLength) {
            return false;
        }

        // Additional security: prevent dangerous patterns
        const dangerousPatterns = [
            /javascript:/i,
            /on\w+\s*=/i,
            /<script/i,
            /<iframe/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(email)) {
                return false;
            }
        }

        return emailRegex.test(email.trim());
    },

    /**
     * Validate phone number (Indian format)
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - True if valid
     */
    validatePhone: function(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }

        // Remove spaces, dashes, and parentheses
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        
        // Indian phone number validation: 10 digits, optionally with +91 prefix
        const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
        
        return phoneRegex.test(cleaned) && cleaned.length <= 13;
    },

    /**
     * Validate name (letters, spaces, and common name characters only)
     * @param {string} name - Name to validate
     * @returns {boolean} - True if valid
     */
    validateName: function(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }

        const trimmed = name.trim();
        
        // Check length
        if (trimmed.length < 2 || trimmed.length > 100) {
            return false;
        }

        // Allow letters, spaces, hyphens, apostrophes, and periods
        const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
        
        if (!nameRegex.test(trimmed)) {
            return false;
        }

        // Check for dangerous patterns
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /eval\(/i,
            /expression\(/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(trimmed)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Validate message/textarea content
     * @param {string} message - Message to validate
     * @returns {boolean} - True if valid
     */
    validateMessage: function(message) {
        if (!message || typeof message !== 'string') {
            return false;
        }

        // Check length
        if (message.length > 5000) {
            return false;
        }

        // Check for dangerous patterns
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /eval\(/i,
            /expression\(/i,
            /vbscript:/i,
            /data:text\/html/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(message)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Validate number input
     * @param {string|number} value - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} - True if valid
     */
    validateNumber: function(value, min = 1, max = 100000) {
        const num = parseInt(value, 10);
        
        if (isNaN(num)) {
            return false;
        }

        return num >= min && num <= max;
    },

    /**
     * Validate date (must be in future or today)
     * @param {string} date - Date string to validate
     * @returns {boolean} - True if valid
     */
    validateDate: function(date) {
        if (!date) {
            return true; // Optional field
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(selectedDate.getTime())) {
            return false;
        }

        // Allow today or future dates
        return selectedDate >= today;
    },

    /**
     * Generate CSRF token (client-side implementation)
     * @returns {string} - Random token
     */
    generateCSRFToken: function() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Rate limiting check (simple implementation)
     */
    rateLimit: {
        requests: {},
        
        check: function(identifier, maxRequests = 5, timeWindow = 60000) {
            const now = Date.now();
            
            if (!this.requests[identifier]) {
                this.requests[identifier] = [];
            }

            // Remove old requests outside the time window
            this.requests[identifier] = this.requests[identifier].filter(
                timestamp => now - timestamp < timeWindow
            );

            // Check if limit exceeded
            if (this.requests[identifier].length >= maxRequests) {
                return false;
            }

            // Add current request
            this.requests[identifier].push(now);
            return true;
        },

        reset: function(identifier) {
            delete this.requests[identifier];
        }
    },

    /**
     * Content Security Policy violation handler
     */
    handleCSPViolation: function(event) {
        console.error('CSP Violation:', event);
        // In production, send to logging service
    }
};

// Set up CSP violation reporting
if (typeof window !== 'undefined') {
    document.addEventListener('securitypolicyviolation', SecurityUtils.handleCSPViolation);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
}
