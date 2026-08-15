# E-UNI — Front-end

Interface web du projet E-UNI (React SPA, Tailwind CSS). Voir [`../SPEC.md`](../SPEC.md) pour la
spécification complète.

## Démarrage rapide

```bash
npm install
cp .env.example .env   # renseigner REACT_APP_API_URL (par défaut http://localhost:5000/api)
npm start                # démarre l'interface sur http://localhost:3000
```

Nécessite que [`../euni-backend`](../euni-backend) tourne (avec sa base MySQL migrée) pour que les
appels API fonctionnent.

## Direction visuelle

Le design s'inspire d'un registre académique plutôt que d'un tableau de bord SaaS générique :
- **Couleurs** : `ink` (encre, texte et structure), `paper` (papier, fond), `accent` (teinte
  sarcelle pour les actions et liens), et une palette sémantique séparée (`success`, `warning`,
  `danger`) pour les statuts. Définies dans [`tailwind.config.js`](tailwind.config.js).
- **Typographie** : IBM Plex Sans pour le texte et l'interface, IBM Plex Mono pour toutes les
  données tabulaires (notes, montants, dates, coefficients).
- **Mise en page** : barre latérale fixe (identité, navigation, compte) plutôt qu'une barre
  supérieure ; les listes (cours, notes, paiements) sont de vrais tableaux avec filets fins, pas
  des cartes flottantes ; les statuts sont affichés en pastilles (`Pill`) colorées selon leur sens.

## Structure

```
src/
├── components/   # Sidebar, AuthLayout, Pill, StatTile, PageHeader, ProtectedRoute
├── pages/        # Login, Register, ForgotPassword, ResetPassword, Dashboard, Cours,
│                 # CoursDetail, Notes, Paiements, Messages, Bibliotheque
├── context/      # AuthContext (session + JWT), NotificationContext
├── services/     # Un module par domaine API (authService, courseService, gradeService, ...)
├── utils/        # format.js (dates, montants HTG)
├── App.jsx       # Routes et layout
└── index.jsx     # Point d'entrée
```

Chaque service dans `src/services/` correspond exactement au contrat d'API décrit dans
[`../SPEC.md`](../SPEC.md#7-interface-de-programmation-api-rest).
