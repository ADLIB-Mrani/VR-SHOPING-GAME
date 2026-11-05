# NOVA VR Shopping 2.0 — branch de refonte

Cette branche est destinée à la version NOVA 2.0 du magasin VR Shopping. La version existante reste sur `main` jusqu'à validation.

## Politique zéro coût supplémentaire

- Démonstration locale gratuite : `npm start` (Node.js 20+), sans dépendance npm à installer.
- IA facultative **désactivée** par défaut, recommandations locales gratuites.
- Paiements et expéditions réels **désactivés** par défaut. Les frais de carte bancaire, d'affranchissement et d'hébergement éventuels ne peuvent pas être garantis à zéro.
- Ne jamais activer automatiquement un service facturable ou renseigner une carte bancaire.
- La simple création d'une étiquette n'est pas une preuve de livraison physique.

## Vérifications

Version NOVA locale : 30 produits / 6 catégories, 11 tests Node réussis. Les tests réels sur appareils VR, Sentry et BrowserStack demandent un hébergement accessible publiquement et/ou une configuration du service ; aucun coût n'a été engagé.

## Sécurité

Utiliser une branche et une pull request, puis tester sur desktop, mobile et WebXR. Aucun secret API ne doit être stocké dans le code public. `LIVE_COMMERCE_ENABLED`, `STOCK_READY`, `AUTO_FULFILL` et `AI_ASSISTANT_ENABLED` doivent rester à `false` tant que les étapes de production ne sont pas validées.
