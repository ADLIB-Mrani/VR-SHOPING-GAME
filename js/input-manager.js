/**
 * Input Management System
 * Centralized input handling for keyboard, mouse, and VR controllers
 * Based on game development input handling patterns
 */

class InputManager {
    constructor() {
        // Keyboard state
        this.keys = new Map();
        this.keysPressed = new Set();
        this.keysReleased = new Set();
        
        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            deltaX: 0,
            deltaY: 0,
            buttons: new Map(),
            wheel: 0
        };
        
        // Touch state
        this.touches = new Map();
        
        // VR controller state (if available)
        this.vrControllers = new Map();
        
        // Input bindings
        this.bindings = new Map();
        
        // Event listeners cleanup
        this.eventListeners = [];
        
        // Initialize
        this.init();
    }

    /**
     * Initialize input listeners
     */
    init() {
        // Keyboard events
        this.addListener(window, 'keydown', (e) => this.onKeyDown(e));
        this.addListener(window, 'keyup', (e) => this.onKeyUp(e));
        
        // Mouse events
        this.addListener(window, 'mousemove', (e) => this.onMouseMove(e));
        this.addListener(window, 'mousedown', (e) => this.onMouseDown(e));
        this.addListener(window, 'mouseup', (e) => this.onMouseUp(e));
        this.addListener(window, 'wheel', (e) => this.onMouseWheel(e));
        
        // Touch events
        this.addListener(window, 'touchstart', (e) => this.onTouchStart(e));
        this.addListener(window, 'touchmove', (e) => this.onTouchMove(e));
        this.addListener(window, 'touchend', (e) => this.onTouchEnd(e));
        
        // Focus events
        this.addListener(window, 'blur', () => this.onWindowBlur());

        console.log('[InputManager] Initialized');
    }

    /**
     * Add event listener and track for cleanup
     * @param {Element} element - Element to attach listener to
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    addListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    /**
     * Handle key down
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        const key = event.key.toLowerCase();
        
        if (!this.keys.get(key)) {
            this.keysPressed.add(key);
        }
        
        this.keys.set(key, true);
        
        // Emit event for bound actions
        this.checkBindings(key, true);
    }

    /**
     * Handle key up
     * @param {KeyboardEvent} event
     */
    onKeyUp(event) {
        const key = event.key.toLowerCase();
        
        this.keys.set(key, false);
        this.keysReleased.add(key);
        
        // Emit event for bound actions
        this.checkBindings(key, false);
    }

    /**
     * Handle mouse move
     * @param {MouseEvent} event
     */
    onMouseMove(event) {
        this.mouse.deltaX = event.movementX || event.clientX - this.mouse.x;
        this.mouse.deltaY = event.movementY || event.clientY - this.mouse.y;
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    /**
     * Handle mouse down
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        this.mouse.buttons.set(event.button, true);
    }

    /**
     * Handle mouse up
     * @param {MouseEvent} event
     */
    onMouseUp(event) {
        this.mouse.buttons.set(event.button, false);
    }

    /**
     * Handle mouse wheel
     * @param {WheelEvent} event
     */
    onMouseWheel(event) {
        this.mouse.wheel = event.deltaY;
    }

    /**
     * Handle touch start
     * @param {TouchEvent} event
     */
    onTouchStart(event) {
        for (const touch of event.changedTouches) {
            this.touches.set(touch.identifier, {
                x: touch.clientX,
                y: touch.clientY,
                startX: touch.clientX,
                startY: touch.clientY
            });
        }
    }

    /**
     * Handle touch move
     * @param {TouchEvent} event
     */
    onTouchMove(event) {
        for (const touch of event.changedTouches) {
            const existing = this.touches.get(touch.identifier);
            if (existing) {
                existing.x = touch.clientX;
                existing.y = touch.clientY;
            }
        }
    }

    /**
     * Handle touch end
     * @param {TouchEvent} event
     */
    onTouchEnd(event) {
        for (const touch of event.changedTouches) {
            this.touches.delete(touch.identifier);
        }
    }

    /**
     * Handle window blur (reset all inputs)
     */
    onWindowBlur() {
        this.keys.clear();
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouse.buttons.clear();
    }

    /**
     * Check if a key is currently pressed
     * @param {string} key - Key to check
     * @returns {boolean}
     */
    isKeyDown(key) {
        return this.keys.get(key.toLowerCase()) === true;
    }

    /**
     * Check if a key was just pressed this frame
     * @param {string} key - Key to check
     * @returns {boolean}
     */
    isKeyPressed(key) {
        return this.keysPressed.has(key.toLowerCase());
    }

    /**
     * Check if a key was just released this frame
     * @param {string} key - Key to check
     * @returns {boolean}
     */
    isKeyReleased(key) {
        return this.keysReleased.has(key.toLowerCase());
    }

    /**
     * Check if a mouse button is pressed
     * @param {number} button - Button number (0=left, 1=middle, 2=right)
     * @returns {boolean}
     */
    isMouseButtonDown(button) {
        return this.mouse.buttons.get(button) === true;
    }

    /**
     * Get mouse position
     * @returns {Object} Mouse position {x, y}
     */
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }

    /**
     * Get mouse delta (movement since last frame)
     * @returns {Object} Mouse delta {deltaX, deltaY}
     */
    getMouseDelta() {
        return { deltaX: this.mouse.deltaX, deltaY: this.mouse.deltaY };
    }

    /**
     * Bind an action to a key
     * @param {string} action - Action name
     * @param {string} key - Key to bind
     */
    bindKey(action, key) {
        if (!this.bindings.has(action)) {
            this.bindings.set(action, []);
        }
        this.bindings.get(action).push(key.toLowerCase());
    }

    /**
     * Check if an action is active
     * @param {string} action - Action name
     * @returns {boolean}
     */
    isActionActive(action) {
        const keys = this.bindings.get(action);
        if (!keys) return false;
        
        return keys.some(key => this.isKeyDown(key));
    }

    /**
     * Check bindings and emit events
     * @param {string} key - Key that was pressed/released
     * @param {boolean} pressed - Whether key was pressed or released
     */
    checkBindings(key, pressed) {
        for (const [action, keys] of this.bindings) {
            if (keys.includes(key)) {
                if (eventBus) {
                    eventBus.emit(`input:${action}`, { key, pressed });
                }
            }
        }
    }

    /**
     * Update input state (call once per frame)
     */
    update() {
        // Clear per-frame states
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouse.deltaX = 0;
        this.mouse.deltaY = 0;
        this.mouse.wheel = 0;
    }

    /**
     * Cleanup all event listeners
     */
    destroy() {
        for (const { element, event, handler } of this.eventListeners) {
            element.removeEventListener(event, handler);
        }
        this.eventListeners = [];
        
        this.keys.clear();
        this.mouse.buttons.clear();
        this.touches.clear();
        
        console.log('[InputManager] Destroyed');
    }
}

// Create global input manager instance
const inputManager = new InputManager();

// Setup default key bindings
inputManager.bindKey('move_forward', 'w');
inputManager.bindKey('move_forward', 'arrowup');
inputManager.bindKey('move_backward', 's');
inputManager.bindKey('move_backward', 'arrowdown');
inputManager.bindKey('move_left', 'a');
inputManager.bindKey('move_left', 'arrowleft');
inputManager.bindKey('move_right', 'd');
inputManager.bindKey('move_right', 'arrowright');
inputManager.bindKey('pause', 'escape');
inputManager.bindKey('pause', 'p');

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InputManager, inputManager };
}
