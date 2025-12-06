# 🧪 Guide de Test - VR Shopping Game

## 🎯 Objectif
Ce guide vous aide à tester toutes les améliorations apportées au jeu VR.

## 📋 Prérequis

### Installation
```bash
# Installer les dépendances
npm install

# Lancer le serveur
npm start
```

Le jeu s'ouvre automatiquement dans votre navigateur à `http://localhost:8080`

## ✅ Tests à Effectuer

### Test 1: Collision avec les Murs 🧱

#### Objectif
Vérifier que le joueur ne peut plus traverser les murs

#### Étapes
1. Lancez le jeu
2. Utilisez WASD pour vous déplacer
3. Essayez d'aller vers chaque mur (Nord, Sud, Est, Ouest)
4. **Résultat Attendu**: Le joueur s'arrête au mur, ne peut pas passer à travers

#### Points à Vérifier
- [ ] Mur Nord (arrière) bloque le mouvement
- [ ] Mur Sud (entrée) bloque le mouvement
- [ ] Mur Est (droite) bloque le mouvement
- [ ] Mur Ouest (gauche) bloque le mouvement
- [ ] Le joueur reste à l'intérieur du magasin

---

### Test 2: Collision avec les Produits 📦

#### Objectif
Vérifier que les produits sont solides et ne peuvent pas être traversés

#### Étapes
1. Approchez-vous d'un produit (ex: Laptop)
2. Essayez de marcher à travers le produit
3. **Résultat Attendu**: Le produit reste en place, vous ne pouvez pas le traverser

#### Points à Vérifier
- [ ] Les produits ont une présence physique
- [ ] On ne peut pas marcher à travers les tables
- [ ] Les objets ne bougent pas de manière non réaliste

---

### Test 3: Nouveaux Produits 🆕

#### Objectif
Vérifier que tous les nouveaux produits sont présents et visibles

#### Checklist des Nouveaux Produits

**Section Vêtements**
- [ ] Chaussures de Sport (120€) - Visible à côté du T-shirt
- [ ] Veste en Cuir (199€) - Visible à côté du Jean

**Section Décoration**
- [ ] Cadre Photo (35€) - Visible dans la section décoration
- [ ] Horloge Murale (89€) - Visible dans la section décoration

**Section Alimentation**
- [ ] Vin Rouge (45€) - Bouteille visible
- [ ] Fromage Artisanal (18€) - Boîte visible

**Section Livres** (NOUVELLE SECTION au centre/nord)
- [ ] Roman Bestseller (22€) - Livre rouge
- [ ] Guide Cuisine (28€) - Livre turquoise
- [ ] Encyclopédie (35€) - Livre bleu foncé
- [ ] Étagère complète visible

**Section Sport** (NOUVELLE SECTION au centre/sud)
- [ ] Ballon de Basket (35€) - Sphère orange
- [ ] Tapis de Yoga (45€) - Cylindre violet
- [ ] Haltères 5kg (55€) - Poids métalliques

**Total: 20 produits** (8 anciens + 12 nouveaux)

---

### Test 4: Système d'Achat de Proximité 🎮

#### Objectif
Tester le nouveau système d'achat style Call of Duty

#### Étapes

**Test 4A: Apparition de l'UI**
1. Approchez-vous lentement d'un produit (ex: Laptop)
2. À environ 2-3 mètres du produit, un panneau doit apparaître
3. **Résultat Attendu**: 
   - Panneau semi-transparent avec fond sombre
   - Nom du produit affiché en haut
   - Prix affiché
   - Bouton "✓ AJOUTER" visible
   - Contrôles de quantité visibles

**Test 4B: Contrôles de Quantité**
1. Avec le panneau visible, cliquez sur le bouton [+]
2. Vérifiez que "Quantité: 1" devient "Quantité: 2"
3. Cliquez sur [-] pour revenir à 1
4. Essayez de descendre en dessous de 1
5. **Résultat Attendu**: La quantité ne descend pas en dessous de 1

**Test 4C: Achat avec Quantité**
1. Réglez la quantité à 3 avec [+]
2. Cliquez sur "✓ AJOUTER"
3. Vérifiez le panier (panneau à droite)
4. **Résultat Attendu**: 
   - 3 unités du produit ajoutées
   - Notification "3x [Produit] ajouté au panier!"
   - Animation du produit
   - Prix total mis à jour

**Test 4D: Disparition de l'UI**
1. Avec un panneau visible, éloignez-vous du produit
2. **Résultat Attendu**: Le panneau disparaît automatiquement

**Test 4E: Changement de Produit**
1. Approchez-vous du Laptop (panneau apparaît)
2. Sans vous éloigner complètement, déplacez-vous vers le Smartphone
3. **Résultat Attendu**: Le panneau du Laptop disparaît, celui du Smartphone apparaît

