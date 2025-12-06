/**
 * Shopping Cart System
 * Manages cart operations and persistence
 */

class CartSystem {
    constructor() {
        this.storageKey = 'vr-shopping-cart';
        this.ordersKey = 'vr-shopping-orders';
    }

    /**
     * Get current cart items
     */
    getCart() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error retrieving cart:', e);
            return [];
        }
    }

    /**
     * Save cart to storage
     */
    saveCart(cartItems) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cartItems));
            return true;
        } catch (e) {
            console.error('Error saving cart:', e);
            return false;
        }
    }

    /**
     * Clear the cart
     */
    clearCart() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (e) {
            console.error('Error clearing cart:', e);
            return false;
        }
    }

    /**
     * Add item to cart
     */
    addItem(product) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart(cart);
        return cart;
    }

    /**
     * Remove item from cart
     */
    removeItem(productId) {
        const cart = this.getCart();
        const filtered = cart.filter(item => item.id !== productId);
        this.saveCart(filtered);
        return filtered;
    }

    /**
     * Update item quantity
     */
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId);
            }
            item.quantity = quantity;
            this.saveCart(cart);
        }

        return cart;
    }

    /**
     * Calculate total price
     */
    calculateTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Get cart item count
     */
    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Save order to history
     */
    saveOrder(orderData) {
        try {
            const orders = this.getOrders();
            orders.push({
                ...orderData,
                id: this.generateOrderId(),
                createdAt: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem(this.ordersKey, JSON.stringify(orders));
            return orders[orders.length - 1];
        } catch (e) {
            console.error('Error saving order:', e);
            return null;
        }
    }

    /**
     * Get order history
     */
    getOrders() {
        try {
            const data = localStorage.getItem(this.ordersKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error retrieving orders:', e);
            return [];
        }
    }

    /**
     * Generate unique order ID
     */
    generateOrderId() {
        return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Export cart data
     */
    exportCart() {
        const cart = this.getCart();
        const total = this.calculateTotal();
        return {
            items: cart,
            itemCount: this.getItemCount(),
            total: total,
            currency: 'EUR',
            exportedAt: new Date().toISOString()
        };
    }
}

// Create global instance
const cartSystem = new CartSystem();
