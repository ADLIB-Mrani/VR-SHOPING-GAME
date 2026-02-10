# 🎮 VR Shopping Game - Magasin en Réalité Virtuelle

Un jeu de shopping en réalité virtuelle où vous faites vos achats dans un environnement VR immersif et recevez vos produits dans le monde réel grâce à un système de livraison intégré.

## 🌟 Fonctionnalités

### Expérience VR
- **Navigation Immersive**: Déplacez-vous librement dans un magasin virtuel 3D
- **Interactions Réalistes**: Regardez et cliquez sur les produits pour les examiner
- **Environnement Détaillé**: Magasin complet avec 6 sections différentes
- **Compatible VR/Desktop**: Fonctionne avec des casques VR (Oculus, HTC Vive) ou un navigateur classique

### Système de Shopping Avancé
- **Catalogue Étendu**: 20+ produits dans 6 catégories différentes
- **Recherche de Produits**: Recherche en temps réel avec filtrage intelligent
- **Filtres par Catégorie**: Filtrez par Électronique, Vêtements, Décoration, Alimentation, Livres, Sport
- **Panier Interactif**: Ajoutez, supprimez et modifiez les quantités en temps réel
- **Prix Dynamiques**: Calcul automatique du total avec mise à jour instantanée
- **Livraison Gratuite**: Livraison offerte à partir de 100€
- **Interface Intuitive**: UI moderne, responsive et accessible

### Gestion des Commandes
- **Formulaire de Livraison Sécurisé**: Validation complète des informations de livraison
- **Validation Avancée**: Validation des codes postaux français et numéros de téléphone
- **Historique des Commandes**: Consultez toutes vos commandes passées avec détails complets
- **Protection XSS**: Tous les inputs sont validés et sanitisés
- **Persistance Intelligente**: Panier sauvegardé pendant 7 jours
- **Suivi de Commande**: Numéro de suivi et estimation de livraison

## 🚀 Installation

### ⚡ Installation Ultra-Rapide (0 dépendance!)

**La méthode la plus simple - Aucune installation requise!**

1. **Téléchargez** le projet (bouton vert "Code" → "Download ZIP")
2. **Décompressez** le fichier ZIP
3. **Double-cliquez** sur `index.html`
4. **C'est tout!** Le jeu se lance dans votre navigateur! 🎮

### 🔧 Installation avec Serveur Local (Recommandé pour développement)

#### Prérequis
- Navigateur web moderne (Chrome recommandé, Firefox, Edge, Safari)
- Connexion Internet (pour charger A-Frame)
- **Optionnel**: Node.js, Python, ou PHP pour serveur local
- **Optionnel**: Casque VR compatible WebXR

#### Étapes d'Installation

1. **Cloner le repository**
```bash
git clone https://github.com/ADLIB-Mrani/VR-SHOPING-GAME.git
cd VR-SHOPING-GAME
```

2. **Lancement Automatique** (Linux/Mac)
```bash
./start.sh
```

**Lancement Automatique** (Windows)
```batch
start.bat
```

**OU Installation manuelle:**

3. **Installer les dépendances** (optionnel)
```bash
npm install
```

4. **Lancer l'application** - Choisissez une méthode:

**Option A - Avec npm** (Recommandé):
```bash
npm start
```
→ Ouvre automatiquement dans le navigateur!

**Option B - Avec Python 3**:
```bash
python -m http.server 8080
```
→ Puis ouvrez `http://localhost:8080`

**Option C - Avec Python 2**:
```bash
python -m SimpleHTTPServer 8080
```
→ Puis ouvrez `http://localhost:8080`

**Option D - Avec PHP**:
```bash
php -S localhost:8080
```
→ Puis ouvrez `http://localhost:8080`

**Option E - Sans serveur**:
Double-cliquez sur `index.html` (peut avoir des limitations CORS)

### 📖 Guide Détaillé

