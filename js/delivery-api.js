/**
 * Delivery API Integration
 * Handles real-world delivery integration
 */

class DeliveryAPI {
    constructor(apiKey = null, baseURL = 'https://api.vr-store.com') {
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.timeout = 30000; // 30 seconds
    }

    /**
     * Create a delivery order with retry logic
     */
    async createOrder(orderData) {
        const maxRetries = 3;
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const payload = this.formatOrderPayload(orderData);
                
                // In production, this would make a real API call
                // const response = await this.makeRequest('/api/orders', 'POST', payload);
                
                // For demo purposes, simulate API response
                const response = await this.simulateAPICall(payload);
                
                console.log('Order created successfully:', response);
                return response;
            } catch (error) {
                lastError = error;
                console.warn(`Order creation attempt ${attempt} failed:`, error);
                
                if (attempt < maxRetries) {
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }
        
        console.error('Failed to create order after all retries:', lastError);
        throw new Error('Unable to create order. Please try again later.');
    }

    /**
     * Track an order
     */
    async trackOrder(orderId) {
        try {
            // const response = await this.makeRequest(`/api/orders/${orderId}`, 'GET');
            const response = await this.simulateTrackingData(orderId);
            return response;
        } catch (error) {
            console.error('Failed to track order:', error);
            throw error;
        }
    }

    /**
     * Cancel an order
     */
    async cancelOrder(orderId, reason = '') {
        try {
            const payload = { orderId, reason };
            // const response = await this.makeRequest(`/api/orders/${orderId}`, 'DELETE', payload);
            const response = await this.simulateCancellation(orderId, reason);
            return response;
        } catch (error) {
            console.error('Failed to cancel order:', error);
            throw error;
        }
    }

    /**
     * Get delivery estimate
     */
    async getDeliveryEstimate(address) {
        try {
            const response = await this.calculateDeliveryTime(address);
            return response;
        } catch (error) {
            console.error('Failed to get delivery estimate:', error);
            throw error;
        }
    }

