/**
 * Game Systems Integration
 * Integrates game development patterns with VR Store
 * Connects game loop, state management, events, and input
 */

(function() {
    'use strict';

    /**
     * Initialize all game systems
     */
    function initializeGameSystems() {
        console.log('[GameSystems] Initializing...');

        // Set up event listeners for game state changes
        setupStateListeners();
        
        // Set up event listeners for shopping actions
        setupShoppingListeners();
        
        // Set up input action listeners
        setupInputListeners();
        
        // Register game loop callbacks
        setupGameLoopCallbacks();
        
        // Initialize the game
        startGame();
    }

    /**
     * Set up state change listeners
     */
    function setupStateListeners() {
        window.addEventListener('gamestatechange', (e) => {
            const { newState, oldState } = e.detail;
            console.log(`[GameSystems] State changed: ${oldState} -> ${newState}`);
            
            // Emit to event bus
            if (eventBus) {
                eventBus.emit(GameEvents.STATE_CHANGED, { newState, oldState });
            }
        });
    }

    /**
     * Set up shopping event listeners
     */
    function setupShoppingListeners() {
        // Listen for cart updates
        if (eventBus) {
            eventBus.on(GameEvents.PRODUCT_ADDED, (data) => {
                console.log('[GameSystems] Product added:', data);
            });

            eventBus.on(GameEvents.CART_UPDATED, (data) => {
                console.log('[GameSystems] Cart updated');
            });

            eventBus.on(GameEvents.ORDER_PLACED, (data) => {
                console.log('[GameSystems] Order placed:', data);
            });
        }
    }

    /**
     * Set up input action listeners
     */
    function setupInputListeners() {
        if (eventBus && inputManager) {
            // Pause/Resume with P or ESC
            eventBus.on('input:pause', (data) => {
                if (data.pressed && gameState) {
                    if (gameState.isState(GameStates.PLAYING)) {
                        gameState.pause();
                    } else if (gameState.isState(GameStates.PAUSED)) {
                        gameState.resume();
                    }
                }
            });
        }
    }

    /**
     * Set up game loop callbacks
     */
    function setupGameLoopCallbacks() {
        if (!gameLoop) return;

        // Register update callback
        gameLoop.onUpdate((deltaTime) => {
            // Update input manager
            if (inputManager) {
                inputManager.update();
            }

            // Update any animations or time-based effects
            updateAnimations(deltaTime);
        });

        // Register render callback (if needed for custom rendering)
        gameLoop.onRender((deltaTime) => {
            // Custom rendering logic could go here
            // Most rendering is handled by A-Frame
        });
    }

    /**
     * Update animations
     * @param {number} deltaTime - Time since last frame
     */
    function updateAnimations(deltaTime) {
        // This could animate UI elements, particles, etc.
        // For now, just a placeholder
    }

    /**
     * Start the game
     */
    function startGame() {
        console.log('[GameSystems] Starting game...');

        // Wait for A-Frame scene to load
        const scene = document.querySelector('a-scene');
        if (!scene) {
            console.error('[GameSystems] A-Frame scene not found');
            return;
        }

        if (scene.hasLoaded) {
            onSceneReady();
        } else {
            scene.addEventListener('loaded', onSceneReady);
        }
    }

    /**
     * Called when VR scene is ready
     */
    function onSceneReady() {
        console.log('[GameSystems] Scene ready');

        // Transition from LOADING to READY state
        if (gameState) {
            gameState.setState(GameStates.READY);
            
            // Start playing after a short delay
            setTimeout(() => {
                gameState.setState(GameStates.PLAYING);
                
                // Start the game loop
                if (gameLoop) {
                    gameLoop.start();
                }
                
                // Emit game ready event
                if (eventBus) {
                    eventBus.emit(GameEvents.GAME_READY);
                }
                
                console.log('[GameSystems] Game started');
            }, 500);
        }
    }

    /**
     * Enhanced addToCart with event emission
     */
    function enhanceCartFunctions() {
        // Store original addToCart function
        const originalAddToCart = window.addToCart;
        
        if (originalAddToCart) {
            window.addToCart = function(id, name, price) {
                // Call original function
                const result = originalAddToCart.call(this, id, name, price);
                
                // Emit event
                if (eventBus) {
                    eventBus.emit(GameEvents.PRODUCT_ADDED, { id, name, price });
                    eventBus.emit(GameEvents.CART_UPDATED);
                }
                
                return result;
            };
        }

        // Store original removeFromCart function
        const originalRemoveFromCart = window.removeFromCart;
        
        if (originalRemoveFromCart) {
            window.removeFromCart = function(id) {
                // Call original function
                const result = originalRemoveFromCart.call(this, id);
                
                // Emit event
                if (eventBus) {
                    eventBus.emit(GameEvents.PRODUCT_REMOVED, { id });
                    eventBus.emit(GameEvents.CART_UPDATED);
                }
                
                return result;
            };
        }

        // Store original processOrder function
        const originalProcessOrder = window.processOrder;
        
        if (originalProcessOrder) {
            window.processOrder = function(orderData) {
                // Emit event before processing
                if (eventBus) {
                    eventBus.emit(GameEvents.ORDER_PLACED, orderData);
                }
                
                // Call original function
                return originalProcessOrder.call(this, orderData);
            };
        }
    }

    /**
     * Enhance notification system
     */
    function enhanceNotifications() {
        const originalShowNotification = window.showNotification;
        
        if (originalShowNotification) {
            window.showNotification = function(message) {
                // Call original function
                const result = originalShowNotification.call(this, message);
                
                // Emit event
                if (eventBus) {
                    eventBus.emit(GameEvents.UI_NOTIFICATION, { message });
                }
                
                return result;
            };
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            enhanceCartFunctions();
            enhanceNotifications();
            initializeGameSystems();
        });
    } else {
        enhanceCartFunctions();
        enhanceNotifications();
        initializeGameSystems();
    }

    // Export initialization function
    window.initializeGameSystems = initializeGameSystems;

})();
