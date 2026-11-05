# NOVA · Magasin VR gratuit

Une nouvelle expérience VR Shopping, disponible dans `nova/index.html` depuis cette branche. Ce showroom est **une expérience de découverte sans paiement réel**, qui coexiste avec la version historique à la racine du dépôt.

## Installation gratuite

Depuis le dossier du dépôt :

```bash
python3 -m http.server 8080
```

Puis ouvrez **http://localhost:8080/nova/**. Le téléchargement d'A-Frame exige une connexion Internet. Un serveur HTTPS est requis pour WebXR sur un domaine public (localhost est une exception habituelle).

Aucune dépendance npm et aucune carte bancaire ne sont nécessaires.

## Fonctionnalités

- Showroom A-Frame/WebXR en 3D, contrôles souris/clavier, contrôleurs compatibles et bouton VR fourni par A-Frame
- Six catégories, trente produits fictifs, recherche en direct, fiches avec prix
- Panier local, quantités 1–10, livraison indicative offerte dès 100 €, sauvegarde sur 7 jours
- Confirmation de **commande fictive** sans stockage des coordonnées personnelles, historique local de démonstration
- Interface mobile et desktop, commandes accessibles au clavier, réduction des animations

## Limites essentielles

- Tous les produits sont fictifs : cette version n'envoie jamais une commande à un vendeur, ne débite jamais une carte et ne crée aucune expédition.
- Aucune connexion Sentry, IA payante, Stripe ou Shippo n'est lancée par défaut ; aucune dépense n'est déclenchée.
- Les tests WebXR physiques ne peuvent être certifiés sans casque adapté.
- Cette version autonome complète le projet existant sans modifier son `index.html` original.
- Pour intégrer la version backend Stripe/Shippo préparée séparément, il faut valider le stock, les coûts, les formalités juridiques, la protection des données et les comptes marchand avant toute ouverture réelle.

## Tests

```bash
node --test nova/smoke.test.mjs
```

Les tests de conformité du paiement et de la livraison restent indépendants de cette version de démonstration. Les essais de service réel pourraient engendrer des frais : ne pas les activer sans choix explicite.

## Contribution

Conserver la branche de développement tant que le parcours sur navigateur et casque WebXR n'est pas validé. Ne publier aucune clé d'API ni donnée client dans ce dépôt public.
