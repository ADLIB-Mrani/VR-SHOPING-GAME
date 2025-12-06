# 🎮 VR Shopping Game - Magasin en Réalité Virtuelle

Un jeu de shopping en réalité virtuelle où vous faites vos achats dans un environnement VR immersif et recevez vos produits dans le monde réel grâce à un système de livraison intégré.

## 🌟 Fonctionnalités

### Expérience VR
- **Navigation Immersive**: Déplacez-vous librement dans un magasin virtuel 3D
- **Interactions Réalistes**: Regardez et cliquez sur les produits pour les examiner
- **Environnement Détaillé**: Magasin complet avec différentes sections (électronique, vêtements, décoration, alimentation)
- **Compatible VR/Desktop**: Fonctionne avec des casques VR (Oculus, HTC Vive) ou un navigateur classique

### Système de Shopping
- **Catalogue Produits**: 8+ produits dans différentes catégories
- **Panier Interactif**: Ajoutez, supprimez et modifiez les quantités en temps réel
- **Prix Dynamiques**: Calcul automatique du total avec mise à jour instantanée
- **Interface Intuitive**: UI moderne et responsive

### Livraison Réelle
- **Formulaire de Livraison**: Saisie complète des informations de livraison
- **Intégration API**: Connexion avec services de livraison réels (Colissimo, Chronopost, DHL)
- **Suivi de Commande**: Numéro de suivi et estimation de livraison
- **Historique**: Conservation de toutes vos commandes

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
2. **Sélectionner**: Regardez un produit et cliquez dessus pour l'ajouter au panier
3. **Gérer le panier**: Utilisez le panneau à droite pour modifier les quantités
4. **Commander**: Cliquez sur "Commander" et remplissez le formulaire de livraison
5. **Confirmer**: Votre commande est envoyée et sera livrée dans le monde réel!

## 📦 Structure du Projet

```
VR-SHOPING-GAME/
├── index.html              # Page principale VR
├── package.json            # Configuration npm
├── API.md                  # Documentation API
├── README.md               # Ce fichier
├── css/
│   └── style.css          # Styles de l'interface
├── js/
│   ├── vr-store.js        # Logique principale du magasin
│   ├── cart-system.js     # Système de panier
│   ├── product-interactions.js  # Interactions produits
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
- **JavaScript ES6+**: Logique applicative moderne
- **CSS3**: Interface utilisateur responsive

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

- Données stockées localement dans le navigateur
- Pas de transmission de données sensibles sans HTTPS
- Validation des formulaires côté client
- API sécurisée avec authentification (en production)

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
- Vérifiez que LocalStorage est activé
- Videz le cache du navigateur
- Vérifiez la console pour les erreurs

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

- [ ] Ajout de plus de produits et catégories
- [ ] Intégration de modèles 3D réalistes
- [ ] Système de paiement en ligne
- [ ] Multijoueur (shopping avec des amis)
- [ ] Support de plus de langues
- [ ] Mode démo guidé
- [ ] Intégration avec services de livraison réels
- [ ] Application mobile VR

---

**Fait avec ❤️ pour la communauté VR**