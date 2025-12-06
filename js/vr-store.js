/**
 * VR Store Main Logic
 * Handles the core VR shopping experience
 */

// Global cart state
let cart = [];
let orderHistory = [];

/**
 * Initialize the VR store
 */
function initVRStore() {
    console.log('Initializing VR Store...');
    
    // Load cart from localStorage if available
    loadCart();
    
    // Set up product interactions once scene is loaded
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        setupProductInteractions();
        hideLoadingScreen();
    } else {
        scene.addEventListener('loaded', () => {
            setupProductInteractions();
            hideLoadingScreen();
        });
    }
    
    // Set up delivery form handler
    const form = document.getElementById('delivery-form');
    if (form) {
        form.addEventListener('submit', handleDeliverySubmit);
    }
    
    // Set up help button
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', toggleHelp);
    }
    
    // Update cart display
    updateCartDisplay();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Bienvenue! Explorez le magasin et ajoutez des produits à votre panier 🛒');
    }, 1000);
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
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
            
            addToCart(productId, productName, productPrice);
            
            // Visual feedback
            showNotification(`${productName} ajouté au panier!`);
            
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
 * Add product to cart
 */
function addToCart(id, name, price) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    
    console.log(`Added ${name} to cart. Total items: ${cart.length}`);
}

/**
 * Remove product from cart
 */
function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart();
        updateCartDisplay();
    }
}

/**
 * Update quantity of product in cart
 */
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartDisplay();
        }
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
            html += `
                <div class="cart-item">
                    <span class="item-name">${item.name}</span>
                    <div class="item-controls">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <span class="item-price">${(item.price * item.quantity).toFixed(2)}€</span>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">✕</button>
                </div>
            `;
        });
        html += '</div>';
        cartItemsDiv.innerHTML = html;
    }
    
    const total = calculateTotal();
    cartTotalDiv.innerHTML = `Total: ${total.toFixed(2)}€`;
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    try {
        localStorage.setItem('vr-store-cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

/**
 * Load cart from localStorage
 */
function loadCart() {
    try {
        const savedCart = localStorage.getItem('vr-store-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error loading cart:', e);
    }
}

/**
 * Show notification to user
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

/**
 * Open checkout
 */
function checkout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide!');
        return;
    }
    
    // Show order form
    document.getElementById('order-form').style.display = 'block';
}

/**
 * Close order form
 */
function closeOrderForm() {
    document.getElementById('order-form').style.display = 'none';
}

/**
 * Handle delivery form submission
 */
function handleDeliverySubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('customer-name').value,
        address: document.getElementById('customer-address').value,
        city: document.getElementById('customer-city').value,
        postal: document.getElementById('customer-postal').value,
        phone: document.getElementById('customer-phone').value,
        items: cart,
        total: calculateTotal(),
        orderDate: new Date().toISOString(),
        orderNumber: generateOrderNumber()
    };
    
    // Process order
    processOrder(formData);
}

/**
 * Process order and send to delivery system
 */
function processOrder(orderData) {
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
}

/**
 * Send order to delivery system (simulated)
 */
function sendToDeliverySystem(orderData) {
    // This would integrate with a real delivery API
    console.log('Sending to delivery system:', orderData);
    
    // Simulate API call
    const deliveryData = {
        orderId: orderData.orderNumber,
        customer: {
            name: orderData.name,
            address: `${orderData.address}, ${orderData.city} ${orderData.postal}`,
            phone: orderData.phone
        },
        items: orderData.items.map(item => ({
            name: item.name,
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
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(deliveryData)
    // });
}

/**
 * Show order confirmation
 */
function showOrderConfirmation(orderData) {
    const confirmation = document.getElementById('confirmation');
    const orderDetails = document.getElementById('order-details');
    
    let itemsList = '<ul class="order-items">';
    orderData.items.forEach(item => {
        itemsList += `<li>${item.name} x ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€</li>`;
    });
    itemsList += '</ul>';
    
    orderDetails.innerHTML = `
        <strong>Numéro de commande:</strong> ${orderData.orderNumber}<br>
        <strong>Total:</strong> ${orderData.total.toFixed(2)}€<br>
        <strong>Livraison à:</strong> ${orderData.address}, ${orderData.city}<br>
        <strong>Livraison estimée:</strong> ${getEstimatedDelivery()}<br>
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
 * Generate order number
 */
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `VR${timestamp}${random}`;
}

/**
 * Get estimated delivery date
 */
function getEstimatedDelivery() {
    // Use delivery API calculation for consistency
    const days = 3; // Default, could be enhanced with postal code analysis
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

/**
 * Save order history
 */
function saveOrderHistory() {
    try {
        localStorage.setItem('vr-store-orders', JSON.stringify(orderHistory));
    } catch (e) {
        console.error('Error saving order history:', e);
    }
}

/**
 * Load order history
 */
function loadOrderHistory() {
    try {
        const saved = localStorage.getItem('vr-store-orders');
        if (saved) {
            orderHistory = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading order history:', e);
    }
}

// Initialize order history on load
loadOrderHistory();
