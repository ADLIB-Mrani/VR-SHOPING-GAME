# API de Livraison - Documentation

## Vue d'ensemble

Ce document décrit l'intégration de l'API de livraison pour le magasin VR. Le système permet de passer des commandes en VR et de recevoir les produits dans le monde réel.

## Architecture

```
VR Store (Frontend) → API Backend → Service de Livraison → Monde Réel
```

## Endpoints API

### 1. Créer une commande

**POST** `/api/orders`

Crée une nouvelle commande de livraison.

**Request Body:**
```json
{
  "orderId": "VR1701234567890123",
  "customer": {
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+33612345678",
    "address": {
      "street": "123 Rue de la Paix",
      "city": "Paris",
      "postalCode": "75001",
      "country": "France"
    }
  },
  "items": [
    {
      "id": "laptop",
      "name": "Ordinateur Portable",
      "quantity": 1,
      "price": 999.00,
      "weight": 2.5,
      "dimensions": "35x25x2 cm"
    }
  ],
  "total": 999.00,
  "currency": "EUR",
  "timestamp": "2024-12-06T16:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "VR1701234567890123",
  "trackingNumber": "FR123456789",
  "estimatedDelivery": "2024-12-09",
  "deliveryStatus": "pending",
  "message": "Commande créée avec succès"
}
```

### 2. Suivre une commande

**GET** `/api/orders/:orderId`

Récupère le statut d'une commande.

**Response:**
```json
{
  "orderId": "VR1701234567890123",
  "trackingNumber": "FR123456789",
  "status": "in_transit",
  "estimatedDelivery": "2024-12-09",
  "currentLocation": "Centre de tri Paris",
  "history": [
    {
      "timestamp": "2024-12-06T16:00:00Z",
      "status": "order_placed",
      "location": "Magasin VR"
    },
    {
      "timestamp": "2024-12-06T18:30:00Z",
      "status": "dispatched",
      "location": "Entrepôt Paris"
    }
  ]
}
```

### 3. Annuler une commande

**DELETE** `/api/orders/:orderId`

Annule une commande si elle n'a pas encore été expédiée.

**Response:**
```json
{
  "success": true,
  "orderId": "VR1701234567890123",
  "message": "Commande annulée avec succès",
  "refund": {
    "amount": 999.00,
    "currency": "EUR",
    "method": "original_payment",
    "estimatedDate": "2024-12-13"
  }
}
```

## Statuts de Commande

| Statut | Description |
|--------|-------------|
| `pending` | Commande créée, en attente de traitement |
| `confirmed` | Commande confirmée |
| `preparing` | Préparation de la commande |
| `dispatched` | Expédiée de l'entrepôt |
| `in_transit` | En cours de livraison |
| `out_for_delivery` | En cours de livraison finale |
| `delivered` | Livrée |
| `cancelled` | Annulée |
| `failed` | Échec de livraison |

## Webhooks

Le système peut envoyer des notifications webhook lors des événements importants:

**POST** `{your_webhook_url}`

```json
{
  "event": "order_delivered",
  "orderId": "VR1701234567890123",
  "timestamp": "2024-12-09T14:30:00Z",
  "data": {
    "deliveredTo": "Jean Dupont",
    "signature": "base64_signature_image",
    "photo": "base64_delivery_photo"
  }
}
```

## Intégration avec Services de Livraison

Le système peut s'intégrer avec plusieurs services de livraison:

- **Colissimo** (France)
- **Chronopost** (Express)
- **DHL** (International)
- **UPS** (International)
- **FedEx** (International)

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide |
| 401 | Non autorisé |
| 404 | Commande introuvable |
| 409 | Conflit (commande déjà annulée, etc.) |
| 500 | Erreur serveur |

## Authentification

Les requêtes API nécessitent une clé API dans les headers:

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Limites de Taux

- 100 requêtes par minute
- 1000 requêtes par heure

## Exemple d'Implémentation

```javascript
async function createOrder(orderData) {
  try {
    const response = await fetch('https://api.vr-store.com/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw error;
  }
}
```

## Support

Pour toute question ou problème:
- Email: support@vr-store.com
- Documentation: https://docs.vr-store.com
- GitHub Issues: https://github.com/ADLIB-Mrani/VR-SHOPING-GAME/issues
