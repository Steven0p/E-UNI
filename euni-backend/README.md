# E-UNI — Back-end

API REST du projet E-UNI (Node.js / Express / MySQL). Voir [`../SPEC.md`](../SPEC.md) pour la
spécification complète (exigences, modèle de données, contrat d'API).

## Démarrage rapide

```bash
npm install
cp .env.example .env   # renseigner DB_*, JWT_*, MONCASH_*
npm run migrate         # crée les tables dans MySQL (src/db/schema.sql)
npm run dev              # démarre l'API en développement (http://localhost:5000)
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Démarre l'API avec rechargement automatique (nodemon) |
| `npm start` | Démarre l'API en mode production |
| `npm run migrate` | Applique le schéma SQL à la base configurée |

## Notes d'implémentation

- L'inscription publique (`POST /api/auth/register`) crée toujours un compte `etudiant` ; les
  comptes `enseignant`/`admin` sont attribués par un administrateur directement en base (aucune
  route ne permet à un utilisateur de s'auto-attribuer un rôle privilégié).
- Le rafraîchissement de session (`POST /api/auth/refresh`) est révocable côté serveur via la
  table `refresh_tokens` (nécessaire pour `POST /api/auth/logout`).
- Le statut d'un paiement MonCash n'est jamais déduit du seul appel webhook : il est toujours
  reconfirmé par un appel serveur-à-serveur à `RetrieveTransactionPayment` avant mise à jour.
- Deux routes complètent le contrat d'API de `SPEC.md` pour couvrir des exigences fonctionnelles
  qui n'y étaient pas explicitement listées comme endpoints :
  - `GET /api/cours/etudiant/:id` et `POST /api/cours/:id/inscription` (RF-DASH-1)
  - `POST /api/paiements/manuel` (RF-PAIE-6, paiement de secours par un administrateur)
