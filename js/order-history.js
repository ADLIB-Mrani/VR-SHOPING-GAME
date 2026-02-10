/**
 * Order History System
 * Displays and manages customer order history
 */

/**
 * Initialize order history functionality
 */
function initOrderHistory() {
    createOrderHistoryButton();
    createOrderHistoryModal();
}

/**
 * Create order history button
 */
function createOrderHistoryButton() {
    const cartPanel = document.getElementById('cart-panel');
    if (!cartPanel) return;
    
    // Check if button already exists
    if (document.getElementById('view-orders-btn')) return;
    
    const button = document.createElement('button');
    button.id = 'view-orders-btn';
    button.className = 'view-orders-btn';
    button.textContent = '📋 Mes commandes';
    button.onclick = showOrderHistory;
    
    // Insert before checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.parentNode.insertBefore(button, checkoutBtn);
    } else {
        cartPanel.appendChild(button);
    }
}

/**
 * Create order history modal
 */
function createOrderHistoryModal() {
    // Check if modal already exists
    if (document.getElementById('order-history-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'order-history-modal';
    modal.className = 'modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content order-history-content">
            <div class="modal-header">
                <h2>📋 Historique des Commandes</h2>
                <button class="close-modal-btn" onclick="closeOrderHistory()" aria-label="Fermer">&times;</button>
            </div>
            <div id="order-history-list" class="order-history-list">
                <!-- Order list will be populated here -->
            </div>
        </div>
    `;
    
    document.getElementById('ui-overlay').appendChild(modal);
}

/**
 * Show order history modal
 */
function showOrderHistory() {
    const modal = document.getElementById('order-history-modal');
    const orderList = document.getElementById('order-history-list');
    
    if (!modal || !orderList) return;
    
    // Load order history
    loadOrderHistory();
    
    // Populate order list
    if (orderHistory.length === 0) {
        orderList.innerHTML = `
            <div class="empty-orders">
                <p>Vous n'avez pas encore passé de commande.</p>
                <p>Commencez vos achats dans le magasin VR!</p>
            </div>
        `;
    } else {
        let html = '';
        
        // Sort orders by date (newest first)
        const sortedOrders = [...orderHistory].sort((a, b) => {
            return new Date(b.orderDate) - new Date(a.orderDate);
        });
        
        sortedOrders.forEach(order => {
            const orderDate = formatDate(order.orderDate);
            const totalPrice = formatPrice(order.total);
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            html += `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-number">
                            <strong>Commande:</strong> ${sanitizeHTML(order.orderNumber)}
                        </span>
                        <span class="order-date">${orderDate}</span>
                    </div>
                    <div class="order-details">
                        <div class="order-info">
                            <p><strong>Client:</strong> ${sanitizeHTML(order.name)}</p>
                            <p><strong>Adresse:</strong> ${sanitizeHTML(order.address)}, ${sanitizeHTML(order.city)} ${sanitizeHTML(order.postal)}</p>
                            <p><strong>Téléphone:</strong> ${sanitizeHTML(order.phone)}</p>
                        </div>
                        <div class="order-items">
                            <strong>Articles (${itemCount}):</strong>
                            <ul>
                                ${order.items.map(item => `
                                    <li>${sanitizeHTML(item.name)} × ${item.quantity} - ${formatPrice(item.price * item.quantity)}</li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="order-total">
                            <strong>Total:</strong> ${totalPrice}
                        </div>
                    </div>
                </div>
            `;
        });
        
        orderList.innerHTML = html;
    }
    
    // Show modal
    modal.style.display = 'flex';
}

/**
 * Close order history modal
 */
function closeOrderHistory() {
    const modal = document.getElementById('order-history-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Delete an order from history
 * @param {string} orderId - Order ID to delete
 */
function deleteOrder(orderId) {
    if (!confirm('Voulez-vous vraiment supprimer cette commande de l\'historique?')) {
        return;
    }
    
    const index = orderHistory.findIndex(order => order.orderNumber === orderId);
    if (index !== -1) {
        orderHistory.splice(index, 1);
        saveOrderHistory();
        showOrderHistory(); // Refresh the display
        showNotification('Commande supprimée de l\'historique');
    }
}

/**
 * Clear all order history
 */
function clearOrderHistory() {
    if (orderHistory.length === 0) {
        showNotification('L\'historique est déjà vide');
        return;
    }
    
    if (!confirm('Voulez-vous vraiment supprimer tout l\'historique des commandes?')) {
        return;
    }
    
    orderHistory = [];
    saveOrderHistory();
    showOrderHistory(); // Refresh the display
    showNotification('Historique effacé');
}

/**
 * Export order history to JSON
 */
function exportOrderHistory() {
    if (orderHistory.length === 0) {
        showNotification('Aucune commande à exporter');
        return;
    }
    
    const dataStr = JSON.stringify(orderHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vr-store-orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Historique exporté');
}

/**
 * Get order statistics
 * @returns {Object} Order statistics
 */
function getOrderStatistics() {
    if (orderHistory.length === 0) {
        return {
            totalOrders: 0,
            totalSpent: 0,
            totalItems: 0,
            averageOrderValue: 0
        };
    }
    
    const totalOrders = orderHistory.length;
    const totalSpent = orderHistory.reduce((sum, order) => sum + order.total, 0);
    const totalItems = orderHistory.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
    const averageOrderValue = totalSpent / totalOrders;
    
    return {
        totalOrders,
        totalSpent,
        totalItems,
        averageOrderValue
    };
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            initOrderHistory();
        }, 1000);
    });
}
