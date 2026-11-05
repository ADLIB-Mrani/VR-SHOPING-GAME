# Déploiement — NOVA VR Shopping

## 1. Démo publique (aucun paiement)

Le frontend peut être hébergé sur **GitHub Pages**, Cloudflare Pages, Netlify ou un serveur statique HTTPS. Publiez `index.html`, `src/`, `styles/` et `favicon.svg` à la racine du site. Laissez `<meta name="api-base" content="">` vide pour rester en **mode découverte**, sans vente. Si vous remplacez un dépôt existant, sauvegardez ses fichiers avant de les écraser.

### GitHub Pages

Poussez les fichiers à la racine de votre dépôt, puis dans **Settings > Pages**, choisissez la branche et le dossier racine. Sur un dépôt de projet, l'URL a généralement la forme `https://USERNAME.github.io/REPOSITORY/`. Le protocole HTTPS est requis pour les casques VR (hors localhost). GitHub Pages ne peut pas exécuter le backend Worker.

## 2. Serveur commerce Cloudflare Worker et D1

La vente réelle est **opt-in**. Créez un compte Cloudflare (s'il n'existe pas), un compte marchand Stripe et, pour automatiser les étiquettes, un compte Shippo. Ne publiez pas les secrets.

```bash
cp wrangler.toml.example wrangler.toml
npx wrangler@latest login
npx wrangler@latest d1 create nova-commerce
```

Inscrivez l'ID D1 retourné dans `wrangler.toml` (`database_id`), puis définissez :

- `PUBLIC_WEB_ORIGIN` : origine exacte du site, ex. `https://USERNAME.github.io` (sans chemin, sans `/` final). Cette valeur détermine les origines CORS autorisées.
- `PUBLIC_STORE_URL` : URL complète du magasin, ex. `https://USERNAME.github.io/VR-SHOPING-GAME` (avec le chemin éventuel). Elle est utilisée dans les retours Stripe.
- `LIVE_COMMERCE_ENABLED` et `STOCK_READY` : **false** tant que les conditions de vente réelle ne sont pas remplies.
- `AUTO_FULFILL` : **false** par défaut ; s'il est activé avec un token Shippo réel, **des achats d'étiquettes facturés** peuvent se produire à chaque paiement vérifié.

Créez le schéma et déployez :

```bash
npx wrangler@latest d1 execute nova-commerce --file=worker/schema.sql --remote
npx wrangler@latest secret put STRIPE_SECRET_KEY
npx wrangler@latest secret put STRIPE_WEBHOOK_SECRET
npx wrangler@latest secret put ADMIN_API_TOKEN
npx wrangler@latest deploy
```

Les secrets sont saisis dans l'outil de votre terminal ou dans le tableau Cloudflare : **ne les placez jamais dans `index.html`, `wrangler.toml` public, GitHub ou une issue**.

Dans Stripe Dashboard, créez un webhook ciblant `https://VOTRE-WORKER.workers.dev/api/webhooks/stripe` ; abonnez-vous à `checkout.session.completed`, `checkout.session.async_payment_succeeded` et `checkout.session.expired`. Configurez `STRIPE_WEBHOOK_SECRET` avec le secret de signature fourni. Commencez avec les clés et événements **Stripe test** ; aucun montant réel ne doit être débité pendant les essais.

Dans `index.html`, renseignez la base API HTTPS sans slash final :

```html
<meta name="api-base" content="https://VOTRE-WORKER.workers.dev">
```

Validez `GET /api/status` : tant que `LIVE_COMMERCE_ENABLED` ou `STOCK_READY` est `false`, le site continue à offrir la démo. Pour la vente, configurez les **vrais produits, les stocks, le transport, les CGV, les obligations de consommation et les paiements**, puis activez les deux variables de manière explicite.

## 3. Préparation des commandes et livraison

Le paiement validé par webhook donne le statut `paid` (payée, à préparer). L'opérateur doit récupérer les commandes côté serveur avec un jeton administrateur et préparer un colis physique. **Ne partagez jamais le jeton administrateur avec le navigateur**.

