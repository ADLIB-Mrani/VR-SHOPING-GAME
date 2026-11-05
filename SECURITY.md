# Politique de sécurité NOVA

## Garanties implémentées

- Montants calculés côté API à partir d'un catalogue de confiance, unités monétaires entières (centimes) et limites quantitatives.
- La clé Stripe, le secret de signature, le token Shippo et le token administrateur ne figurent jamais dans les ressources du navigateur.
- Le webhook Stripe est authentifié par HMAC-SHA256 et horodatage (fenêtre de 5 minutes) ; le numéro de session, le montant, l'ID de commande et la devise sont comparés avant de marquer une commande payée.
- Historique navigateur : uniquement identifiant, statut, récapitulatif et jeton secret de consultation ; aucune adresse complète n'est stockée localement.
- Accès individuel aux commandes par jeton aléatoire de 256 bits dont seul le SHA-256 est stocké côté serveur. Les erreurs ne révèlent pas la présence d'une commande à un client sans jeton valide.
- API admin protégée par un bearer secret côté serveur ; CORS restreint à l'origine déclarée. Les champs sont limités en taille et validés avant usage.
- Les informations non fiables n'entrent pas dans des interpolations HTML de données personnelles ; les textes dynamiques de l'interface utilisent `textContent`.
- La vente et l'achat automatique d'étiquettes sont désactivés par défaut et contrôlés par paramètres explicites.

## Travail restant avant production commerciale

Le code est une fondation commerce fonctionnelle, **pas une certification PCI, RGPD ni une infrastructure marchande auditée**. Avant de vendre, ajoutez : inventaire transactionnel, plafonds de commandes, journalisation sécurisée et alerting, règles WAF et anti-abus, gestion des remboursements, réconciliation Stripe, opérations de conformité, rétention/suppression D1, gestion de session des administrateurs et tests réels du fournisseur de livraison. Les livraisons à grande échelle nécessitent une architecture de traitement asynchrone et idempotente. Les callbacks de transporteur sont à développer si un suivi détaillé est requis.

## Signalement

Ouvrir une issue GitHub sans données sensibles et sans code secret. Ne publiez jamais les tokens ni les coordonnées d'acheteurs dans une issue.

L'option OpenAI est désactivée par défaut. Si elle est activée, la question est transmise au service OpenAI et doit être considérée comme une donnée confiée à un fournisseur tiers ; ajoutez un consentement approprié et des protections de coût et de fréquence.
