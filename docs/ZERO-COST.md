# NOVA · Configuration zéro coût supplémentaire

Cette configuration est une **démonstration publique de shopping virtuel**. Elle ne vend aucun produit et ne transmet aucune commande à un transporteur.

## Fonctionnalités gratuites par défaut

| Composant | Mode retenu | Risque de facturation |
| --- | --- | --- |
| WebVR / A-Frame | CDN + navigateur ; sans licence payante | Aucun frais de licence prévu |
| Catalogue, panier, recommandations | 100 % navigateur et logique locale | Aucun coût API |
| Démonstration de commandes | Historique local fictif, aucune expédition | Aucune transaction |
| Hébergement du site | GitHub Pages, dépôt public | Gratuit avec les conditions standard en vigueur |
| Tests CI | GitHub Actions, runners Ubuntu standard sur dépôt public | Gratuit dans ce contexte (ne pas utiliser larger runners) |
| Sentry | **Non activé**, aucun DSN ni événement transmis | Aucun événement facturé |
| BrowserStack | Aucun test cloud déclenché automatiquement | Aucun crédit consommé par NOVA |
| Figma | Aucune génération IA payante lancée | Aucun crédit IA consommé |
| Stripe / Shippo | **Désactivés**, jusqu’à activation volontaire | Aucun paiement ni étiquette |
| OpenAI API | **Désactivée** : recommandations locales | Aucun token facturé |

## Garde-fous

- Le backend n'autorise l'encaissement que si `LIVE_COMMERCE_ENABLED=true`, `STOCK_READY=true`, la base D1 et les identifiants Stripe requis sont configurés. Ne définissez jamais ces variables sans marchand, stock et obligations légales en place.
- `AI_ASSISTANT_ENABLED=false` : la demande du concierge est traitée localement, sans appel facturable à OpenAI.
- `AUTO_FULFILL=false` : n'achetez jamais d'étiquette ou de prestation de transport automatiquement.
- Ne mettez aucune clé privée, token GitHub, DSN sensible ou coordonnée de client dans le dépôt.
- Si vous activez un service disposant d'un niveau gratuit, configurez ses plafonds et alertes d'usage sur son propre tableau de bord ; le niveau gratuit n'est pas une garantie de coût nul après une montée en charge.

## À quoi s'attendre

Le site WebXR et ses scénarios de simulation peuvent être publiés gratuitement ; **la vente et la livraison physiques de vrais produits ne peuvent pas être gratuites par nature**. Les frais de transaction, frais de transport, droits et obligations du vendeur ne sont pas couverts par le Student Developer Pack. Pour rester sans aucun coût, conservez le *mode découverte*.

## Contrôle qualité local sans service externe

```sh
npm run check
```

Pour vérifier un navigateur réel, tester le site servi sur localhost puis une URL publique HTTPS avec WebXR. Les simulations de commande doivent toujours afficher l'indication « démo ».