#### Points à Vérifier
- [ ] Panneau apparaît à proximité (~2.5m)
- [ ] Panneau disparaît quand on s'éloigne
- [ ] Boutons [+] et [-] fonctionnent
- [ ] Quantité reste entre 1 et 99
- [ ] Bouton AJOUTER ajoute la bonne quantité
- [ ] Animation du produit lors de l'achat
- [ ] Notification affichée
- [ ] Un seul panneau visible à la fois

---

### Test 5: Glisser-Déposer vers le Panier 🖱️

#### Objectif
Tester le système de drag-and-drop vers le panier

#### Étapes

**Préparation**
1. Repérez le panier visuel en VR
   - Position: coin arrière-droit du magasin (9, 1, 9)
   - Boîte rouge avec texte "🛒 PANIER"

**Test 5A: Démarrer le Glissement**
1. Cliquez et maintenez le bouton sur un produit (ex: T-shirt)
2. **Résultat Attendu**:
   - Le produit devient semi-transparent
   - Notification: "Glissez vers le panier pour ajouter!"

**Test 5B: Pendant le Glissement**
1. Tout en maintenant le clic, déplacez la souris
2. Continuez à tenir le clic
3. **Résultat Attendu**: Le produit reste semi-transparent

**Test 5C: Déposer dans le Panier**
1. Déplacez-vous vers le panier visuel (🛒)
2. Approchez-vous à moins de 3 mètres
3. Relâchez le clic de souris
4. **Résultat Attendu**:
   - Produit ajouté au panier
   - Animation du panier (pulse/agrandissement)
   - Notification d'ajout
   - Produit redevient opaque

**Test 5D: Déposer Ailleurs**
1. Cliquez et maintenez sur un produit
2. Relâchez loin du panier
3. **Résultat Attendu**: 
   - Produit redevient normal
   - Rien n'est ajouté au panier

#### Points à Vérifier
- [ ] Clic maintenu démarre le drag
- [ ] Produit devient semi-transparent durant le drag
- [ ] Notification de drag affichée
- [ ] Drop près du panier ajoute le produit
- [ ] Animation du panier visible
- [ ] Drop loin du panier n'ajoute rien
- [ ] Produit redevient normal après drop

---

### Test 6: Achat Classique (Méthode Originale) 🖱️

#### Objectif
Vérifier que l'achat par clic direct fonctionne toujours

#### Étapes
1. Cliquez rapidement (sans maintenir) sur un produit
2. **Résultat Attendu**:
   - Produit ajouté immédiatement (quantité: 1)
   - Notification affichée
   - Animation du produit
   - Panier mis à jour

#### Points à Vérifier
- [ ] Clic simple ajoute 1 unité
- [ ] Plusieurs clics ajoutent plusieurs unités
- [ ] Fonctionne pour tous les produits

---

### Test 7: Visuels Améliorés 🎨

#### Objectif
Vérifier les améliorations visuelles

#### Checklist Visuelle

**Produits**
- [ ] Les métaux ont un aspect brillant (laptop, smartphone, haltères)
- [ ] Les tissus ont un aspect mat (t-shirt, jeans)
- [ ] Les écrans ont une lueur émissive (smartphone, lampe)
- [ ] Les couleurs sont vibrantes et réalistes

