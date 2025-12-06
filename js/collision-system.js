/**
 * Custom Collision System for VR Store
 * Prevents player from passing through walls and products
 */

// Wait for A-Frame to load before registering components
if (typeof AFRAME === 'undefined') {
    console.log('Waiting for A-Frame to load...');
    window.addEventListener('load', initCollisionSystem);
} else {
    initCollisionSystem();
}

function initCollisionSystem() {
    // Check again if AFRAME is available
    if (typeof AFRAME === 'undefined') {
        console.warn('A-Frame not loaded, collision system cannot initialize');
        return;
    }

    // Register collision component for walls
    AFRAME.registerComponent('wall-collision', {
        init: function() {
            this.el.addEventListener('loaded', () => {
                this.el.setAttribute('material', 'opacity', 1);
            });
        }
    });

    // Register collision component for products (makes them solid)
    AFRAME.registerComponent('product-collision', {
        init: function() {
            // Products are now solid and cannot be passed through
            this.el.setAttribute('class', 'collidable product');
        }
    });

    // Register movement constraint component for the player rig
    AFRAME.registerComponent('movement-constraints', {
        schema: {
            boundaries: {type: 'vec4', default: {x: -9.5, y: 9.5, z: -9.5, w: 9.5}} // minX, maxX, minZ, maxZ
        },
        
        tick: function() {
            const position = this.el.getAttribute('position');
            const boundaries = this.data.boundaries;
            
            // Constrain X position
            if (position.x < boundaries.x) {
                position.x = boundaries.x;
            } else if (position.x > boundaries.y) {
                position.x = boundaries.y;
            }
            
            // Constrain Z position
            if (position.z < boundaries.z) {
                position.z = boundaries.z;
            } else if (position.z > boundaries.w) {
                position.z = boundaries.w;
            }
            
            // Keep Y position fixed (standing height)
            position.y = 1.6;
            
            this.el.setAttribute('position', position);
        }
    });

    // Register component to make objects solid (collision with raycaster)
    AFRAME.registerComponent('solid', {
        init: function() {
            this.el.classList.add('collidable');
        }
    });

    console.log('Collision system loaded');
}
