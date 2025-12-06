/**
 * Proximity-Based Purchase System
 * Shows purchase UI when player gets close to products (Call of Duty style)
 */

// Store for proximity UI elements
const proximityUIElements = new Map();
let currentProximityProduct = null;
let isDragging = false;
let draggedProduct = null;

// Constants
const PROXIMITY_CHECK_INTERVAL = 100; // ms - How often to check player proximity
const PROXIMITY_DISTANCE = 2.5; // units - Distance at which purchase UI appears
const CART_DROP_DISTANCE = 3; // units - Distance for successful drag-drop
const SCENE_LOAD_DELAY = 1000; // ms - Delay before initializing after scene load

/**
 * Initialize proximity purchase system
 */
function initProximityPurchaseSystem() {
    console.log('Initializing proximity purchase system...');
    
    // Create proximity UI for each product
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        setupProductProximityUI(product);
    });
    
    // Set up camera tracking for proximity detection using requestAnimationFrame for better performance
    let lastCheck = 0;
    function checkProximityLoop(timestamp) {
        if (timestamp - lastCheck >= PROXIMITY_CHECK_INTERVAL) {
            checkPlayerProximity();
            lastCheck = timestamp;
        }
        requestAnimationFrame(checkProximityLoop);
    }
    requestAnimationFrame(checkProximityLoop);
    
    // Set up drag-to-cart functionality
    setupDragToCart();
}

/**
 * Set up proximity UI for a product
 */
function setupProductProximityUI(product) {
    const productId = product.getAttribute('data-id');
    
    // Create purchase panel that will appear near the product
    const purchasePanel = document.createElement('a-entity');
    purchasePanel.setAttribute('id', `purchase-panel-${productId}`);
    purchasePanel.setAttribute('visible', 'false');
    
    // Get product position
    const position = product.getAttribute('position');
    const panelPos = `${position.x} ${parseFloat(position.y) + 1.5} ${parseFloat(position.z) + 1}`;
    purchasePanel.setAttribute('position', panelPos);
    
    // Background panel
    const bg = document.createElement('a-plane');
    bg.setAttribute('width', '1.5');
    bg.setAttribute('height', '1');
    bg.setAttribute('color', '#2C3E50');
    bg.setAttribute('opacity', '0.9');
    purchasePanel.appendChild(bg);
    
    // Product name
    const nameText = document.createElement('a-text');
    nameText.setAttribute('value', product.getAttribute('data-name'));
    nameText.setAttribute('position', '0 0.35 0.01');
    nameText.setAttribute('align', 'center');
    nameText.setAttribute('width', '1.3');
    nameText.setAttribute('color', '#ECF0F1');
    purchasePanel.appendChild(nameText);
    
    // Price
    const priceText = document.createElement('a-text');
    priceText.setAttribute('value', `Prix: ${product.getAttribute('data-price')}€`);
    priceText.setAttribute('position', '0 0.15 0.01');
    priceText.setAttribute('align', 'center');
    priceText.setAttribute('width', '1.3');
    priceText.setAttribute('color', '#F39C12');
    purchasePanel.appendChild(priceText);
    
    // Add button
    const addBtn = document.createElement('a-box');
    addBtn.setAttribute('width', '1.2');
    addBtn.setAttribute('height', '0.25');
    addBtn.setAttribute('depth', '0.05');
    addBtn.setAttribute('position', '0 -0.1 0.01');
    addBtn.setAttribute('color', '#27AE60');
    addBtn.setAttribute('class', 'purchase-btn');
    addBtn.setAttribute('data-product-id', productId);
    purchasePanel.appendChild(addBtn);
    
    const addBtnText = document.createElement('a-text');
    addBtnText.setAttribute('value', '✓ AJOUTER');
    addBtnText.setAttribute('position', '0 -0.1 0.06');
    addBtnText.setAttribute('align', 'center');
    addBtnText.setAttribute('width', '1.1');
    addBtnText.setAttribute('color', '#FFFFFF');
    purchasePanel.appendChild(addBtnText);
    
    // Quantity controls
    const qtyLabel = document.createElement('a-text');
    qtyLabel.setAttribute('value', 'Quantité: 1');
    qtyLabel.setAttribute('position', '0 -0.35 0.01');
    qtyLabel.setAttribute('align', 'center');
    qtyLabel.setAttribute('width', '1.1');
    qtyLabel.setAttribute('color', '#ECF0F1');
    qtyLabel.setAttribute('id', `qty-label-${productId}`);
    purchasePanel.appendChild(qtyLabel);
    
    // Decrease quantity button
    const decreaseBtn = document.createElement('a-box');
    decreaseBtn.setAttribute('width', '0.2');
    decreaseBtn.setAttribute('height', '0.2');
    decreaseBtn.setAttribute('depth', '0.05');
    decreaseBtn.setAttribute('position', '-0.5 -0.35 0.01');
    decreaseBtn.setAttribute('color', '#E74C3C');
    decreaseBtn.setAttribute('class', 'qty-btn qty-decrease');
    decreaseBtn.setAttribute('data-product-id', productId);
    purchasePanel.appendChild(decreaseBtn);
    
    const decreaseBtnText = document.createElement('a-text');
    decreaseBtnText.setAttribute('value', '-');
    decreaseBtnText.setAttribute('position', '-0.5 -0.35 0.06');
    decreaseBtnText.setAttribute('align', 'center');
    decreaseBtnText.setAttribute('width', '0.5');
    decreaseBtnText.setAttribute('color', '#FFFFFF');
    purchasePanel.appendChild(decreaseBtnText);
    
    // Increase quantity button
    const increaseBtn = document.createElement('a-box');
    increaseBtn.setAttribute('width', '0.2');
    increaseBtn.setAttribute('height', '0.2');
    increaseBtn.setAttribute('depth', '0.05');
    increaseBtn.setAttribute('position', '0.5 -0.35 0.01');
    increaseBtn.setAttribute('color', '#27AE60');
    increaseBtn.setAttribute('class', 'qty-btn qty-increase');
    increaseBtn.setAttribute('data-product-id', productId);
    purchasePanel.appendChild(increaseBtn);
    
    const increaseBtnText = document.createElement('a-text');
    increaseBtnText.setAttribute('value', '+');
    increaseBtnText.setAttribute('position', '0.5 -0.35 0.06');
    increaseBtnText.setAttribute('align', 'center');
    increaseBtnText.setAttribute('width', '0.5');
    increaseBtnText.setAttribute('color', '#FFFFFF');
    purchasePanel.appendChild(increaseBtnText);
    
    // Add to scene
    const scene = document.querySelector('a-scene');
    scene.appendChild(purchasePanel);
    
    // Store reference
    proximityUIElements.set(productId, {
        panel: purchasePanel,
        quantity: 1
    });
    
    // Make panel look at camera
    purchasePanel.setAttribute('look-at', '#camera');
}

