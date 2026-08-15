# E-UNI — Front-end

Interface web du projet E-UNI (React SPA). Voir [`../SPEC.md`](../SPEC.md) pour la spécification
complète.

## Démarrage rapide

```bash
npm install
cp .env.example .env   # renseigner REACT_APP_API_URL (par défaut http://localhost:5000/api)
npm start                # démarre l'interface sur http://localhost:3000
```

Nécessite que [`../euni-backend`](../euni-backend) tourne (avec sa base MySQL migrée) pour que les
appels API fonctionnent.

## Structure

```
src/
├── components/   # Navbar, ProtectedRoute
├── pages/        # Login, Register, Dashboard, Cours, CoursDetail, Notes, Paiements, Messages, Bibliotheque
├── context/      # AuthContext (session + JWT), NotificationContext
├── services/     # Un module par domaine API (authService, courseService, gradeService, ...)
├── App.jsx       # Routes et layout
└── index.jsx     # Point d'entrée
```

Chaque service dans `src/services/` correspond exactement au contrat d'API décrit dans
[`../SPEC.md`](../SPEC.md#7-interface-de-programmation-api-rest).
