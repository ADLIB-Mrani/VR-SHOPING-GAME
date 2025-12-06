/**
 * Product Interactions
 * Handles VR interactions with products
 */

// Product catalog
const PRODUCT_CATALOG = {
    laptop: {
        id: 'laptop',
        name: 'Ordinateur Portable',
        price: 999,
        category: 'electronics',
        description: 'Ordinateur portable haute performance',
        weight: 2.5,
        dimensions: '35x25x2 cm'
    },
    phone: {
        id: 'phone',
        name: 'Smartphone',
        price: 699,
        category: 'electronics',
        description: 'Smartphone dernière génération',
        weight: 0.2,
        dimensions: '15x7x0.8 cm'
    },
    tshirt: {
        id: 'tshirt',
        name: 'T-Shirt',
        price: 29,
        category: 'clothing',
        description: 'T-shirt en coton premium',
        weight: 0.2,
        dimensions: 'Taille M'
    },
    jeans: {
        id: 'jeans',
        name: 'Jean',
        price: 79,
        category: 'clothing',
        description: 'Jean denim de qualité',
        weight: 0.6,
        dimensions: 'Taille 32'
    },
    shoes: {
        id: 'shoes',
        name: 'Chaussures de Sport',
        price: 120,
        category: 'clothing',
        description: 'Chaussures de sport premium',
        weight: 0.8,
        dimensions: 'Pointure 42'
    },
    jacket: {
        id: 'jacket',
        name: 'Veste en Cuir',
        price: 199,
        category: 'clothing',
        description: 'Veste en cuir véritable',
        weight: 1.2,
        dimensions: 'Taille L'
    },
    lamp: {
        id: 'lamp',
        name: 'Lampe Design',
        price: 149,
        category: 'home',
        description: 'Lampe de designer moderne',
        weight: 1.5,
        dimensions: '40x20x20 cm'
    },
    vase: {
        id: 'vase',
        name: 'Vase Céramique',
        price: 59,
        category: 'home',
        description: 'Vase en céramique artisanale',
        weight: 1.2,
        dimensions: '25x15x15 cm'
    },
    frame: {
        id: 'frame',
        name: 'Cadre Photo',
        price: 35,
        category: 'home',
        description: 'Cadre photo décoratif',
        weight: 0.5,
        dimensions: '30x40 cm'
    },
    clock: {
        id: 'clock',
        name: 'Horloge Murale',
        price: 89,
        category: 'home',
        description: 'Horloge murale design',
        weight: 1.0,
        dimensions: '35x35 cm'
    },
    coffee: {
        id: 'coffee',
        name: 'Café Premium',
        price: 12,
        category: 'food',
        description: 'Café arabica premium 500g',
        weight: 0.5,
        dimensions: '20x10x10 cm'
    },
    chocolate: {
        id: 'chocolate',
        name: 'Chocolat Artisanal',
        price: 8,
        category: 'food',
        description: 'Chocolat noir artisanal 200g',
        weight: 0.2,
        dimensions: '15x10x2 cm'
    },
    wine: {
        id: 'wine',
        name: 'Vin Rouge',
        price: 45,
        category: 'food',
        description: 'Vin rouge de qualité',
        weight: 1.5,
        dimensions: 'Bouteille 75cl'
    },
    cheese: {
        id: 'cheese',
        name: 'Fromage Artisanal',
        price: 18,
        category: 'food',
        description: 'Fromage artisanal français',
        weight: 0.3,
        dimensions: '200g'
    },
    book1: {
        id: 'book1',
        name: 'Roman Bestseller',
        price: 22,
        category: 'books',
        description: 'Roman bestseller du moment',
        weight: 0.4,
        dimensions: '14x21 cm'
    },
    book2: {
        id: 'book2',
        name: 'Guide Cuisine',
        price: 28,
        category: 'books',
        description: 'Guide complet de cuisine',
        weight: 0.6,
        dimensions: '20x25 cm'
    },
    book3: {
        id: 'book3',
        name: 'Encyclopédie',
        price: 35,
        category: 'books',
        description: 'Encyclopédie illustrée',
        weight: 1.0,
        dimensions: '25x30 cm'
    },
    basketball: {
        id: 'basketball',
        name: 'Ballon de Basket',
        price: 35,
        category: 'sports',
        description: 'Ballon de basketball officiel',
        weight: 0.6,
        dimensions: 'Taille 7'
    },
    yogamat: {
        id: 'yogamat',
        name: 'Tapis de Yoga',
        price: 45,
        category: 'sports',
        description: 'Tapis de yoga antidérapant',
        weight: 1.0,
        dimensions: '180x60 cm'
    },
    dumbbells: {
        id: 'dumbbells',
        name: 'Haltères 5kg',
        price: 55,
        category: 'sports',
        description: 'Paire d\'haltères 5kg',
        weight: 10.0,
        dimensions: '2x 5kg'
    }
};

/**
 * Get product info by ID
 */
function getProductInfo(productId) {
    return PRODUCT_CATALOG[productId] || null;
}

/**
 * Get all products in a category
 */
function getProductsByCategory(category) {
    return Object.values(PRODUCT_CATALOG).filter(
        product => product.category === category
    );
}

/**
 * Initialize product hover effects
 */
