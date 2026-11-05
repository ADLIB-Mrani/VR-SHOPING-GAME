# NOVA · VR Shopping Game 2.0

**Le magasin immersif du futur, conçu pour le Web.** Une expérience 3D A-Frame/WebXR et une interface de shopping complète. Le projet inclut un vrai backend de paiement/expédition prêt à configurer — le mode découverte fonctionne immédiatement, sans compte marchand.

> **Important :** les 30 références sont des articles de démonstration. En mode découverte, une « commande » est strictement fictive : aucun paiement, stock réservé, envoi ou numéro de suivi réel. Les ventes sont **désactivées par défaut** et ne doivent être ouvertes qu'après configuration des comptes marchands, du stock et de la conformité juridique. Le paiement réel utilise Stripe Checkout ; la création d'étiquettes réelles peut utiliser Shippo, qui peut facturer des frais. Une étiquette créée ne signifie **pas** que le colis a été physiquement remis au transporteur.

## Ce qui fonctionne immédiatement

- **Showroom 3D généré** : six galeries, décors, lumières, plateforme centrale, trente produits stylisés en 3D, présentoirs, étiquettes, survol et sélection.
- **Desktop + VR** : clavier ZQSD/WASD, souris, commandes tactiles, manettes WebXR via raycaster, mode VR et plein écran selon les capacités du navigateur/casque.
- **Catalogue interactif** : 30 articles, 6 catégories, recherches insensibles aux accents, tri et filtres combinés, détails des articles.
- **Panier** : modification des quantités (limite 10), calcul en centimes, livraison offerte dès 100 €, sauvegarde pendant 7 jours.
- **Commandes démo** : validation française nom, adresse, email, ville, code postal et téléphone ; historique local clairement marqué **DEMO** et sans conservation des coordonnées.
- **Accessibilité et responsive** : interactions au clavier, libellés des contrôles, états `aria`, gestion du focus des dialogues, adaptation mobile et réduction des animations.
- **NOVA Concierge** : conseils personnalisés hors-ligne à partir du catalogue. Option OpenAI côté serveur, sans clé exposée au navigateur.
- **Qualité** : tests unitaires Node.js, vérification syntaxique et workflow GitHub Actions.

## Lancer le jeu en local

**Prérequis :** Node.js 20+ et Internet pour charger A-Frame et les polices. Le projet ne nécessite aucun `npm install` pour le serveur local ou les tests.

```bash
npm start
```

Ouvrir **http://localhost:8080**. Si le port 8080 est déjà utilisé :

```bash
PORT=8765 npm start
```

Sous Windows, utilisez `start.bat` (nécessite Node.js), et sous Linux/macOS `./start.sh`.

**Ne pas ouvrir** `index.html` en double-cliquant : les modules ES6 chargés en `file://` peuvent être bloqués par le navigateur. Si A-Frame n'est pas accessible (hors-ligne, réseau filtré ou WebGL désactivé), le catalogue HTML, le panier et les commandes démo restent disponibles.

## Contrôles

| Action | Desktop | VR | Mobile |
|---|---|---|---|
| Déplacer la vue | ZQSD / WASD / flèches | Manette (thumbstick) | Flèches tactiles |
| Regarder | Souris | Orientation du casque | Glisser sur la vue 3D |
| Inspecter | Clic sur le produit | Rayon du contrôleur + gâchette | Tap sur le produit |
| Entrer dans une galerie | Barre des six univers | Déplacement libre | Barre des six univers |
| Chercher | `/` puis texte | Catalogue sur écran | Champ de recherche |
| Quitter un dialogue | Échap ou × | Interagir avec l'UI desktop | × ou arrière-plan |

L'utilisation du casque suppose un navigateur compatible WebXR et une origine HTTPS (ou localhost). Le support réel des contrôleurs dépend du matériel et du navigateur ; il n'a pas été validé sur chaque casque.

## Structure

```text
NOVA-VR-SHOP/
├── index.html               Interface et modales
├── favicon.svg              Identité NOVA
├── styles/main.css          Design responsive
├── src/catalog.mjs          Catalogue 30 références, partagé front/serveur
├── src/core.mjs             Prix, panier, recherche et validation
├── src/recommender.mjs      Recommandations privées locales
├── src/scene.mjs            Showroom A-Frame procédural/WebXR
├── src/app.mjs              Interface, panier, modales, historique, checkout
├── server.mjs               Serveur statique local (Node natif)
├── worker/index.mjs         API Cloudflare : Stripe + D1 + Shippo
├── worker/schema.sql        Schéma SQL des commandes / webhooks
├── wrangler.toml.example    Exemple de configuration Cloudflare
├── tests/                   Tests Node.js
├── .github/workflows/ci.yml CI GitHub Actions
├── DEPLOYMENT.md            Mise en production pas à pas
└── SECURITY.md              Modèle de sécurité et limites
```