    /**
     * Format order payload for API
     */
    formatOrderPayload(orderData) {
        return {
            orderId: orderData.orderNumber,
            customer: {
                name: orderData.name,
                email: orderData.email || '',
                phone: orderData.phone,
                address: {
                    street: orderData.address,
                    city: orderData.city,
                    postalCode: orderData.postal,
                    country: 'France'
                }
            },
            items: orderData.items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                weight: this.getProductWeight(item.id),
                dimensions: this.getProductDimensions(item.id)
            })),
            total: orderData.total,
            currency: 'EUR',
            timestamp: orderData.orderDate,
            deliveryPreferences: {
                preferredDate: null,
                leaveAtDoor: false,
                requiresSignature: orderData.total > 500
            }
        };
    }

    /**
     * Make HTTP request to API
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: this.timeout
        };

        if (this.apiKey) {
            options.headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Simulate API call for demo
     */
    async simulateAPICall(payload) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const trackingNumber = this.generateTrackingNumber();
                const estimatedDelivery = this.calculateEstimatedDelivery();
                
                resolve({
                    success: true,
                    orderId: payload.orderId,
                    trackingNumber: trackingNumber,
                    estimatedDelivery: estimatedDelivery,
                    deliveryStatus: 'pending',
                    message: 'Commande créée avec succès',
                    carrier: this.selectCarrier(payload.items),
                    shippingCost: this.calculateShippingCost(payload.items)
                });
            }, 500); // Simulate network delay
        });
    }

    /**
     * Simulate tracking data
     */
    async simulateTrackingData(orderId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    orderId: orderId,
                    trackingNumber: this.generateTrackingNumber(),
                    status: 'in_transit',
                    estimatedDelivery: this.calculateEstimatedDelivery(),
                    currentLocation: 'Centre de tri',
                    history: [
                        {
                            timestamp: new Date().toISOString(),
                            status: 'order_placed',
                            location: 'Magasin VR'
                        },
                        {
                            timestamp: new Date(Date.now() - 3600000).toISOString(),
                            status: 'dispatched',
                            location: 'Entrepôt'
                        }
                    ]
                });
            }, 300);
        });
    }

    /**
     * Simulate order cancellation
     */
    async simulateCancellation(orderId, reason) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    orderId: orderId,
                    message: 'Commande annulée avec succès',
                    refund: {
                        amount: 0, // Would be calculated
                        currency: 'EUR',
                        method: 'original_payment',
                        estimatedDate: new Date(Date.now() + 7 * 24 * 3600000).toISOString()
                    }
                });
            }, 300);
        });
    }

    /**
     * Generate tracking number
     */
    generateTrackingNumber() {
        const prefix = 'FR';
        const number = Math.floor(100000000 + Math.random() * 900000000);
        return `${prefix}${number}`;
    }

    /**
     * Calculate estimated delivery date
     */
    calculateEstimatedDelivery() {
        const days = Math.floor(Math.random() * 3) + 2; // 2-4 days
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    /**
     * Calculate delivery time based on address
     */
    async calculateDeliveryTime(address) {
        // Simple calculation based on postal code
        const postalCode = address.postal || '';
        let days = 3;

        if (postalCode.startsWith('75')) { // Paris
            days = 1;
        } else if (postalCode.startsWith('9')) { // Overseas
            days = 7;
        }

        return {
            estimatedDays: days,
            estimatedDate: new Date(Date.now() + days * 24 * 3600000).toLocaleDateString('fr-FR')
        };
    }

    /**
     * Select appropriate carrier
     */
    selectCarrier(items) {
        const totalWeight = items.reduce((sum, item) => {
            return sum + (this.getProductWeight(item.id) * item.quantity);
        }, 0);

        if (totalWeight > 10) {
            return 'DHL';
        } else if (totalWeight > 5) {
            return 'Chronopost';
        } else {
            return 'Colissimo';
        }
    }

    /**
     * Calculate shipping cost
     */
    calculateShippingCost(items) {
        const totalWeight = items.reduce((sum, item) => {
            return sum + (this.getProductWeight(item.id) * item.quantity);
        }, 0);

        let cost = 5; // Base cost

        if (totalWeight > 5) {
            cost += (totalWeight - 5) * 2;
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Free shipping over 100€
        if (total >= 100) {
            cost = 0;
        }

        return cost;
    }

    /**
     * Get product weight (mock data)
     */
    getProductWeight(productId) {
        const weights = {
            laptop: 2.5,
            phone: 0.2,
            tshirt: 0.2,
            jeans: 0.6,
            lamp: 1.5,
            vase: 1.2,
            coffee: 0.5,
            chocolate: 0.2
        };
        return weights[productId] || 1.0;
    }

    /**
     * Get product dimensions (mock data)
     */
    getProductDimensions(productId) {
        const dimensions = {
            laptop: '35x25x2 cm',
            phone: '15x7x0.8 cm',
            tshirt: '30x25x5 cm',
            jeans: '35x30x5 cm',
            lamp: '40x20x20 cm',
            vase: '25x15x15 cm',
            coffee: '20x10x10 cm',
            chocolate: '15x10x2 cm'
        };
        return dimensions[productId] || '20x20x10 cm';
    }

    /**
     * Validate delivery address
     */
    validateAddress(address) {
        const errors = [];

        if (!address.street || address.street.length < 5) {
            errors.push('Adresse invalide');
        }

        if (!address.city || address.city.length < 2) {
            errors.push('Ville invalide');
        }

        // Validate postal code (French format by default, can be extended)
        if (!address.postalCode || (address.country === 'France' && !/^\d{5}$/.test(address.postalCode))) {
            errors.push('Code postal invalide (format requis selon le pays)');
        }

        if (!address.phone || !/^(\+33|0)[1-9]\d{8}$/.test(address.phone.replace(/\s/g, ''))) {
            errors.push('Numéro de téléphone invalide');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

// Create global instance
const deliveryAPI = new DeliveryAPI();