**Tables**
- [ ] Chaque section a une table en bois
- [ ] Les tables sont de couleur bois (#8B7355)
- [ ] Les produits sont posés sur les tables

**Sol et Murs**
- [ ] Le sol a une texture/couleur agréable
- [ ] Les murs sont de couleur beige/crème
- [ ] 4 murs visibles (pas d'ouverture)

**Éclairage**
- [ ] Le magasin est bien éclairé
- [ ] Pas de zones trop sombres
- [ ] Ombres visibles (si support WebGL)

---

### Test 8: Panier et Commande 🛒

#### Objectif
Vérifier le système de panier et commande

#### Étapes
1. Ajoutez plusieurs produits au panier (différentes méthodes)
2. Vérifiez le panneau panier à droite
3. Testez les contrôles de quantité dans le panier
4. Cliquez sur "Commander"
5. Remplissez le formulaire
6. Validez la commande

#### Points à Vérifier
- [ ] Tous les produits ajoutés apparaissent
- [ ] Prix total correct
- [ ] Boutons +/- dans le panier fonctionnent
- [ ] Bouton ✕ supprime le produit
- [ ] Formulaire de livraison s'affiche
- [ ] Validation enregistre la commande
- [ ] Confirmation affichée avec détails
- [ ] Panier vidé après commande

---

### Test 9: Navigation et Mobilité 🚶

#### Objectif
Tester tous les aspects de déplacement

#### Étapes

**Test 9A: Déplacement WASD**
- [ ] W = Avancer
- [ ] A = Gauche
- [ ] S = Reculer
- [ ] D = Droite

**Test 9B: Déplacement Flèches**
- [ ] ↑ = Avancer
- [ ] ← = Gauche
- [ ] ↓ = Reculer
- [ ] → = Droite

**Test 9C: Vision**
- [ ] Souris permet de regarder à 360°
- [ ] Cursor visible au centre
- [ ] Cursor change de couleur au survol des produits

**Test 9D: Limites**
- [ ] Ne peut pas sortir à gauche (x < -9.5)
- [ ] Ne peut pas sortir à droite (x > 9.5)
- [ ] Ne peut pas sortir devant (z < -9.5)
- [ ] Ne peut pas sortir derrière (z > 9.5)
- [ ] Hauteur fixe (y = 1.6)

---

### Test 10: Expérience Complète 🎮

#### Objectif
Simulation d'une session de shopping complète

#### Scénario
1. **Arrivée**: Entrez dans le magasin (position de spawn)
2. **Exploration**: Visitez les 6 sections (Électro, Vêtements, Déco, Aliments, Livres, Sport)
3. **Shopping**: 
   - Achetez 1 produit par clic direct
   - Achetez 1 produit avec UI proximité (quantité 3)
   - Achetez 1 produit par glisser-déposer
4. **Gestion Panier**:
   - Modifiez une quantité
   - Supprimez un article
5. **Commande**:
   - Passez commande
   - Remplissez le formulaire
   - Validez

#### Temps Estimé
15-20 minutes pour un test complet

#### Points d'Attention
- [ ] Aucune erreur console
- [ ] Pas de lag ou freeze
- [ ] Toutes les animations fluides
- [ ] Aucun produit ne disparaît
- [ ] Navigation fluide partout
- [ ] Panier toujours accessible
- [ ] Pas de passage à travers objets/murs

---

## 🐛 Problèmes Connus et Solutions

### CDN Bloqué
**Symptôme**: "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"
**Solution**: 
- Vérifiez votre connexion Internet
- Désactivez temporairement les bloqueurs de pub
- Utilisez un autre navigateur

### A-Frame ne Charge Pas
**Symptôme**: Page blanche ou message d'erreur
**Solution**:
- Rechargez la page (F5)
- Videz le cache (Ctrl+Shift+Delete)
- Essayez en navigation privée

### Performance Lente
**Symptôme**: FPS bas, lag
**Solution**:
- Fermez autres onglets
- Utilisez Chrome ou Firefox (recommandé)
- Réduisez la qualité graphique du navigateur

---

## 📊 Rapport de Test

### Template de Rapport

```markdown
# Rapport de Test - VR Shopping Game

**Date**: ___________
**Navigateur**: ___________
**OS**: ___________

## Tests Réussis ✅
- [ ] Test 1: Collision Murs
- [ ] Test 2: Collision Produits  
- [ ] Test 3: Nouveaux Produits
- [ ] Test 4: UI Proximité
- [ ] Test 5: Glisser-Déposer
- [ ] Test 6: Achat Classique
- [ ] Test 7: Visuels
- [ ] Test 8: Panier/Commande
- [ ] Test 9: Navigation
- [ ] Test 10: Expérience Complète

## Bugs Trouvés 🐛
1. 
2. 
3. 

## Suggestions 💡
1. 
2. 
3. 

## Note Globale
Performance: ___ / 10
Visuels: ___ / 10
Gameplay: ___ / 10
```

---

## 🎯 Critères de Succès

Le test est **réussi** si:
- ✅ 0 passage à travers murs/objets
- ✅ 20 produits visibles et interactifs
- ✅ 3 méthodes d'achat fonctionnelles
- ✅ UI proximité responsive
- ✅ Visuels améliorés perceptibles
- ✅ Navigation fluide et contrainte
- ✅ Panier et commande fonctionnels
- ✅ Aucune erreur bloquante

---

## 📸 Captures d'Écran Recommandées

Pour documenter les tests:
1. Vue d'ensemble du magasin
2. UI proximité affichée
3. Panier avec plusieurs produits
4. Nouveau section Livres
5. Nouvelle section Sport
6. Glisser-déposer en action

---

## 🎉 Conclusion

Une fois tous les tests effectués avec succès, le jeu VR offre:
- ✨ Expérience réaliste avec collisions
- 🎨 Visuels améliorés et professionnels
- 🛍️ 20 produits variés
- 🎮 3 méthodes d'achat intuitives
- 💫 Interactions immersives et fluides

**Bon shopping en VR! 🎮🛒**
