/**
 * Event System
 * Centralized event bus for game-wide communication
 * Based on Observer/PubSub pattern from game development
 */

class EventBus {
    constructor() {
        this.events = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 100;
        this.debugMode = false;
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     * @param {Object} context - Context for callback execution
     * @returns {Function} Unsubscribe function
     */
    on(eventName, callback, context = null) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        const listener = { callback, context };
        this.events.get(eventName).push(listener);

        if (this.debugMode) {
            console.log(`[EventBus] Subscribed to: ${eventName}`);
        }

        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }

    /**
     * Subscribe to an event once
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     * @param {Object} context - Context for callback execution
     * @returns {Function} Unsubscribe function
     */
    once(eventName, callback, context = null) {
        const onceCallback = (...args) => {
            this.off(eventName, onceCallback);
            callback.apply(context, args);
        };

        return this.on(eventName, onceCallback, context);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback to remove
     */
    off(eventName, callback) {
        if (!this.events.has(eventName)) {
            return;
        }

        const listeners = this.events.get(eventName);
        const index = listeners.findIndex(listener => listener.callback === callback);

        if (index > -1) {
            listeners.splice(index, 1);
            
            if (this.debugMode) {
                console.log(`[EventBus] Unsubscribed from: ${eventName}`);
            }
        }

        // Remove event if no listeners left
        if (listeners.length === 0) {
            this.events.delete(eventName);
        }
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {*} data - Data to pass to listeners
     */
    emit(eventName, data = null) {
        if (this.debugMode) {
            console.log(`[EventBus] Emitting: ${eventName}`, data);
        }

        // Add to history
        this.addToHistory(eventName, data);

        // Get listeners
        const listeners = this.events.get(eventName);
        if (!listeners || listeners.length === 0) {
            return;
        }

        // Call all listeners
        for (const listener of listeners) {
            try {
                if (listener.context) {
                    listener.callback.call(listener.context, data);
                } else {
                    listener.callback(data);
                }
            } catch (error) {
                console.error(`[EventBus] Error in ${eventName} listener:`, error);
            }
        }
    }

    /**
     * Remove all listeners for an event
     * @param {string} eventName - Name of the event
     */
    clear(eventName) {
        if (eventName) {
            this.events.delete(eventName);
        } else {
            this.events.clear();
        }
    }

    /**
     * Get number of listeners for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of listeners
     */
    listenerCount(eventName) {
        const listeners = this.events.get(eventName);
        return listeners ? listeners.length : 0;
    }

    /**
     * Add event to history
     * @param {string} eventName - Event name
     * @param {*} data - Event data
     */
    addToHistory(eventName, data) {
        this.eventHistory.push({
            name: eventName,
            data,
            timestamp: Date.now()
        });

        // Keep history size under limit
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }

    /**
     * Get event history
     * @param {number} count - Number of recent events to return
     * @returns {Array} Event history
     */
    getHistory(count = 10) {
        return this.eventHistory.slice(-count);
    }

    /**
     * Enable debug mode
     */
    enableDebug() {
        this.debugMode = true;
        console.log('[EventBus] Debug mode enabled');
    }

    /**
     * Disable debug mode
     */
    disableDebug() {
        this.debugMode = false;
        console.log('[EventBus] Debug mode disabled');
    }

    /**
     * Get all registered event names
     * @returns {Array} Array of event names
     */
    getEventNames() {
        return Array.from(this.events.keys());
    }
}

// Game Event Types
const GameEvents = Object.freeze({
    // State events
    STATE_CHANGED: 'state:changed',
    GAME_READY: 'game:ready',
    GAME_START: 'game:start',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    
    // Shopping events
    PRODUCT_CLICKED: 'product:clicked',
    PRODUCT_ADDED: 'product:added',
    PRODUCT_REMOVED: 'product:removed',
    CART_UPDATED: 'cart:updated',
    CART_CLEARED: 'cart:cleared',
    
    // Order events
    ORDER_PLACED: 'order:placed',
    ORDER_CONFIRMED: 'order:confirmed',
    ORDER_HISTORY_OPENED: 'order:history:opened',
    
    // UI events
    UI_NOTIFICATION: 'ui:notification',
    UI_MODAL_OPENED: 'ui:modal:opened',
    UI_MODAL_CLOSED: 'ui:modal:closed',
    
    // Search & Filter events
    SEARCH_QUERY: 'search:query',
    FILTER_CHANGED: 'filter:changed',
    
    // Performance events
    FPS_UPDATE: 'perf:fps',
    PERFORMANCE_WARNING: 'perf:warning',
    
    // Error events
    ERROR: 'error',
    WARNING: 'warning'
});

// Create global event bus instance
const eventBus = new EventBus();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventBus, GameEvents, eventBus };
}
