/**
 * Utility Functions
 * Common helper functions for the VR Shopping Game
 */

/**
 * Sanitizes HTML to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Validates form input against a pattern
 * @param {string} value - Value to validate
 * @param {RegExp} pattern - Regular expression pattern
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if valid
 */
function validateInput(value, pattern, minLength = 0, maxLength = Infinity) {
    if (!value || typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (trimmed.length < minLength || trimmed.length > maxLength) return false;
    if (pattern && !pattern.test(trimmed)) return false;
    return true;
}

/**
 * Validates customer name
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid
 */
function validateName(name) {
    return validateInput(
        name,
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        CONFIG.VALIDATION.NAME_MIN_LENGTH,
        CONFIG.VALIDATION.NAME_MAX_LENGTH
    );
}

/**
 * Validates address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
function validateAddress(address) {
    return validateInput(
        address,
        null,
        CONFIG.VALIDATION.ADDRESS_MIN_LENGTH,
        CONFIG.VALIDATION.ADDRESS_MAX_LENGTH
    );
}

/**
 * Validates city
 * @param {string} city - City to validate
 * @returns {boolean} True if valid
 */
function validateCity(city) {
    return validateInput(
        city,
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        CONFIG.VALIDATION.CITY_MIN_LENGTH,
        CONFIG.VALIDATION.CITY_MAX_LENGTH
    );
}

/**
 * Validates postal code (French format)
 * @param {string} postal - Postal code to validate
 * @returns {boolean} True if valid
 */
function validatePostalCode(postal) {
    return validateInput(postal, CONFIG.VALIDATION.POSTAL_CODE_PATTERN);
}

/**
 * Validates French phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhone(phone) {
    return validateInput(phone, CONFIG.VALIDATION.PHONE_PATTERN);
}

/**
 * Formats a price with currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) return `0${CONFIG.APP.CURRENCY}`;
    return `${price.toFixed(2)}${CONFIG.APP.CURRENCY}`;
}

/**
 * Formats a date in French locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(CONFIG.APP.LOCALE, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Safely gets data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        return JSON.parse(item);
    } catch (e) {
        console.error(`Error reading from storage (${key}):`, e);
        return defaultValue;
    }
}

/**
 * Safely sets data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful
 */
function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error(`Error writing to storage (${key}):`, e);
        return false;
    }
}

/**
 * Safely removes data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if successful
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error(`Error removing from storage (${key}):`, e);
        return false;
    }
}

/**
 * Generates a unique ID using crypto API when available
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
function generateId(prefix = '') {
    // Use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        const uuid = crypto.randomUUID();
        return prefix ? `${prefix}-${uuid}` : uuid;
    }
    
    // Fallback to timestamp + crypto random if available
    const timestamp = Date.now();
    let random;
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        random = array[0].toString(36);
    } else {
        // Final fallback to Math.random (less secure but universal)
        random = Math.random().toString(36).substring(2, 11);
    }
    
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Clamps a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Checks if cart has expired
 * @param {string} timestamp - ISO timestamp string
 * @returns {boolean} True if expired
 */
function isCartExpired(timestamp) {
    if (!timestamp) return false;
    const createdDate = new Date(timestamp);
    const now = new Date();
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
    return daysDiff > CONFIG.CART.CART_EXPIRY_DAYS;
}

/**
 * Escapes special characters for use in RegExp
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function deepClone(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        console.error('Error cloning object:', e);
        return obj;
    }
}

/**
 * Shows a user-friendly error message
 * @param {string} message - Error message
 * @param {Error} error - Optional error object for logging
 */
function handleError(message, error = null) {
    if (error) {
        console.error(message, error);
    }
    if (typeof showNotification === 'function') {
        showNotification(message);
    } else {
        alert(message);
    }
}

/**
 * Validates all form fields
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result with isValid and errors
 */
function validateFormData(formData) {
    const errors = {};
    let isValid = true;

    if (!validateName(formData.name)) {
        errors.name = CONFIG.ERRORS.INVALID_NAME;
        isValid = false;
    }

    if (!validateAddress(formData.address)) {
        errors.address = CONFIG.ERRORS.INVALID_ADDRESS;
        isValid = false;
    }

    if (!validateCity(formData.city)) {
        errors.city = CONFIG.ERRORS.INVALID_CITY;
        isValid = false;
    }

    if (!validatePostalCode(formData.postal)) {
        errors.postal = CONFIG.ERRORS.INVALID_POSTAL;
        isValid = false;
    }

    if (!validatePhone(formData.phone)) {
        errors.phone = CONFIG.ERRORS.INVALID_PHONE;
        isValid = false;
    }

    return { isValid, errors };
}

/**
 * Displays validation errors in the UI
 * @param {Object} errors - Object containing field errors
 */
function displayValidationErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    // Display new errors
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(`customer-${field}`);
        if (input) {
            input.classList.add('input-error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[field];
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
    });
}