/**
 * Check player proximity to products
 */
function checkPlayerProximity() {
    const camera = document.querySelector('#camera');
    if (!camera) return;
    
    const cameraPos = camera.object3D.getWorldPosition(new THREE.Vector3());
    const products = document.querySelectorAll('.product');
    
    let closestProduct = null;
    let closestDistance = Infinity;
    
    products.forEach(product => {
        const productPos = product.object3D.getWorldPosition(new THREE.Vector3());
        const distance = cameraPos.distanceTo(productPos);
        
        // Check if within proximity range
        if (distance < PROXIMITY_DISTANCE && distance < closestDistance) {
            closestProduct = product;
            closestDistance = distance;
        }
    });
    
    // Update UI visibility
    proximityUIElements.forEach((ui, productId) => {
        const product = document.querySelector(`.product[data-id="${productId}"]`);
        if (product === closestProduct) {
            ui.panel.setAttribute('visible', 'true');
            currentProximityProduct = productId;
        } else {
            ui.panel.setAttribute('visible', 'false');
        }
    });
    
    if (!closestProduct) {
        currentProximityProduct = null;
    }
}

/**
 * Handle purchase button clicks
 */
function handlePurchaseClick(productId) {
    const ui = proximityUIElements.get(productId);
    if (!ui) return;
    
    const product = document.querySelector(`.product[data-id="${productId}"]`);
    const productName = product.getAttribute('data-name');
    const productPrice = parseFloat(product.getAttribute('data-price'));
    const quantity = ui.quantity;
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
        addToCart(productId, productName, productPrice);
    }
    
    // Visual feedback
    showNotification(`${quantity}x ${productName} ajouté au panier!`);
    
    // Animate product
    product.setAttribute('animation__purchase', {
        property: 'scale',
        from: '1 1 1',
        to: '1.2 1.2 1.2',
        dur: 200,
        dir: 'alternate',
        loop: 2
    });
    
    // Reset quantity to 1 for next purchase
    // Note: This provides a clean slate for each purchase. User can adjust before next purchase.
    ui.quantity = 1;
    updateQuantityDisplay(productId);
}

