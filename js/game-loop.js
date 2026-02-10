/**
 * Game Loop System
 * Implements requestAnimationFrame-based game loop with delta time
 * Based on game development best practices
 */

class GameLoop {
    constructor() {
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateInterval = 1000; // Update FPS every second
        this.lastFpsUpdate = 0;
        this.isRunning = false;
        this.animationFrameId = null;
        
        // Update callbacks
        this.updateCallbacks = [];
        this.renderCallbacks = [];
        
        // Performance monitoring
        this.performanceData = {
            frameTime: 0,
            updateTime: 0,
            renderTime: 0
        };
    }

    /**
     * Start the game loop
     */
    start() {
        if (this.isRunning) {
            console.warn('Game loop is already running');
            return;
        }

        console.log('Starting game loop');
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.lastFpsUpdate = this.lastFrameTime;
        this.loop(this.lastFrameTime);
    }

    /**
     * Stop the game loop
     */
    stop() {
        if (!this.isRunning) {
            return;
        }

        console.log('Stopping game loop');
        this.isRunning = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Main game loop
     * @param {number} currentTime - Current timestamp from requestAnimationFrame
     */
    loop(currentTime) {
        if (!this.isRunning) {
            return;
        }

        // Schedule next frame
        this.animationFrameId = requestAnimationFrame((time) => this.loop(time));

        // Calculate delta time in seconds
        this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Cap delta time to prevent spiral of death
        if (this.deltaTime > 0.1) {
            this.deltaTime = 0.1;
        }

        // Update FPS counter
        this.updateFPS(currentTime);

        // Execute update phase
        const updateStart = performance.now();
        this.update(this.deltaTime);
        this.performanceData.updateTime = performance.now() - updateStart;

        // Execute render phase
        const renderStart = performance.now();
        this.render(this.deltaTime);
        this.performanceData.renderTime = performance.now() - renderStart;

        // Track frame time
        this.performanceData.frameTime = performance.now() - currentTime;

        // Increment frame count
        this.frameCount++;
    }

    /**
     * Update phase - game logic
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        // Don't update if game is paused
        if (gameState && gameState.isPaused) {
            return;
        }

        // Update game state
        if (gameState) {
            gameState.update(deltaTime);
        }

        // Execute all registered update callbacks
        for (const callback of this.updateCallbacks) {
            try {
                callback(deltaTime);
            } catch (error) {
                console.error('Error in update callback:', error);
            }
        }
    }

    /**
     * Render phase - visual updates
     * @param {number} deltaTime - Time since last frame in seconds
     */
    render(deltaTime) {
        // Execute all registered render callbacks
        for (const callback of this.renderCallbacks) {
            try {
                callback(deltaTime);
            } catch (error) {
                console.error('Error in render callback:', error);
            }
        }
    }

    /**
     * Update FPS counter
     * @param {number} currentTime - Current timestamp
     */
    updateFPS(currentTime) {
        const timeSinceLastFpsUpdate = currentTime - this.lastFpsUpdate;
        
        if (timeSinceLastFpsUpdate >= this.fpsUpdateInterval) {
            // Calculate FPS based on frames in the last second
            this.fps = Math.round((this.frameCount * 1000) / timeSinceLastFpsUpdate);
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            
            // Emit FPS update event
            this.emitFPSUpdate(this.fps);
        }
    }

    /**
     * Register an update callback
     * @param {Function} callback - Function to call during update phase
     */
    onUpdate(callback) {
        if (typeof callback === 'function') {
            this.updateCallbacks.push(callback);
        }
    }

    /**
     * Register a render callback
     * @param {Function} callback - Function to call during render phase
     */
    onRender(callback) {
        if (typeof callback === 'function') {
            this.renderCallbacks.push(callback);
        }
    }

    /**
     * Remove an update callback
     * @param {Function} callback - Callback to remove
     */
    removeUpdateCallback(callback) {
        const index = this.updateCallbacks.indexOf(callback);
        if (index > -1) {
            this.updateCallbacks.splice(index, 1);
        }
    }

    /**
     * Remove a render callback
     * @param {Function} callback - Callback to remove
     */
    removeRenderCallback(callback) {
        const index = this.renderCallbacks.indexOf(callback);
        if (index > -1) {
            this.renderCallbacks.splice(index, 1);
        }
    }

    /**
     * Emit FPS update event
     * @param {number} fps - Current FPS
     */
    emitFPSUpdate(fps) {
        const event = new CustomEvent('fpsupdate', {
            detail: { fps, performanceData: this.performanceData }
        });
        window.dispatchEvent(event);
    }

    /**
     * Get current FPS
     * @returns {number} Current FPS
     */
    getFPS() {
        return this.fps;
    }

    /**
     * Get performance data
     * @returns {Object} Performance metrics
     */
    getPerformanceData() {
        return { ...this.performanceData };
    }

    /**
     * Get delta time
     * @returns {number} Delta time in seconds
     */
    getDeltaTime() {
        return this.deltaTime;
    }
}

// Create global game loop instance
const gameLoop = new GameLoop();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameLoop, gameLoop };
}
