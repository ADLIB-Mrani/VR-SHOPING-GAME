/**
 * VR Store Main Logic
 * Handles the core VR shopping experience
 * @version 1.0.0
 * @author ADLIB-Mrani
 */

// Global cart state
let cart = [];
let orderHistory = [];

// Store event listeners for cleanup
const eventListeners = new Map();

/**
 * Initialize the VR store
 * Sets up all necessary components and event listeners
 */
function initVRStore() {
    console.log('Initializing VR Store...');
    
    try {
        // Load cart from localStorage if available
        loadCart();
        
        // Clean up expired cart items
        cleanExpiredCart();
        
        // Set up product interactions once scene is loaded
        const scene = document.querySelector('a-scene');
        if (scene) {
            if (scene.hasLoaded) {
                setupProductInteractions();
                hideLoadingScreen();
            } else {
                scene.addEventListener('loaded', () => {
                    setupProductInteractions();
                    hideLoadingScreen();
                });
            }
        } else {
            console.error('A-Frame scene not found');
            showLoadingError();
        }
        
        // Set up delivery form handler
        const form = document.getElementById('delivery-form');
        if (form) {
            const submitHandler = (e) => handleDeliverySubmit(e);
            form.addEventListener('submit', submitHandler);
            eventListeners.set('delivery-form-submit', { element: form, event: 'submit', handler: submitHandler });
        }
        
        // Set up help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            const clickHandler = () => toggleHelp();
            helpBtn.addEventListener('click', clickHandler);
            eventListeners.set('help-btn-click', { element: helpBtn, event: 'click', handler: clickHandler });
        }
        
        // Update cart display
        updateCartDisplay();
        
        // Add window beforeunload handler to save cart
        window.addEventListener('beforeunload', saveCartOnExit);
        
    } catch (error) {
        console.error('Error initializing VR Store:', error);
        handleError('Erreur lors du chargement du magasin', error);
    }
}

/**
 * Clean up expired cart items
 */
function cleanExpiredCart() {
    const savedCart = getFromStorage(CONFIG.CART.STORAGE_KEY, []);
    if (Array.isArray(savedCart) && savedCart.length > 0) {
        const firstItem = savedCart[0];
        if (firstItem && firstItem.addedAt && isCartExpired(firstItem.addedAt)) {
            console.log('Cart expired, clearing...');
            removeFromStorage(CONFIG.CART.STORAGE_KEY);
            cart = [];
        }
    }
}

/**
 * Save cart on page exit
 */
function saveCartOnExit() {
    saveCart();
}

/**
 * Show loading error
 */
function showLoadingError() {
    const loadingError = document.getElementById('loading-error');
    if (loadingError) {
        loadingError.style.display = 'block';
    }
}

/**
 * Cleanup function for removing event listeners
 */
function cleanup() {
    eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    eventListeners.clear();
}

/**
 * Show welcome notification after scene is ready
 */
function showWelcomeNotification() {
    showNotification('Bienvenue! Explorez le magasin et ajoutez des produits à votre panier 🛒');
}

/**
 * Hide loading screen with fade out animation
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, CONFIG.UI.ANIMATION_DURATION);
        }, CONFIG.UI.LOADING_DELAY);
    }
}

/**
 * Toggle help panel
 */
function toggleHelp() {
    const helpPanel = document.getElementById('help-panel');
    if (helpPanel) {
        if (helpPanel.style.display === 'none' || !helpPanel.style.display) {
            helpPanel.style.display = 'block';
        } else {
            helpPanel.style.display = 'none';
        }
    }
}

/**
 * Close help panel
 */
function closeHelp() {
    const helpPanel = document.getElementById('help-panel');
    if (helpPanel) {
        helpPanel.style.display = 'none';
    }
}

/**
 * Set up interactions with products
 */
