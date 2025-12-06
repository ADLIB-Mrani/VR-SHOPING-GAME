# 🎮 Démo VR Shopping Game

## Guide de Démarrage Rapide

### 1. Lancer l'Application

```bash
# Option 1: Avec npm (recommandé)
npm start

# Option 2: Avec Python
python3 -m http.server 8080

# Option 3: Ouvrir directement index.html
```

Puis ouvrir: `http://localhost:8080`

### 2. Navigation dans le Magasin VR

#### Contrôles Clavier/Souris
- **WASD** ou **Flèches** : Se déplacer
- **Souris** : Regarder autour
- **Clic** : Sélectionner un produit

#### Contrôles VR
- **Téléportation** : Pointez et cliquez pour vous déplacer
- **Regarder** : Tournez la tête naturellement
- **Sélectionner** : Pointez le curseur VR sur un produit et déclenchez

### 3. Faire du Shopping

1. **Explorer le Magasin**
   - Déplacez-vous dans les différentes sections
   - 4 zones : Électronique, Vêtements, Décoration, Alimentation

2. **Examiner les Produits**
   - Approchez-vous des produits
   - Le produit s'agrandit au survol
   - Les informations s'affichent en dessous

3. **Ajouter au Panier**
   - Cliquez sur un produit pour l'ajouter
   - Une notification confirme l'ajout
   - Le panier se met à jour automatiquement

4. **Gérer le Panier**
   - Panneau à droite de l'écran
   - Boutons +/- pour modifier les quantités
   - Bouton ✕ pour supprimer un article
   - Total calculé en temps réel

### 4. Passer Commande

1. **Cliquer sur "Commander"**
   - Le bouton est dans le panneau panier
   - S'active uniquement si le panier n'est pas vide

2. **Remplir le Formulaire**
   - Nom complet
   - Adresse complète
   - Ville
   - Code postal (5 chiffres)
   - Téléphone

3. **Confirmer**
   - Vérifiez les informations
   - Cliquez "Confirmer la commande"
   - Commande envoyée au système de livraison!

4. **Confirmation**
   - Numéro de commande unique
   - Récapitulatif des articles
   - Date de livraison estimée
   - Adresse de livraison

### 5. Livraison dans le Monde Réel

La commande est intégrée avec le système de livraison:
- **Tracking automatique** : Numéro de suivi généré
- **Estimation de livraison** : 2-4 jours ouvrables
- **Transporteurs** : Colissimo, Chronopost, DHL selon le poids
- **Livraison gratuite** : Pour commandes > 100€

## Catalogue Produits

### 💻 Électronique
- **Ordinateur Portable** : 999€
  - Haute performance, portable
  - Poids: 2.5kg
  
- **Smartphone** : 699€
  - Dernière génération
  - Poids: 0.2kg

### 👕 Vêtements
- **T-Shirt** : 29€
  - Coton premium
  - Taille: M
  
- **Jean** : 79€
  - Denim qualité
  - Taille: 32

### 🏠 Décoration
- **Lampe Design** : 149€
  - Design moderne
  - Poids: 1.5kg
  
- **Vase Céramique** : 59€
  - Artisanal
  - Poids: 1.2kg

### 🍫 Alimentation
- **Café Premium** : 12€
  - Arabica 500g
  - Poids: 0.5kg
  
- **Chocolat Artisanal** : 8€
  - Noir 70%, 200g
  - Poids: 0.2kg

## Fonctionnalités Avancées

### Calcul de Livraison Intelligent
```javascript
// Livraison gratuite si total > 100€
// Sinon: 5€ base + 2€/kg au-dessus de 5kg
```

### Persistance des Données
- Panier sauvegardé dans LocalStorage
- Historique des commandes conservé
- Reprendre le shopping où vous l'avez laissé

### Compatible VR
- **Oculus Quest** ✓
- **HTC Vive** ✓
- **Valve Index** ✓
- **Windows Mixed Reality** ✓
- **Desktop/Mobile** ✓

## Scénarios d'Utilisation

### Scénario 1: Shopping Électronique
1. Entrez dans le magasin
2. Allez à gauche (section électronique)
3. Cliquez sur le laptop (999€)
4. Cliquez sur le smartphone (699€)
5. Total: 1698€ - **Livraison gratuite!**
6. Commandez et remplissez le formulaire
7. Recevez dans 3 jours!

### Scénario 2: Shopping Mode
1. Tournez à droite (section vêtements)
2. Ajoutez T-Shirt (29€)
3. Ajoutez Jean (79€)
4. Total: 108€ - **Livraison gratuite!**
5. Commandez et confirmez
6. Articles livrés chez vous!

### Scénario 3: Décoration Maison
1. Allez au fond à gauche
2. Prenez la lampe design (149€)
3. Ajoutez le vase (59€)
4. Total: 208€ - **Livraison gratuite!**
5. Parfait pour refaire la déco!

## Tests

### Exécuter les Tests
Ouvrez `http://localhost:8080/test.html`

Tests disponibles:
- ✅ **Système de Panier** : Ajout, suppression, calcul
- ✅ **Catalogue Produits** : Chargement, récupération, shipping
- ✅ **API Livraison** : Création commande, tracking, validation

Tous les tests doivent être verts! ✓

## Dépannage

### La scène VR ne s'affiche pas
- Attendez 5-10 secondes pour le chargement
- Vérifiez la console (F12) pour les erreurs
- Essayez de rafraîchir la page

### Les produits ne réagissent pas au clic
- Assurez-vous que le curseur VR est visible (cercle bleu)
- Rapprochez-vous des produits
- Utilisez le clic gauche de la souris

### Le formulaire ne s'ouvre pas
- Vérifiez que le panier contient des articles
- Le bouton "Commander" doit être actif

### Livraison gratuite non appliquée
- Vérifiez que le total est >= 100€
- Le calcul se fait automatiquement

## Personnalisation

### Ajouter un Nouveau Produit

1. **Dans `js/product-interactions.js`**, ajoutez au catalogue:
```javascript
newproduct: {
    id: 'newproduct',
    name: 'Nouveau Produit',
    price: 99,
    category: 'electronics',
    description: 'Description...',
    weight: 1.0,
    dimensions: '20x20x10 cm'
}
```

2. **Dans `index.html`**, ajoutez l'entité VR:
```html
<a-entity class="product" 
          data-id="newproduct" 
          data-name="Nouveau Produit" 
          data-price="99" 
          position="x y z">
    <!-- Votre géométrie 3D -->
</a-entity>
```

### Modifier les Frais de Livraison

Dans `config.js`:
```javascript
delivery: {
    freeShippingThreshold: 150,  // Au lieu de 100
    baseShippingCost: 7,         // Au lieu de 5
    weightPricePerKg: 3          // Au lieu de 2
}
```

### Changer l'Environnement

Dans `index.html`, modifiez les couleurs, lumières, et positions.

## Prochaines Étapes

- [ ] Intégrer des modèles 3D réalistes
- [ ] Ajouter plus de produits (100+ produits)
- [ ] Implémenter le paiement en ligne
- [ ] Mode multijoueur
- [ ] Application mobile VR native
- [ ] Intégration avec API de livraison réelle

## Support

📧 Email: support@vr-store.com
🐛 Issues: [GitHub Issues](https://github.com/ADLIB-Mrani/VR-SHOPING-GAME/issues)
📚 Docs: [README.md](README.md)

---

**Bon shopping en VR! 🎮🛍️**
