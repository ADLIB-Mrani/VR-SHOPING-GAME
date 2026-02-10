/**
 * Configuration and Constants
 * Centralized configuration for the VR Shopping Game
 */

const CONFIG = {
    // Application Settings
    APP: {
        NAME: 'VR Shopping Game',
        VERSION: '1.0.0',
        CURRENCY: '€',
        LOCALE: 'fr-FR',
        ORDER_PREFIX: 'VR'
    },

    // Cart Settings
    CART: {
        STORAGE_KEY: 'vr-store-cart',
        ORDERS_KEY: 'vr-store-orders',
        MAX_QUANTITY_PER_ITEM: 99,
        MIN_QUANTITY_PER_ITEM: 1,
        FREE_SHIPPING_THRESHOLD: 100,
        CART_EXPIRY_DAYS: 7
    },

    // VR Environment Settings
    VR: {
        STORE_BOUNDARIES: {
            MIN_X: -9.5,
            MAX_X: 9.5,
            MIN_Z: -9.5,
            MAX_Z: 9.5
        },
        PROXIMITY_DISTANCE: 2.5,
        PROXIMITY_CHECK_INTERVAL: 100
    },

    // Shipping Settings
    SHIPPING: {
        BASE_COST: 5,
        WEIGHT_THRESHOLD: 5,
        COST_PER_KG: 2,
        DEFAULT_DELIVERY_DAYS: 3
    },

    // UI Settings
    UI: {
        NOTIFICATION_DURATION: 2000,
        ANIMATION_DURATION: 300,
        LOADING_DELAY: 500,
        SCENE_INIT_DELAY: 1000
    },

    // Validation Rules
    VALIDATION: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 100,
        ADDRESS_MIN_LENGTH: 5,
        ADDRESS_MAX_LENGTH: 200,
        CITY_MIN_LENGTH: 2,
        CITY_MAX_LENGTH: 100,
        POSTAL_CODE_PATTERN: /^\d{5}$/,
        // French phone number formats accepted:
        // - 0123456789 (10 digits starting with 0)
        // - 01 23 45 67 89 (with spaces)
        // - 01.23.45.67.89 (with dots)
        // - 01-23-45-67-89 (with dashes)
        // - +33 123456789 or 0033 123456789 (international)
        PHONE_PATTERN: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    },

    // Error Messages
    ERRORS: {
        EMPTY_CART: 'Votre panier est vide!',
        INVALID_NAME: 'Nom invalide (2-100 caractères)',
        INVALID_ADDRESS: 'Adresse invalide (5-200 caractères)',
        INVALID_CITY: 'Ville invalide (2-100 caractères)',
        INVALID_POSTAL: 'Code postal invalide (5 chiffres)',
        INVALID_PHONE: 'Numéro de téléphone invalide',
        STORAGE_ERROR: 'Erreur de sauvegarde des données',
        LOAD_ERROR: 'Erreur de chargement',
        PRODUCT_NOT_FOUND: 'Produit introuvable'
    },

    // Success Messages
    SUCCESS: {
        ITEM_ADDED: 'ajouté au panier!',
        ORDER_PLACED: 'Commande confirmée!',
        ITEM_REMOVED: 'Article supprimé du panier'
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.APP);
Object.freeze(CONFIG.CART);
Object.freeze(CONFIG.VR);
Object.freeze(CONFIG.SHIPPING);
Object.freeze(CONFIG.UI);
Object.freeze(CONFIG.VALIDATION);
Object.freeze(CONFIG.ERRORS);
Object.freeze(CONFIG.SUCCESS);
