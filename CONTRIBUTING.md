# Guide de Contribution

Merci de votre intérêt pour contribuer au VR Shopping Game! Ce document explique comment vous pouvez aider à améliorer le projet.

## 🌟 Comment Contribuer

### Signaler des Bugs

Si vous trouvez un bug:

1. Vérifiez d'abord que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/ADLIB-Mrani/VR-SHOPING-GAME/issues)
2. Créez une nouvelle issue avec:
   - Un titre clair et descriptif
   - Une description détaillée du problème
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement observé
   - Des captures d'écran si applicable
   - Votre environnement (navigateur, OS, casque VR si applicable)

### Proposer des Fonctionnalités

Pour proposer une nouvelle fonctionnalité:

1. Ouvrez une issue avec le tag "feature request"
2. Décrivez clairement:
   - Le problème que la fonctionnalité résout
   - Comment vous imaginez la fonctionnalité
   - Des exemples d'utilisation
   - Des alternatives que vous avez considérées

### Soumettre des Pull Requests

#### Processus

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité:
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. **Committez** vos changements:
   ```bash
   git commit -m "Ajout de ma nouvelle fonctionnalité"
   ```
4. **Poussez** vers votre fork:
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
5. **Ouvrez** une Pull Request

#### Règles pour les Pull Requests

- Une PR = une fonctionnalité ou un fix
- Code propre et commenté
- Testez votre code avant de soumettre
- Mettez à jour la documentation si nécessaire
- Suivez le style de code existant
- Décrivez clairement ce que fait votre PR

### Style de Code

#### JavaScript

```javascript
// Utilisez camelCase pour les variables et fonctions
const myVariable = 'value';

/**
 * Utilisez JSDoc pour documenter les fonctions
 * @param {string} name - Nom du paramètre
 * @returns {string} Description du retour
 */
function myFunction(name) {
    // Commentez le code complexe
    // Utilisez des noms descriptifs
    return `Hello ${name}`;
}

// Utilisez des constantes depuis config.js
const MAX_ITEMS = CONFIG.CART.MAX_QUANTITY_PER_ITEM;

// Préférez const et let à var
const immutableValue = 10;
let mutableValue = 20;

// Validez et sanitisez toujours les entrées utilisateur
const safeName = sanitizeHTML(userInput);

// Gérez les erreurs proprement
try {
    // Code qui peut échouer
} catch (error) {
    console.error('Erreur descriptive:', error);
    handleError('Message utilisateur convivial', error);
}
```

#### HTML

```html
<!-- Indentation: 4 espaces -->
<div class="my-class">
    <p>Contenu</p>
</div>

<!-- Attributs A-Frame en kebab-case -->
<a-entity 
    position="0 1 0" 
    rotation="0 0 0"
    scale="1 1 1">
</a-entity>
```

#### CSS

```css
/* Utilisez des noms de classes descriptifs */
.cart-panel {
    background: white;
    padding: 20px;
}

/* Commentez les sections importantes */
/* === Cart Styles === */

/* Utilisez des unités relatives quand c'est approprié */
```

## 📋 Checklist pour les Contributions

Avant de soumettre votre PR, vérifiez:

- [ ] Le code fonctionne correctement
- [ ] Vous avez testé sur plusieurs navigateurs (Chrome, Firefox, Safari)
- [ ] Le code est propre et bien formaté
- [ ] Les commentaires JSDoc sont ajoutés pour les nouvelles fonctions
- [ ] Les entrées utilisateur sont validées et sanitisées
- [ ] La gestion d'erreurs est implémentée
- [ ] Les constantes sont utilisées depuis config.js
- [ ] La documentation est mise à jour si nécessaire
- [ ] Pas de fichiers inutiles (node_modules, .DS_Store, etc.)
- [ ] Les messages de commit sont clairs et descriptifs
- [ ] Aucune vulnérabilité de sécurité introduite
- [ ] Les performances ne sont pas dégradées

## 🎯 Zones d'Amélioration Prioritaires

Nous recherchons particulièrement de l'aide sur:

1. **Modèles 3D**: Créer ou trouver des modèles 3D réalistes pour les produits
2. **Textures**: Améliorer les textures de l'environnement
3. **Animations**: Ajouter des animations plus fluides
4. **Performance**: Optimiser le chargement et le rendu
5. **Accessibilité**: Rendre l'application plus accessible (WCAG 2.1)
6. **Tests**: Ajouter des tests automatisés (unit tests, e2e tests)
7. **Traductions**: Traduire l'application dans d'autres langues
8. **Documentation**: Améliorer et étendre la documentation
9. **Sécurité**: Audit de sécurité et améliorations
10. **Backend**: Intégration avec une vraie API de livraison

## 🐛 Déboguer

### Activer les Logs de Debug

```javascript
// Dans config.js, activez le mode debug
CONFIG.debug = true;
```

### Console du Navigateur

Ouvrez la console (F12) pour voir les logs et erreurs.

### A-Frame Inspector

Appuyez sur `Ctrl + Alt + I` dans la scène VR pour ouvrir l'inspecteur A-Frame.

## 📚 Ressources Utiles

- [Documentation A-Frame](https://aframe.io/docs/)
- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [JavaScript MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript)
- [Guide Git](https://git-scm.com/book/fr/v2)

## 💬 Communication

- **Issues GitHub**: Pour les bugs et fonctionnalités
- **Pull Requests**: Pour les contributions de code
- **Discussions**: Pour les questions générales

## 📜 Code de Conduite

### Notre Engagement

Nous nous engageons à faire de la participation à ce projet une expérience sans harcèlement pour tous.

### Nos Standards

Exemples de comportements acceptables:

- Utiliser un langage accueillant et inclusif
- Respecter les points de vue différents
- Accepter la critique constructive
- Se concentrer sur ce qui est meilleur pour la communauté
- Montrer de l'empathie envers les autres

Exemples de comportements inacceptables:

- Langage ou images à caractère sexuel
- Trolling, insultes ou commentaires désobligeants
- Harcèlement public ou privé
- Publication d'informations privées sans permission
- Autre conduite inappropriée dans un contexte professionnel

### Application

Les mainteneurs du projet ont le droit de retirer, modifier ou rejeter les contributions qui ne respectent pas ce code de conduite.

## 🎉 Remerciements

Merci à tous ceux qui contribuent à rendre ce projet meilleur!

Chaque contribution, grande ou petite, est précieuse et appréciée. 🙏