Pour un guide d'installation détaillé avec dépannage, voir **[INSTALLATION.md](INSTALLATION.md)**

## 🎯 Utilisation

### Navigation
- **Souris**: Cliquez et déplacez pour regarder autour de vous
- **Clavier**: WASD ou touches fléchées pour vous déplacer
- **VR**: Utilisez les contrôleurs de votre casque pour naviguer

### Shopping
1. **Explorer**: Déplacez-vous dans le magasin pour découvrir les produits
2. **Rechercher**: Utilisez la barre de recherche pour trouver rapidement un produit
3. **Filtrer**: Sélectionnez une catégorie dans le menu déroulant pour filtrer les produits
4. **Sélectionner**: Regardez un produit et cliquez dessus pour l'ajouter au panier
5. **Gérer le panier**: Utilisez le panneau à droite pour modifier les quantités
6. **Voir l'historique**: Cliquez sur "📋 Mes commandes" pour voir vos commandes précédentes
7. **Commander**: Cliquez sur "Commander" et remplissez le formulaire de livraison
8. **Confirmer**: Votre commande est validée et sera livrée dans le monde réel!

### Fonctionnalités Avancées
- **Recherche en temps réel**: Tapez dans la barre de recherche pour filtrer instantanément
- **Filtres combinés**: Combinez recherche et filtre de catégorie
- **Badge livraison gratuite**: Apparaît automatiquement quand le total dépasse 100€
- **Validation intelligente**: Messages d'erreur clairs si les informations sont incorrectes

## 📦 Structure du Projet

```
VR-SHOPING-GAME/
├── index.html              # Page principale VR
├── package.json            # Configuration npm
├── API.md                  # Documentation API
├── README.md               # Ce fichier
├── SECURITY.md             # Guide de sécurité
├── css/
│   └── style.css          # Styles de l'interface
├── js/
│   ├── config.js          # Configuration centralisée
│   ├── utils.js           # Fonctions utilitaires
│   ├── vr-store.js        # Logique principale du magasin
│   ├── cart-system.js     # Système de panier
│   ├── product-interactions.js  # Interactions produits
│   ├── collision-system.js      # Système de collision
│   ├── proximity-purchase.js    # Achat de proximité
│   ├── search-filter.js         # Recherche et filtres
│   ├── order-history.js         # Historique des commandes
│   └── delivery-api.js    # Intégration livraison
└── assets/
    ├── textures/          # Textures pour l'environnement VR
    └── models/            # Modèles 3D (optionnel)
```

## 🛠️ Technologies Utilisées

- **A-Frame 1.4.2**: Framework VR pour le web
- **A-Frame Extras**: Composants additionnels pour A-Frame
- **WebXR**: API pour la réalité virtuelle web
- **LocalStorage**: Persistance des données (panier, commandes)
- **JavaScript ES6+**: Logique applicative moderne avec modules
- **CSS3**: Interface utilisateur responsive et accessible
- **JSDoc**: Documentation du code

## 🔒 Sécurité

Le projet implémente plusieurs couches de sécurité:

- **Validation des entrées**: Tous les formulaires sont validés côté client
- **Sanitisation HTML**: Protection contre les attaques XSS
- **Validation française**: Codes postaux (5 chiffres) et numéros de téléphone
- **Headers de sécurité**: Recommandations CSP et autres headers (voir [SECURITY.md](SECURITY.md))
- **Gestion des erreurs**: Messages d'erreur clairs et informatifs
- **Expiration du panier**: Les données expirent après 7 jours

Pour plus de détails sur la sécurité, consultez [SECURITY.md](SECURITY.md).

## 🔌 Intégration API

Le système peut s'intégrer avec des services de livraison réels. Consultez [API.md](API.md) pour la documentation complète.