/**
 * Update quantity for a product
 */
function updateProductQuantity(productId, change) {
    const ui = proximityUIElements.get(productId);
    if (!ui) return;
    
    ui.quantity = Math.max(1, Math.min(99, ui.quantity + change));
    updateQuantityDisplay(productId);
}

/**
 * Update quantity display
 */
function updateQuantityDisplay(productId) {
    const ui = proximityUIElements.get(productId);
    if (!ui) return;
    
    const qtyLabel = document.querySelector(`#qty-label-${productId}`);
    if (qtyLabel) {
        qtyLabel.setAttribute('value', `Quantité: ${ui.quantity}`);
    }
}

/**
 * Set up drag-to-cart functionality
 */
function setupDragToCart() {
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('#camera');
    const cartVisual = document.querySelector('#cart-visual');
    
    if (!scene || !camera || !cartVisual) return;
    
    // Add mousedown event to products for drag initiation
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.addEventListener('mousedown', function(evt) {
            startDrag(this);
        });
    });
    
    // Track mouse movement for drag
    document.addEventListener('mousemove', function(evt) {
        if (isDragging && draggedProduct) {
            // Visual feedback during drag
            draggedProduct.setAttribute('opacity', '0.5');
        }
    });
    
    // Handle drop
    document.addEventListener('mouseup', function(evt) {
        if (isDragging && draggedProduct) {
            checkDropOnCart();
        }
    });
}

/**
 * Start dragging a product
 */
function startDrag(product) {
    isDragging = true;
    draggedProduct = product;
    
    // Visual feedback
    product.setAttribute('material', 'opacity', 0.7);
    showNotification('Glissez vers le panier pour ajouter!');
}

/**
 * Check if product is dropped on cart
 */
function checkDropOnCart() {
    if (!draggedProduct) return;
    
    const camera = document.querySelector('#camera');
    const cartVisual = document.querySelector('#cart-visual');
    
    if (!camera || !cartVisual) {
        endDrag();
        return;
    }
    
    const cameraPos = camera.object3D.getWorldPosition(new THREE.Vector3());
    const cartPos = cartVisual.object3D.getWorldPosition(new THREE.Vector3());
    const distance = cameraPos.distanceTo(cartPos);
    
    // If close to cart, add product
    if (distance < CART_DROP_DISTANCE) {
        const productId = draggedProduct.getAttribute('data-id');
        const productName = draggedProduct.getAttribute('data-name');
        const productPrice = parseFloat(draggedProduct.getAttribute('data-price'));
        
        addToCart(productId, productName, productPrice);
        showNotification(`${productName} ajouté au panier!`);
        
        // Animate cart
        cartVisual.setAttribute('animation__pulse', {
            property: 'scale',
            from: '1 1 1',
            to: '1.2 1.2 1.2',
            dur: 200,
            dir: 'alternate',
            loop: 2
        });
    }
    
    endDrag();
}

/**
 * End drag operation
 */
function endDrag() {
    if (draggedProduct) {
        draggedProduct.setAttribute('material', 'opacity', 1);
    }
    isDragging = false;
    draggedProduct = null;
}

/**
 * Set up click handlers for purchase UI buttons
 */
function setupPurchaseUIHandlers() {
    // Wait for scene to load
    const scene = document.querySelector('a-scene');
    if (!scene) return;
    
    if (scene.hasLoaded) {
        attachHandlers();
    } else {
        scene.addEventListener('loaded', attachHandlers);
    }
}

function attachHandlers() {
    // Purchase buttons
    const purchaseBtns = document.querySelectorAll('.purchase-btn');
    purchaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            handlePurchaseClick(productId);
        });
    });
    
    // Quantity buttons
    const qtyBtns = document.querySelectorAll('.qty-btn');
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const change = this.classList.contains('qty-increase') ? 1 : -1;
            updateProductQuantity(productId, change);
        });
    });
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        const scene = document.querySelector('a-scene');
        if (scene) {
            if (scene.hasLoaded) {
                // Delay initialization to ensure all entities are properly loaded
                setTimeout(() => {
                    initProximityPurchaseSystem();
                    setupPurchaseUIHandlers();
                }, SCENE_LOAD_DELAY);
            } else {
                scene.addEventListener('loaded', function() {
                    // Delay initialization to ensure all entities are properly loaded
                    setTimeout(() => {
                        initProximityPurchaseSystem();
                        setupPurchaseUIHandlers();
                    }, SCENE_LOAD_DELAY);
                });
            }
        }
    });
}