## Backend de vente réelle

L'API inclut les opérations suivantes, dont l'activation nécessite les comptes et secrets du marchand :

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/api/status` | Indique si les ventes sont autorisées |
| `POST` | `/api/recommend` | Propose 3 références (local ou OpenAI en option) |
| `POST` | `/api/checkout` | Valide le client et le panier, recalcule les prix depuis le catalogue, crée la session Stripe |
| `POST` | `/api/webhooks/stripe` | Vérifie la signature Stripe avant de marquer la commande payée |
| `GET` | `/api/orders/:id` | Consulte le suivi via un jeton secret de commande |
| `GET` | `/api/admin/orders` | Liste les commandes (authentification administrateur) |
| `POST` | `/api/admin/orders/:id/ship` | Achète une étiquette Shippo, avec configuration du transporteur |
| `POST` | `/api/admin/orders/:id/fulfill` | Enregistre un numéro de suivi obtenu par un autre transporteur |

Les routes admin requièrent le jeton d'administration. Le navigateur ne reçoit jamais les clés Stripe, Shippo ou administrateur. La livraison est proposée à **6,90 €** en deçà de 100 € ; prix et devise EUR sont recalculés par le backend. Aucune expédition physique n'est effectuée automatiquement par le simple fait de payer ou de générer une étiquette.

Pour activer tout cela, suivez **[DEPLOYMENT.md](DEPLOYMENT.md)**. Le mode réel utilise une base D1 Cloudflare (persistante), Stripe et éventuellement Shippo ; ces comptes ne sont pas fournis par ce dépôt.

## Développement et tests

```bash
npm test
npm run check
```

Ces tests couvrent catalogue, recherche, livraison, protection du panier, validation française, signature HMAC Stripe, CORS, checkout et suivi privé. Un vrai parcours paiement ou livraison n'est testable qu'avec des comptes de test Stripe/Shippo et un Worker D1 déployé.

## Étapes avant ouverture publique

1. Remplacer les articles de démonstration par de **vrais SKU**, stocks, poids, taxes, tarifs et visuels dont vous détenez les droits.
2. Vérifier la capacité à préparer et expédier les produits. Configurer Stripe, votre hébergeur API, votre transporteur, l'adresse d'expédition et les secrets.
3. Ajouter mentions légales, conditions générales de vente, politique de confidentialité, informations sur les retours et le droit de rétractation, gestion des données personnelles et obligations de facturation/TVA.
4. Tester le cycle de paiement (succès, échec, annulation, retard asynchrone, remboursement) ainsi que la création d'étiquettes et la remise effective des colis.
5. Mettre en place supervision, alertes, limitations de débit, inventaire réel et politique de rétention des données personnelles avant d'autoriser `LIVE_COMMERCE_ENABLED=true` et `STOCK_READY=true`.

## Zéro coût supplémentaire

La configuration fournie est entièrement **mode découverte** : aucune dépense ou abonnement n’est déclenché. Consultez [docs/ZERO-COST.md](docs/ZERO-COST.md) pour les limites des services gratuits et la marche à suivre pour éviter toute facturation.

## Origine et licence

Refonte indépendante conçue pour enrichir [VR-SHOPING-GAME](https://github.com/ADLIB-Mrani/VR-SHOPING-GAME), créé par ADLIB-Mrani. Code sous licence MIT (voir `LICENSE`). Les exemples de produits sont fictifs et ne constituent pas une offre de vente.

## NOVA Concierge et OpenAI (optionnel)

Le champ **NOVA Concierge** propose trois références à partir de votre demande. Sans API ni clé, il utilise une recommandation locale par mots-clés, sans transmettre la demande. Pour une recommandation générative, configurez le Worker avec `AI_ASSISTANT_ENABLED = "true"` et ajoutez `OPENAI_API_KEY` via `npx wrangler secret put OPENAI_API_KEY`. Le modèle serveur par défaut est `gpt-4.1-mini` (personnalisable par `OPENAI_MODEL`) : vérifiez sa disponibilité et ses tarifs actuels avant de l'activer. Des appels OpenAI payants seront alors effectués et la question du visiteur sera envoyée au fournisseur ; informez vos utilisateurs et évitez les données personnelles. Le système vérifie les références retournées et revient aux recommandations locales en cas d'erreur.
