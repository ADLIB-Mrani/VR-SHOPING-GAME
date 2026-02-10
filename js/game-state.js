/**
 * Game State Management System
 * Implements state machine pattern for game lifecycle
 * Based on game development best practices
 */

// Game States
const GameStates = Object.freeze({
    LOADING: 'loading',
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ERROR: 'error'
});

/**
 * GameStateManager - Manages game lifecycle states
 */
class GameStateManager {
    constructor() {
        this.currentState = GameStates.LOADING;
        this.previousState = null;
        this.stateCallbacks = new Map();
        this.startTime = Date.now();
        this.isPaused = false;
        
        // Initialize state callbacks
        this.initializeStates();
    }

    /**
     * Initialize state transition callbacks
     */
    initializeStates() {
        // Set up state entry/exit callbacks
        this.stateCallbacks.set(GameStates.LOADING, {
            onEnter: () => this.onLoadingEnter(),
            onExit: () => this.onLoadingExit(),
            onUpdate: (deltaTime) => this.onLoadingUpdate(deltaTime)
        });

        this.stateCallbacks.set(GameStates.READY, {
            onEnter: () => this.onReadyEnter(),
            onExit: () => this.onReadyExit(),
            onUpdate: (deltaTime) => this.onReadyUpdate(deltaTime)
        });

        this.stateCallbacks.set(GameStates.PLAYING, {
            onEnter: () => this.onPlayingEnter(),
            onExit: () => this.onPlayingExit(),
            onUpdate: (deltaTime) => this.onPlayingUpdate(deltaTime)
        });

        this.stateCallbacks.set(GameStates.PAUSED, {
            onEnter: () => this.onPausedEnter(),
            onExit: () => this.onPausedExit(),
            onUpdate: (deltaTime) => this.onPausedUpdate(deltaTime)
        });
    }

    /**
     * Change to a new state
     * @param {string} newState - The state to transition to
     */
    setState(newState) {
        if (!Object.values(GameStates).includes(newState)) {
            console.error(`Invalid state: ${newState}`);
            return;
        }

        if (this.currentState === newState) {
            return; // Already in this state
        }

        console.log(`State transition: ${this.currentState} -> ${newState}`);

        // Exit current state
        const currentCallbacks = this.stateCallbacks.get(this.currentState);
        if (currentCallbacks && currentCallbacks.onExit) {
            currentCallbacks.onExit();
        }

        // Store previous state
        this.previousState = this.currentState;
        this.currentState = newState;

        // Enter new state
        const newCallbacks = this.stateCallbacks.get(newState);
        if (newCallbacks && newCallbacks.onEnter) {
            newCallbacks.onEnter();
        }

        // Emit state change event
        this.emitStateChange(newState, this.previousState);
    }

    /**
     * Update current state
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        const callbacks = this.stateCallbacks.get(this.currentState);
        if (callbacks && callbacks.onUpdate) {
            callbacks.onUpdate(deltaTime);
        }
    }

    /**
     * Get current state
     * @returns {string} Current state
     */
    getState() {
        return this.currentState;
    }

    /**
     * Check if in a specific state
     * @param {string} state - State to check
     * @returns {boolean}
     */
    isState(state) {
        return this.currentState === state;
    }

    /**
     * Pause the game
     */
    pause() {
        if (this.currentState === GameStates.PLAYING) {
            this.setState(GameStates.PAUSED);
            this.isPaused = true;
        }
    }

    /**
     * Resume the game
     */
    resume() {
        if (this.currentState === GameStates.PAUSED) {
            this.setState(GameStates.PLAYING);
            this.isPaused = false;
        }
    }

    /**
     * Emit state change event
     * @param {string} newState - New state
     * @param {string} oldState - Previous state
     */
    emitStateChange(newState, oldState) {
        const event = new CustomEvent('gamestatechange', {
            detail: { newState, oldState }
        });
        window.dispatchEvent(event);
    }

    // State callbacks
    onLoadingEnter() {
        console.log('Entering LOADING state');
        if (typeof showLoadingScreen === 'function') {
            // Loading screen is already shown by default
        }
    }

    onLoadingExit() {
        console.log('Exiting LOADING state');
    }

    onLoadingUpdate(deltaTime) {
        // Check if loading is complete
        // This will be managed by the asset loader
    }

    onReadyEnter() {
        console.log('Entering READY state');
        if (typeof hideLoadingScreen === 'function') {
            hideLoadingScreen();
        }
    }

    onReadyExit() {
        console.log('Exiting READY state');
    }

    onReadyUpdate(deltaTime) {
        // Ready state - waiting for user interaction
    }

    onPlayingEnter() {
        console.log('Entering PLAYING state');
        this.startTime = Date.now();
    }

    onPlayingExit() {
        console.log('Exiting PLAYING state');
    }

    onPlayingUpdate(deltaTime) {
        // Main game loop update
        // This is where the VR store updates happen
    }

    onPausedEnter() {
        console.log('Entering PAUSED state');
        // Show pause UI
    }

    onPausedExit() {
        console.log('Exiting PAUSED state');
        // Hide pause UI
    }

    onPausedUpdate(deltaTime) {
        // Paused - minimal updates
    }

    /**
     * Get elapsed time since game started
     * @returns {number} Elapsed time in milliseconds
     */
    getElapsedTime() {
        return Date.now() - this.startTime;
    }
}

// Create global game state manager instance
const gameState = new GameStateManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameStateManager, GameStates, gameState };
}