### Exemple d'intégration:
```javascript
const deliveryAPI = new DeliveryAPI('YOUR_API_KEY');

// Créer une commande
const order = await deliveryAPI.createOrder(orderData);

// Suivre une commande
const tracking = await deliveryAPI.trackOrder(orderId);
```

## 🎨 Personnalisation

### Ajouter des Produits
Éditez `js/product-interactions.js` et ajoutez à `PRODUCT_CATALOG`:

```javascript
newproduct: {
    id: 'newproduct',
    name: 'Nouveau Produit',
    price: 99,
    category: 'electronics',
    description: 'Description du produit',
    weight: 1.0,
    dimensions: '20x20x10 cm'
}
```

### Modifier l'Environnement VR
Éditez `index.html` dans la section `<a-scene>` pour:
- Changer les couleurs
- Ajouter des lumières
- Modifier la disposition des produits
- Ajouter des textures personnalisées

## 🔐 Sécurité et Confidentialité

- **Validation avancée**: Validation des codes postaux français (5 chiffres) et numéros de téléphone
- **Protection XSS**: Sanitisation de toutes les entrées utilisateur
- **Données locales**: Stockage sécurisé dans le navigateur avec expiration automatique
- **Pas de transmission sensible**: Aucune donnée sensible transmise sans HTTPS
- **Messages d'erreur clairs**: Validation des formulaires avec retours informatifs
- **API sécurisée**: Authentification recommandée pour la production (voir [SECURITY.md](SECURITY.md))

## 🐛 Dépannage

### Le magasin VR ne se charge pas
- Vérifiez votre connexion Internet
- Assurez-vous que JavaScript est activé
- Essayez un autre navigateur

### Les produits ne sont pas cliquables
- Vérifiez que le curseur VR est actif
- Essayez de vous rapprocher des produits
- Rechargez la page

### Le panier ne se met pas à jour
- Vérifiez que LocalStorage est activé dans votre navigateur
- Videz le cache du navigateur si nécessaire
- Vérifiez la console pour les erreurs JavaScript
- Le panier expire automatiquement après 7 jours

### La recherche ne fonctionne pas
- Assurez-vous que JavaScript est activé
- Vérifiez que le scène VR est complètement chargée
- Rechargez la page si nécessaire

### Problèmes de validation du formulaire
- Les codes postaux doivent être au format français (5 chiffres)
- Les numéros de téléphone doivent être valides (format français)
- Tous les champs sont requis et ont des longueurs minimales/maximales

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **ADLIB-Mrani** - *Créateur initial*

## 🙏 Remerciements

- A-Frame pour le framework VR
- La communauté WebXR
- Tous les contributeurs

## 📧 Contact

Pour toute question ou suggestion:
- GitHub Issues: https://github.com/ADLIB-Mrani/VR-SHOPING-GAME/issues
- Email: support@vr-store.com

## 🔮 Roadmap

### Fonctionnalités Implémentées ✅
- [x] 20+ produits dans 6 catégories
- [x] Recherche de produits en temps réel
- [x] Filtres par catégorie
- [x] Historique des commandes complet
- [x] Validation avancée des formulaires
- [x] Protection XSS et sécurité renforcée
- [x] Livraison gratuite à partir de 100€
- [x] Interface accessible et responsive
- [x] Système de collision et physique
- [x] Achat par proximité (style Call of Duty)
- [x] Glisser-déposer vers le panier

### Prochaines Améliorations 🚀
- [ ] Intégration de modèles 3D réalistes pour les produits
- [ ] Système de paiement en ligne sécurisé
- [ ] Mode multijoueur (shopping avec des amis)
- [ ] Support de plus de langues (anglais, espagnol)
- [ ] Mode démo guidé pour nouveaux utilisateurs
- [ ] Intégration avec services de livraison réels via API
- [ ] Application mobile VR native
- [ ] Système de recommandations de produits
- [ ] Avis et notes des produits
- [ ] Programme de fidélité

---

**Fait avec ❤️ pour la communauté VR**