```bash
curl 'https://VOTRE-WORKER.workers.dev/api/admin/orders' \
  -H 'Authorization: Bearer VOTRE_ADMIN_API_TOKEN'
```

Pour un transporteur externe, après avoir obtenu un vrai numéro de suivi, enregistrez-le avec :

```bash
curl -X POST 'https://VOTRE-WORKER.workers.dev/api/admin/orders/ORDER_UUID/fulfill' \
  -H 'Authorization: Bearer VOTRE_ADMIN_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"trackingNumber":"VRAI_NUMERO_DE_SUIVI","trackingUrl":"https://URL_TRANSPORTEUR"}'
```

Avec Shippo, configurez les secrets `SHIPPO_TOKEN` et les variables `SHIPPO_CARRIER_ACCOUNT`, `SHIPPO_SERVICELEVEL_TOKEN`, `SHIP_FROM_NAME`, `SHIP_FROM_STREET`, `SHIP_FROM_CITY`, `SHIP_FROM_ZIP`, `SHIP_FROM_COUNTRY`, `SHIP_FROM_PHONE` (optionnellement `SHIP_FROM_EMAIL`). Testez d'abord avec un **token Shippo test**. Le serveur utilise l'API Shippo `/transactions/` avec un service et un compte transporteur choisis par le marchand ; la tarification du client n'est pas liée automatiquement au tarif transporteur réel. Si vous utilisez Shippo, la création manuelle d'étiquette se fait via `POST /api/admin/orders/:id/ship`. `AUTO_FULFILL=true` déclenche la même intégration après paiement : à n'activer qu'après essais et accord explicite du marchand pour les coûts.

`label_created` signifie qu'une étiquette (ou référence de suivi fournie par l'opérateur) existe ; cela ne garantit ni prise en charge ni livraison. Pour afficher des événements de transport réels en temps réel, une synchronisation webhooks transporteur et un processus de réconciliation supplémentaires restent nécessaires.

## 4. Exploitation, conformité et limites

- **Inventaire et prix :** le backend recalcule les prix, mais le catalogue fourni est une collection fictive. Remplacez-le par une source de vérité reliée au stock et au calcul fiscal avant toute vente.
- **Données et vie privée :** les informations de livraison sont conservées dans D1 côté serveur ; mettez en place une durée de conservation, une procédure d'accès/suppression et des protections conformes au RGPD. Le navigateur ne conserve pas les coordonnées dans l'historique local.
- **Paiements :** la création d'une session Stripe n'est pas la confirmation d'un paiement. Seul un webhook Stripe vérifié peut confirmer le statut `paid`. Le code n'inclut pas encore le traitement complet des remboursements, contestations et incidents réseau.
- **Sécurité opérationnelle :** configurez des règles Cloudflare WAF/rate limiting pour `/api/checkout`, une surveillance des erreurs, des sauvegardes D1 et des alertes pour `shipping_error`.
- **Transport :** les colis restent à emballer et à remettre physiquement à un transporteur. Une étiquette peut être facturée et nécessiter des formalités selon le produit.
- **WebXR :** vérifiez votre casque sur HTTPS, dans son navigateur compatible. Les interactions et performances varient selon les contrôleurs et GPU.

## 5. Ressources API

- Stripe Checkout : https://docs.stripe.com/api/checkout/sessions/create
- Stripe Webhooks : https://docs.stripe.com/webhooks
- Shippo InstaLabel : https://docs.goshippo.com/docs/guides_general/single_call/
- Cloudflare D1 : https://developers.cloudflare.com/d1/
- Cloudflare Workers : https://developers.cloudflare.com/workers/

## 6. Assistant IA facultatif

Sans réglage supplémentaire, les suggestions sont locales. Pour activer OpenAI côté serveur, ajouter `AI_ASSISTANT_ENABLED = "true"` dans la section `[vars]`, puis `npx wrangler@latest secret put OPENAI_API_KEY`. Les questions des visiteurs sont envoyées à OpenAI lorsque l'assistant est activé ; adaptez la politique de confidentialité et mettez des limites de débit et de budget avant publication. En cas de panne du fournisseur, le moteur de conseils local prend le relais.
