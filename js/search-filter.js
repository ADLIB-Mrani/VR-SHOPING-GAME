/**
 * Product Search and Filter System
 * Provides search and category filtering functionality
 */

// Current filter state
let currentCategory = 'all';
let currentSearchQuery = '';

/**
 * Initialize search and filter functionality
 */
function initSearchAndFilter() {
    // Create search and filter UI
    createSearchFilterUI();
    
    // Set up event listeners
    setupSearchListeners();
    setupFilterListeners();
}

/**
 * Create search and filter UI elements
 */
function createSearchFilterUI() {
    const cartPanel = document.getElementById('cart-panel');
    if (!cartPanel) return;
    
    // Create container for search and filter
    const filterContainer = document.createElement('div');
    filterContainer.id = 'filter-container';
    filterContainer.innerHTML = `
        <div class="search-box">
            <input type="text" id="product-search" placeholder="🔍 Rechercher un produit..." aria-label="Rechercher des produits">
            <button id="clear-search" class="clear-search-btn" style="display:none;" aria-label="Effacer la recherche">✕</button>
        </div>
        <div class="category-filter">
            <label for="category-select">Catégorie:</label>
            <select id="category-select" aria-label="Filtrer par catégorie">
                <option value="all">Toutes</option>
                <option value="electronics">Électronique</option>
                <option value="clothing">Vêtements</option>
                <option value="home">Décoration</option>
                <option value="food">Alimentation</option>
                <option value="books">Livres</option>
                <option value="sports">Sport</option>
            </select>
        </div>
        <div id="search-results-info" class="search-info" style="display:none;"></div>
    `;
    
    // Insert before cart panel
    cartPanel.parentNode.insertBefore(filterContainer, cartPanel);
}

/**
 * Set up search input listeners
 */
function setupSearchListeners() {
    const searchInput = document.getElementById('product-search');
    const clearBtn = document.getElementById('clear-search');
    
    if (!searchInput) return;
    
    // Debounced search function
    const debouncedSearch = debounce((query) => {
        performSearch(query);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        currentSearchQuery = query;
        
        // Show/hide clear button
        if (clearBtn) {
            clearBtn.style.display = query ? 'block' : 'none';
        }
        
        debouncedSearch(query);
    });
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchQuery = '';
            clearBtn.style.display = 'none';
            performSearch('');
        });
    }
}

/**
 * Set up category filter listeners
 */
function setupFilterListeners() {
    const categorySelect = document.getElementById('category-select');
    
    if (!categorySelect) return;
    
    categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        applyFilters();
    });
}

/**
 * Perform product search
 * @param {string} query - Search query
 */
function performSearch(query) {
    applyFilters();
}

/**
 * Apply both search and category filters
 */
function applyFilters() {
    const products = document.querySelectorAll('.product');
    let visibleCount = 0;
    let matchedProducts = [];
    
    products.forEach(product => {
        const productId = product.getAttribute('data-id');
        const productName = product.getAttribute('data-name');
        const productInfo = getProductInfo(productId);
        
        if (!productInfo) {
            product.style.display = 'none';
            return;
        }
        
        // Check category filter
        const categoryMatch = currentCategory === 'all' || 
                            productInfo.category === currentCategory;
        
        // Check search query
        const searchMatch = !currentSearchQuery || 
                          productName.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          productInfo.description.toLowerCase().includes(currentSearchQuery.toLowerCase());
        
        // Show or hide product
        if (categoryMatch && searchMatch) {
            product.style.display = '';
            visibleCount++;
            matchedProducts.push(productName);
        } else {
            product.style.display = 'none';
        }
        
        // Also handle parent sections visibility
        const parent = product.closest('a-entity[position]');
        if (parent && parent.querySelector('.product[style*="display"]')) {
            const visibleInSection = Array.from(parent.querySelectorAll('.product'))
                .some(p => p.style.display !== 'none');
            // Don't hide sections, just let products be hidden
        }
    });
    
    // Update search results info
    updateSearchInfo(visibleCount, products.length);
    
    // Log for debugging
    console.log(`Filters applied: Category="${currentCategory}", Search="${currentSearchQuery}", Visible=${visibleCount}/${products.length}`);
}

/**
 * Update search results information
 * @param {number} visibleCount - Number of visible products
 * @param {number} totalCount - Total number of products
 */
function updateSearchInfo(visibleCount, totalCount) {
    const infoDiv = document.getElementById('search-results-info');
    if (!infoDiv) return;
    
    if (currentSearchQuery || currentCategory !== 'all') {
        infoDiv.style.display = 'block';
        
        if (visibleCount === 0) {
            infoDiv.innerHTML = '❌ Aucun produit trouvé';
            infoDiv.className = 'search-info no-results';
        } else if (visibleCount < totalCount) {
            infoDiv.innerHTML = `✓ ${visibleCount} produit${visibleCount > 1 ? 's' : ''} trouvé${visibleCount > 1 ? 's' : ''}`;
            infoDiv.className = 'search-info has-results';
        } else {
            infoDiv.style.display = 'none';
        }
    } else {
        infoDiv.style.display = 'none';
    }
}

/**
 * Reset all filters
 */
function resetFilters() {
    const searchInput = document.getElementById('product-search');
    const categorySelect = document.getElementById('category-select');
    const clearBtn = document.getElementById('clear-search');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (categorySelect) {
        categorySelect.value = 'all';
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    currentSearchQuery = '';
    currentCategory = 'all';
    
    applyFilters();
}

/**
 * Get products by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Array of products in price range
 */
function getProductsByPriceRange(minPrice, maxPrice) {
    return Object.values(PRODUCT_CATALOG).filter(
        product => product.price >= minPrice && product.price <= maxPrice
    );
}

/**
 * Sort products by criteria
 * @param {string} criteria - Sort criteria ('price-asc', 'price-desc', 'name')
 * @returns {Array} Sorted products array
 */
function sortProducts(criteria) {
    const products = Object.values(PRODUCT_CATALOG);
    
    switch (criteria) {
        case 'price-asc':
            return products.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return products.sort((a, b) => b.price - a.price);
        case 'name':
            return products.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        default:
            return products;
    }
}

// Initialize search and filter when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        // Wait for VR scene to load
        setTimeout(() => {
            initSearchAndFilter();
        }, 1000);
    });
}
