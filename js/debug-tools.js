/**
 * Debug Tools System
 * Developer tools and debugging utilities
 * Based on game development debugging practices
 */

class DebugTools {
    constructor() {
        this.enabled = false;
        this.showFPS = false;
        this.showPerformance = false;
        this.fpsElement = null;
        this.perfElement = null;
        this.consoleCommands = new Map();
        
        // Initialize console commands
        this.registerDefaultCommands();
    }

    /**
     * Enable debug mode
     */
    enable() {
        if (this.enabled) return;
        
        this.enabled = true;
        console.log('[DebugTools] Debug mode enabled');
        console.log('[DebugTools] Type debug.help() for available commands');
        
        // Add debug overlay
        this.createDebugOverlay();
        
        // Enable event bus debug
        if (typeof eventBus !== 'undefined') {
            eventBus.enableDebug();
        }
        
        // Make debug available globally
        window.debug = this;
    }

    /**
     * Disable debug mode
     */
    disable() {
        if (!this.enabled) return;
        
        this.enabled = false;
        console.log('[DebugTools] Debug mode disabled');
        
        // Remove debug overlay
        this.removeDebugOverlay();
        
        // Disable event bus debug
        if (typeof eventBus !== 'undefined') {
            eventBus.disableDebug();
        }
    }

    /**
     * Toggle debug mode
     */
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    /**
     * Create debug overlay
     */
    createDebugOverlay() {
        // Create FPS counter
        this.fpsElement = document.createElement('div');
        this.fpsElement.id = 'debug-fps';
        this.fpsElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            z-index: 10000;
            border-radius: 4px;
            min-width: 150px;
        `;
        document.body.appendChild(this.fpsElement);
        
        // Create performance panel
        this.perfElement = document.createElement('div');
        this.perfElement.id = 'debug-perf';
        this.perfElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0ff;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 10000;
            border-radius: 4px;
            min-width: 200px;
            display: none;
        `;
        document.body.appendChild(this.perfElement);
        
        // Listen for FPS updates
        if (typeof gameLoop !== 'undefined') {
            window.addEventListener('fpsupdate', (e) => this.updateFPSDisplay(e.detail));
        }
        
        this.showFPS = true;
    }

    /**
     * Remove debug overlay
     */
    removeDebugOverlay() {
        if (this.fpsElement) {
            this.fpsElement.remove();
            this.fpsElement = null;
        }
        
        if (this.perfElement) {
            this.perfElement.remove();
            this.perfElement = null;
        }
        
        this.showFPS = false;
        this.showPerformance = false;
    }

    /**
     * Update FPS display
     * @param {Object} data - FPS and performance data
     */
    updateFPSDisplay(data) {
        if (!this.fpsElement) return;
        
        const { fps, performanceData } = data;
        
        // Color code FPS
        let fpsColor = '#0f0'; // Green
        if (fps < 30) fpsColor = '#f00'; // Red
        else if (fps < 50) fpsColor = '#ff0'; // Yellow
        
        this.fpsElement.innerHTML = `
            <div style="color: ${fpsColor}; font-weight: bold;">FPS: ${fps}</div>
            <div style="color: #888; font-size: 10px;">
                Frame: ${performanceData.frameTime.toFixed(2)}ms<br>
                Update: ${performanceData.updateTime.toFixed(2)}ms<br>
                Render: ${performanceData.renderTime.toFixed(2)}ms
            </div>
        `;
        
        if (this.showPerformance && this.perfElement) {
            this.updatePerformanceDisplay(performanceData);
        }
    }

    /**
     * Update performance display
     * @param {Object} data - Performance data
     */
    updatePerformanceDisplay(data) {
        if (!this.perfElement) return;
        
        const cartItems = typeof cart !== 'undefined' ? cart.length : 0;
        const memUsage = performance.memory ? 
            (performance.memory.usedJSHeapSize / 1048576).toFixed(2) : 'N/A';
        
        this.perfElement.innerHTML = `
            <div style="color: #0ff; font-weight: bold;">PERFORMANCE</div>
            <div style="color: #888;">
                Cart Items: ${cartItems}<br>
                Memory: ${memUsage} MB<br>
                State: ${gameState ? gameState.getState() : 'N/A'}<br>
                Events: ${eventBus ? eventBus.getEventNames().length : 0}
            </div>
        `;
    }