function initProductHoverEffects() {
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        // Store original position
        const originalScale = product.getAttribute('scale') || '1 1 1';
        
        // Mouse enter - scale up
        product.addEventListener('mouseenter', function() {
            this.setAttribute('animation__scale', {
                property: 'scale',
                to: '1.15 1.15 1.15',
                dur: 200,
                easing: 'easeOutQuad'
            });
            
            // Add glow effect
            this.setAttribute('animation__glow', {
                property: 'material.emissive',
                to: '#4CC3D9',
                dur: 200
            });
        });
        
        // Mouse leave - scale back
        product.addEventListener('mouseleave', function() {
            this.setAttribute('animation__scale', {
                property: 'scale',
                to: originalScale,
                dur: 200,
                easing: 'easeInQuad'
            });
            
            // Remove glow effect
            this.setAttribute('animation__glow', {
                property: 'material.emissive',
                to: '#000000',
                dur: 200
            });
        });
    });
}

/**
 * Handle product selection in VR
 */
function handleProductClick(productElement) {
    const productId = productElement.getAttribute('data-id');
    const productInfo = getProductInfo(productId);
    
    if (!productInfo) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Add visual feedback
    productElement.emit('product-selected');
    
    // Play selection animation
    animateProductSelection(productElement);
    
    return productInfo;
}

/**
 * Animate product selection
 */
function animateProductSelection(productElement) {
    // Bounce animation
    productElement.setAttribute('animation__bounce', {
        property: 'position',
        to: `${productElement.getAttribute('position').x} ${parseFloat(productElement.getAttribute('position').y) + 0.3} ${productElement.getAttribute('position').z}`,
        dur: 300,
        dir: 'alternate',
        loop: 2,
        easing: 'easeInOutQuad'
    });
    
    // Rotation animation
    productElement.setAttribute('animation__spin', {
        property: 'rotation',
        to: '0 360 0',
        dur: 600,
        easing: 'easeInOutCubic'
    });
}

/**
 * Create floating price tag in VR
 */
function createPriceTag(price, position) {
    const priceTag = document.createElement('a-text');
    priceTag.setAttribute('value', `${price}€`);
    priceTag.setAttribute('position', position);
    priceTag.setAttribute('align', 'center');
    priceTag.setAttribute('color', '#FFD700');
    priceTag.setAttribute('width', '3');
    priceTag.setAttribute('animation', {
        property: 'position',
        to: `${position.x} ${position.y + 0.5} ${position.z}`,
        dur: 1000,
        easing: 'easeOutQuad'
    });
    priceTag.setAttribute('animation__fade', {
        property: 'material.opacity',
        from: 1,
        to: 0,
        dur: 1000,
        delay: 500
    });
    
    return priceTag;
}

/**
 * Show product details in VR space
 */
function showProductDetailsInVR(productId, position) {
    const product = getProductInfo(productId);
    if (!product) return;
    
    // Create detail panel
    const panel = document.createElement('a-entity');
    panel.setAttribute('position', `${position.x} ${position.y + 1.5} ${position.z - 1}`);
    
    // Background
    const bg = document.createElement('a-plane');
    bg.setAttribute('width', '2');
    bg.setAttribute('height', '1.5');
    bg.setAttribute('color', '#FFFFFF');
    bg.setAttribute('opacity', '0.9');
    panel.appendChild(bg);
    
    // Product name
    const name = document.createElement('a-text');
    name.setAttribute('value', product.name);
    name.setAttribute('position', '0 0.5 0.01');
    name.setAttribute('align', 'center');
    name.setAttribute('width', '1.8');
    name.setAttribute('color', '#000000');
    panel.appendChild(name);
    
    // Price
    const price = document.createElement('a-text');
    price.setAttribute('value', `Prix: ${product.price}€`);
    price.setAttribute('position', '0 0.2 0.01');
    price.setAttribute('align', 'center');
    price.setAttribute('width', '1.8');
    price.setAttribute('color', '#E74C3C');
    panel.appendChild(price);
    
    // Description
    const desc = document.createElement('a-text');
    desc.setAttribute('value', product.description);
    desc.setAttribute('position', '0 -0.2 0.01');
    desc.setAttribute('align', 'center');
    desc.setAttribute('width', '1.8');
    desc.setAttribute('color', '#333333');
    panel.appendChild(desc);
    
    // Add to scene
    const scene = document.querySelector('a-scene');
    scene.appendChild(panel);
    
    // Remove after delay
    setTimeout(() => {
        panel.setAttribute('animation', {
            property: 'scale',
            to: '0 0 0',
            dur: 300
        });
        setTimeout(() => panel.remove(), 300);
    }, 3000);
}

/**
 * Calculate shipping cost based on cart
 */
function calculateShipping(cart) {
    let totalWeight = 0;
    
    cart.forEach(item => {
        const product = getProductInfo(item.id);
        if (product && product.weight) {
            totalWeight += product.weight * item.quantity;
        }
    });
    
    // Basic shipping calculation
    let shippingCost = 5; // Base cost
    
    if (totalWeight > 5) {
        shippingCost += (totalWeight - 5) * 2;
    }
    
    // Free shipping over 100€
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal >= 100) {
        shippingCost = 0;
    }
    
    return {
        cost: shippingCost,
        weight: totalWeight,
        freeShipping: cartTotal >= 100
    };
}

/**
 * Initialize product interactions when document loads
 */
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        const scene = document.querySelector('a-scene');
        if (scene) {
            if (scene.hasLoaded) {
                initProductHoverEffects();
            } else {
                scene.addEventListener('loaded', initProductHoverEffects);
            }
        }
    });
}