function setupProductInteractions() {
    const products = document.querySelectorAll('.product');
    
    // Show welcome notification once scene is fully loaded
    setTimeout(() => {
        showWelcomeNotification();
    }, CONFIG.UI.LOADING_DELAY);
    
    products.forEach(product => {
        // Add hover effect
        product.addEventListener('mouseenter', function() {
            this.setAttribute('scale', '1.1 1.1 1.1');
        });
        
        product.addEventListener('mouseleave', function() {
            this.setAttribute('scale', '1 1 1');
        });
        
        // Add click handler to add to cart
        product.addEventListener('click', function(evt) {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            // Validate product data
            if (!productId || !productName || isNaN(productPrice)) {
                console.error('Invalid product data');
                return;
            }
            
            addToCart(productId, productName, productPrice);
            
            // Visual feedback
            showNotification(`${sanitizeHTML(productName)} ${CONFIG.SUCCESS.ITEM_ADDED}`);
            
            // Animate the product
            this.setAttribute('animation', {
                property: 'rotation',
                to: '0 360 0',
                dur: 500,
                easing: 'easeInOutQuad'
            });
        });
    });
}

/**
 * Add product to cart with validation
 * @param {string} id - Product ID
 * @param {string} name - Product name
 * @param {number} price - Product price
 */
function addToCart(id, name, price) {
    try {
        // Validate inputs with detailed error messages
        if (!id) {
            throw new Error('Invalid product data: missing product ID');
        }
        if (!name) {
            throw new Error('Invalid product data: missing product name');
        }
        if (typeof price !== 'number' || price < 0) {
            throw new Error('Invalid product data: price must be a positive number');
        }
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            // Ensure quantity doesn't exceed maximum
            const newQuantity = existingItem.quantity + 1;
            if (newQuantity > CONFIG.CART.MAX_QUANTITY_PER_ITEM) {
                showNotification(`Quantité maximale atteinte (${CONFIG.CART.MAX_QUANTITY_PER_ITEM})`);
                return;
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        saveCart();
        updateCartDisplay();
        
        console.log(`Added ${name} to cart. Total items: ${cart.length}`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        handleError('Erreur lors de l\'ajout au panier', error);
    }
}

/**
 * Remove product from cart
 * @param {string} id - Product ID to remove
 */
function removeFromCart(id) {
    try {
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            const removedItem = cart[index];
            cart.splice(index, 1);
            saveCart();
            updateCartDisplay();
            showNotification(`${sanitizeHTML(removedItem.name)} ${CONFIG.SUCCESS.ITEM_REMOVED}`);
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        handleError('Erreur lors de la suppression', error);
    }
}

/**
 * Update quantity of product in cart
 * @param {string} id - Product ID
 * @param {number} change - Quantity change (+1 or -1)
 */
function updateQuantity(id, change) {
    try {
        const item = cart.find(item => item.id === id);
        if (item) {
            const newQuantity = item.quantity + change;
            
            // Validate quantity bounds
            if (newQuantity < CONFIG.CART.MIN_QUANTITY_PER_ITEM) {
                removeFromCart(id);
            } else if (newQuantity > CONFIG.CART.MAX_QUANTITY_PER_ITEM) {
                showNotification(`Quantité maximale atteinte (${CONFIG.CART.MAX_QUANTITY_PER_ITEM})`);
            } else {
                item.quantity = newQuantity;
                saveCart();
                updateCartDisplay();
            }
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        handleError('Erreur lors de la mise à jour', error);
    }
}

/**
 * Calculate cart total
 */
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Update cart display in UI
 */
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    
    if (!cartItemsDiv || !cartTotalDiv) return;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
    } else {
        let html = '<div class="cart-list">';
        cart.forEach(item => {
            // Sanitize output to prevent XSS
            const safeName = sanitizeHTML(item.name);
            const safeId = sanitizeHTML(item.id);
            const itemTotal = (item.price * item.quantity).toFixed(2);
            
            html += `
                <div class="cart-item">
                    <span class="item-name">${safeName}</span>
                    <div class="item-controls">
                        <button onclick="updateQuantity('${safeId}', -1)" aria-label="Diminuer quantité">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button onclick="updateQuantity('${safeId}', 1)" aria-label="Augmenter quantité">+</button>
                    </div>
                    <span class="item-price">${itemTotal}€</span>
                    <button class="remove-btn" onclick="removeFromCart('${safeId}')" aria-label="Supprimer l'article">✕</button>
                </div>
            `;
        });
        html += '</div>';
        cartItemsDiv.innerHTML = html;
    }
    
    const total = calculateTotal();
    const formattedTotal = formatPrice(total);
    cartTotalDiv.innerHTML = `Total: ${formattedTotal}`;
    
    // Show free shipping notification
    if (total >= CONFIG.CART.FREE_SHIPPING_THRESHOLD) {
        cartTotalDiv.innerHTML += '<div class="free-shipping">🎉 Livraison GRATUITE!</div>';
    }
}

/**
 * Save cart to localStorage with error handling
 */
function saveCart() {
    if (!setToStorage(CONFIG.CART.STORAGE_KEY, cart)) {
        handleError(CONFIG.ERRORS.STORAGE_ERROR);
    }
}

/**
 * Load cart from localStorage with error handling
 */
function loadCart() {
    const savedCart = getFromStorage(CONFIG.CART.STORAGE_KEY, []);
    if (Array.isArray(savedCart)) {
        cart = savedCart;
    } else {
        console.warn('Invalid cart data in localStorage');
        cart = [];
    }
}

/**
 * Show notification to user
 * @param {string} message - Message to display
 */
function showNotification(message) {
    // Sanitize message
    const safeMessage = sanitizeHTML(message);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = safeMessage;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), CONFIG.UI.ANIMATION_DURATION);
    }, CONFIG.UI.NOTIFICATION_DURATION);
}

