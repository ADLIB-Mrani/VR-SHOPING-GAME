/**
 * VR Shopping Game Configuration
 */

const CONFIG = {
    // Application info
    app: {
        name: 'VR Shopping Game',
        version: '1.0.0',
        author: 'ADLIB-Mrani'
    },

    // API Configuration
    api: {
        baseURL: 'https://api.vr-store.com',
        timeout: 30000,
        retries: 3
    },

    // Delivery Configuration
    delivery: {
        defaultCountry: 'France',
        freeShippingThreshold: 100, // in EUR
        baseShippingCost: 5,
        weightPricePerKg: 2,
        carriers: ['Colissimo', 'Chronopost', 'DHL', 'UPS']
    },

    // VR Settings
    vr: {
        enableVR: true,
        enableAR: false,
        cameraHeight: 1.6,
        movementSpeed: 0.1,
        defaultFOV: 80
    },

    // Store Configuration
    store: {
        currency: 'EUR',
        locale: 'fr-FR',
        taxRate: 0.20, // 20% VAT
        enableNotifications: true,
        autoSaveCart: true
    },

    // Product Categories
    categories: [
        { id: 'electronics', name: 'Électronique', icon: '💻' },
        { id: 'clothing', name: 'Vêtements', icon: '👕' },
        { id: 'home', name: 'Décoration', icon: '🏠' },
        { id: 'food', name: 'Alimentation', icon: '🍫' }
    ],

    // UI Settings
    ui: {
        theme: 'modern',
        animationDuration: 300,
        notificationDuration: 2000,
        cartPosition: 'right'
    },

    // Analytics (optional)
    analytics: {
        enabled: false,
        trackingId: ''
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