    /**
     * Toggle FPS display
     */
    toggleFPS() {
        this.showFPS = !this.showFPS;
        if (this.fpsElement) {
            this.fpsElement.style.display = this.showFPS ? 'block' : 'none';
        }
    }

    /**
     * Toggle performance display
     */
    togglePerformance() {
        this.showPerformance = !this.showPerformance;
        if (this.perfElement) {
            this.perfElement.style.display = this.showPerformance ? 'block' : 'none';
        }
    }

    /**
     * Register a console command
     * @param {string} name - Command name
     * @param {Function} handler - Command handler
     * @param {string} description - Command description
     */
    registerCommand(name, handler, description = '') {
        this.consoleCommands.set(name, { handler, description });
    }

    /**
     * Execute a console command
     * @param {string} name - Command name
     * @param {...any} args - Command arguments
     */
    exec(name, ...args) {
        const command = this.consoleCommands.get(name);
        if (command) {
            return command.handler(...args);
        } else {
            console.error(`Unknown command: ${name}`);
            this.help();
        }
    }

    /**
     * Register default commands
     */
    registerDefaultCommands() {
        this.registerCommand('help', () => this.help(), 'Show available commands');
        this.registerCommand('fps', () => this.toggleFPS(), 'Toggle FPS display');
        this.registerCommand('perf', () => this.togglePerformance(), 'Toggle performance display');
        this.registerCommand('state', () => this.printState(), 'Print current game state');
        this.registerCommand('events', () => this.printEvents(), 'List all registered events');
        this.registerCommand('cart', () => this.printCart(), 'Print cart contents');
        this.registerCommand('clear', () => this.clearCart(), 'Clear the cart');
        this.registerCommand('pause', () => this.pauseGame(), 'Pause the game');
        this.registerCommand('resume', () => this.resumeGame(), 'Resume the game');
        this.registerCommand('reload', () => location.reload(), 'Reload the page');
    }

    /**
     * Show help
     */
    help() {
        console.log('%c=== Debug Console Commands ===', 'color: #0f0; font-weight: bold');
        for (const [name, { description }] of this.consoleCommands) {
            console.log(`  debug.${name}() - ${description}`);
        }
    }

    /**
     * Print current state
     */
    printState() {
        if (typeof gameState !== 'undefined') {
            console.log('Current State:', gameState.getState());
            console.log('Elapsed Time:', gameState.getElapsedTime(), 'ms');
        } else {
            console.log('Game state not available');
        }
    }

    /**
     * Print registered events
     */
    printEvents() {
        if (typeof eventBus !== 'undefined') {
            const events = eventBus.getEventNames();
            console.log('Registered Events:', events);
            events.forEach(event => {
                console.log(`  ${event}: ${eventBus.listenerCount(event)} listeners`);
            });
        } else {
            console.log('Event bus not available');
        }
    }

    /**
     * Print cart contents
     */
    printCart() {
        if (typeof cart !== 'undefined') {
            console.table(cart);
            console.log('Total:', typeof calculateTotal === 'function' ? calculateTotal() : 'N/A');
        } else {
            console.log('Cart not available');
        }
    }

    /**
     * Clear cart
     */
    clearCart() {
        if (typeof clearCart === 'function') {
            clearCart();
            console.log('Cart cleared');
        } else {
            console.log('Clear cart function not available');
        }
    }

    /**
     * Pause game
     */
    pauseGame() {
        if (typeof gameState !== 'undefined') {
            gameState.pause();
            console.log('Game paused');
        } else {
            console.log('Game state not available');
        }
    }

    /**
     * Resume game
     */
    resumeGame() {
        if (typeof gameState !== 'undefined') {
            gameState.resume();
            console.log('Game resumed');
        } else {
            console.log('Game state not available');
        }
    }

    /**
     * Log a formatted message
     * @param {string} message - Message to log
     * @param {string} type - Message type (info, warn, error)
     */
    log(message, type = 'info') {
        if (!this.enabled) return;
        
        const styles = {
            info: 'color: #0ff',
            warn: 'color: #ff0',
            error: 'color: #f00'
        };
        
        console.log(`%c[DEBUG] ${message}`, styles[type] || styles.info);
    }
}

// Create global debug tools instance
const debugTools = new DebugTools();

// Enable debug mode with URL parameter
if (window.location.search.includes('debug=true')) {
    debugTools.enable();
}

// Enable debug mode with keyboard shortcut (Ctrl+Shift+D)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        debugTools.toggle();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DebugTools, debugTools };
}