/**
 * Open checkout with validation
 */
function checkout() {
    if (cart.length === 0) {
        showNotification(CONFIG.ERRORS.EMPTY_CART);
        return;
    }
    
    // Show order form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.style.display = 'block';
        // Focus first input for accessibility
        const firstInput = orderForm.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

/**
 * Close order form
 */
function closeOrderForm() {
    document.getElementById('order-form').style.display = 'none';
}

/**
 * Handle delivery form submission with validation
 * @param {Event} event - Form submit event
 */
function handleDeliverySubmit(event) {
    event.preventDefault();
    
    try {
        // Get form data
        const formData = {
            name: document.getElementById('customer-name').value.trim(),
            address: document.getElementById('customer-address').value.trim(),
            city: document.getElementById('customer-city').value.trim(),
            postal: document.getElementById('customer-postal').value.trim(),
            phone: document.getElementById('customer-phone').value.trim()
        };
        
        // Validate form data
        const validation = validateFormData(formData);
        
        if (!validation.isValid) {
            displayValidationErrors(validation.errors);
            showNotification('Veuillez corriger les erreurs dans le formulaire');
            return;
        }
        
        // Add cart and order information
        const orderData = {
            ...formData,
            items: deepClone(cart),
            total: calculateTotal(),
            orderDate: new Date().toISOString(),
            orderNumber: generateId(CONFIG.APP.ORDER_PREFIX)
        };
        
        // Process order
        processOrder(orderData);
        
    } catch (error) {
        console.error('Error submitting order:', error);
        handleError('Erreur lors de la commande', error);
    }
}

/**
 * Process order and send to delivery system
 * @param {Object} orderData - Order information
 */
function processOrder(orderData) {
    try {
        console.log('Processing order:', orderData);
        
        // Save to order history
        orderHistory.push(orderData);
        saveOrderHistory();
        
        // In a real application, this would send to a backend API
        // For now, we'll simulate the delivery integration
        sendToDeliverySystem(orderData);
        
        // Show confirmation
        showOrderConfirmation(orderData);
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartDisplay();
        
        // Hide order form
        closeOrderForm();
        
        // Reset form
        const form = document.getElementById('delivery-form');
        if (form) {
            form.reset();
        }
        
    } catch (error) {
        console.error('Error processing order:', error);
        handleError('Erreur lors du traitement de la commande', error);
    }
}

/**
 * Send order to delivery system (simulated)
 * @param {Object} orderData - Order data to send
 */
function sendToDeliverySystem(orderData) {
    // This would integrate with a real delivery API
    console.log('Sending to delivery system:', orderData);
    
    // Simulate API call
    const deliveryData = {
        orderId: orderData.orderNumber,
        customer: {
            name: sanitizeHTML(orderData.name),
            address: sanitizeHTML(`${orderData.address}, ${orderData.city} ${orderData.postal}`),
            phone: sanitizeHTML(orderData.phone)
        },
        items: orderData.items.map(item => ({
            name: sanitizeHTML(item.name),
            quantity: item.quantity,
            price: item.price
        })),
        total: orderData.total,
        status: 'pending',
        estimatedDelivery: getEstimatedDelivery()
    };
    
    console.log('Delivery data prepared:', deliveryData);
    
    // In production, you would make an API call here:
    // fetch('/api/delivery', {
    //     method: 'POST',
    //     headers: { 
    //         'Content-Type': 'application/json',
    //         'X-CSRF-Token': getCsrfToken() 
    //     },
    //     body: JSON.stringify(deliveryData)
    // })
    // .then(response => response.json())
    // .then(data => console.log('Order sent:', data))
    // .catch(error => handleError('Erreur d\'envoi', error));
}

/**
 * Show order confirmation
 * @param {Object} orderData - Order data to display
 */
function showOrderConfirmation(orderData) {
    const confirmation = document.getElementById('confirmation');
    const orderDetails = document.getElementById('order-details');
    
    if (!confirmation || !orderDetails) return;
    
    let itemsList = '<ul class="order-items">';
    orderData.items.forEach(item => {
        const safeName = sanitizeHTML(item.name);
        const itemTotal = (item.price * item.quantity).toFixed(2);
        itemsList += `<li>${safeName} x ${item.quantity} - ${itemTotal}€</li>`;
    });
    itemsList += '</ul>';
    
    const safeOrderNumber = sanitizeHTML(orderData.orderNumber);
    const safeAddress = sanitizeHTML(orderData.address);
    const safeCity = sanitizeHTML(orderData.city);
    const formattedTotal = formatPrice(orderData.total);
    const estimatedDelivery = getEstimatedDelivery();
    
    orderDetails.innerHTML = `
        <strong>Numéro de commande:</strong> ${safeOrderNumber}<br>
        <strong>Total:</strong> ${formattedTotal}<br>
        <strong>Livraison à:</strong> ${safeAddress}, ${safeCity}<br>
        <strong>Livraison estimée:</strong> ${estimatedDelivery}<br>
        <br>
        <strong>Articles commandés:</strong>
        ${itemsList}
    `;
    
    confirmation.style.display = 'block';
}

/**
 * Close confirmation dialog
 */
function closeConfirmation() {
    document.getElementById('confirmation').style.display = 'none';
}

/**
 * Get estimated delivery date
 * @returns {string} Formatted delivery date
 */
function getEstimatedDelivery() {
    const days = CONFIG.SHIPPING.DEFAULT_DELIVERY_DAYS;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

/**
 * Save order history with error handling
 */
function saveOrderHistory() {
    if (!setToStorage(CONFIG.CART.ORDERS_KEY, orderHistory)) {
        console.error('Failed to save order history');
    }
}

/**
 * Load order history with error handling
 */
function loadOrderHistory() {
    const savedOrders = getFromStorage(CONFIG.CART.ORDERS_KEY, []);
    if (Array.isArray(savedOrders)) {
        orderHistory = savedOrders;
    } else {
        console.warn('Invalid order history data');
        orderHistory = [];
    }
}

/**
 * Clear cart with confirmation
 */
function clearCart() {
    if (cart.length === 0) {
        showNotification('Le panier est déjà vide');
        return;
    }
    
    if (confirm('Voulez-vous vraiment vider le panier?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Panier vidé');
    }
}

// Initialize order history on load
loadOrderHistory();
