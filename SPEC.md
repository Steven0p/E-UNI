# E-UNI — Espace Numérique Universitaire
## Cahier des charges / Spécification fonctionnelle et technique

**Version 1.0 — Août 2026**
**Porteur du projet :** Infinity Code — Port-au-Prince, Haïti

---

## 1. Contexte et objectifs

E-UNI (Espace Numérique Universitaire) est une plateforme numérique destinée aux institutions
universitaires haïtiennes. Elle centralise, dans un espace unique :

- la gestion des cours et programmes académiques ;
- le suivi des notes et évaluations ;
- le paiement des frais académiques via **MonCash** (Digicel) ;
- la communication interne (messagerie et notifications) ;
- une bibliothèque de ressources numériques accessible aux étudiants et enseignants.

### 1.1 Objectifs

| # | Objectif |
|---|----------|
| O1 | Digitaliser la gestion académique (cours, programmes, notes, évaluations) |
| O2 | Faciliter le paiement des frais universitaires via MonCash, adapté au contexte haïtien |
| O3 | Améliorer la communication entre administration, enseignants et étudiants |
| O4 | Offrir un accès centralisé aux ressources pédagogiques numériques |
| O5 | Fonctionner de manière fiable malgré les contraintes d'infrastructure locales (connectivité limitée) |

### 1.2 Public cible

- **Étudiants** : consultent leurs cours, notes, frais, messages et ressources.
- **Enseignants** : gèrent leurs cours, créent des évaluations, saisissent des notes, publient des ressources.
- **Administrateurs** : supervisent programmes, comptes, paiements et statistiques.

### 1.3 Hors périmètre (v1.0)

- Application mobile native (le web est responsive mais aucune app iOS/Android n'est prévue).
- Visioconférence / cours en direct.
- Gestion de la scolarité complète (admissions, diplomation) — v1.0 se limite au cursus courant.

---

## 2. Architecture technique

Architecture trois-tiers avec séparation front-end / back-end / base de données.

```
Client (navigateur / mobile)
        │  HTTPS / REST (JSON)
        ▼
Front-end — React (SPA)
        │  Appels API (Axios / Fetch)
        ▼
Back-end — Node.js / Express (API REST)
        │  Requêtes SQL (driver mysql2)
        ▼
Base de données — MySQL
        │
        └── Service externe : API MonCash (paiements)
```

### 2.1 Choix technologiques

| Couche | Technologie | Rôle |
|---|---|---|
| Front-end | React.js (+ React Router, Axios) | Interface utilisateur, SPA |
| Back-end | Node.js + Express.js | API REST, logique métier |
| Base de données | MySQL ≥ 8.0 | Stockage relationnel des données |
| Authentification | JWT + bcryptjs | Sécurisation des sessions et mots de passe |
| Paiement | API MonCash (Digicel) | Paiement des frais académiques |
| Déploiement | Vercel (front) / VPS ou service Node (back) | Hébergement |

---

## 3. Structure du projet (cible)

### 3.1 Front-end (`euni-frontend/`)

```
euni-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/     # Composants réutilisables (Navbar, Cards, Modals)
│   ├── pages/          # Dashboard, Cours, Notes, Paiements, Messages, Bibliotheque
│   ├── context/        # AuthContext, NotificationContext
│   ├── services/       # api.js (Axios), authService, courseService, paymentService...
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── index.jsx
├── .env
└── package.json
```

### 3.2 Back-end (`euni-backend/`)

```
euni-backend/
├── src/
│   ├── config/          # db.js, moncash.js, env
│   ├── controllers/     # authController, courseController, gradeController,
│   │                     # paymentController, messageController, resourceController
│   ├── routes/           # authRoutes, courseRoutes, gradeRoutes, paymentRoutes, ...
│   ├── models/           # Modèles / requêtes SQL par entité
│   ├── middlewares/      # auth.js (JWT), errorHandler.js, rateLimiter.js
│   ├── services/         # moncashService.js, notificationService.js
│   ├── utils/
│   └── app.js
├── server.js
├── .env
└── package.json
```

---

## 4. Modèle de données (MySQL)

### 4.1 Tables principales

| Table | Description |
|---|---|
| `utilisateurs` | Comptes (étudiant, enseignant, administrateur) : identité, rôle, identifiants |
| `programmes` | Programmes académiques / filières offerts par l'institution |
| `cours` | Cours rattachés à un programme, avec enseignant responsable |
| `inscriptions` | Table de liaison étudiant ↔ cours (inscription à un cours) |
| `evaluations` | Évaluations planifiées pour un cours (examen, devoir, contrôle) |
| `notes` | Notes obtenues par un étudiant à une évaluation |
| `frais_academiques` | Frais dus par étudiant (montant, échéance, statut) |
| `paiements` | Transactions de paiement (référence MonCash, statut, montant) |
| `messages` | Messagerie interne entre utilisateurs |
| `notifications` | Notifications système envoyées aux utilisateurs |
| `ressources` | Ressources numériques (documents, liens) liées à un cours ou à la bibliothèque |

### 4.2 Détail des colonnes — tables clés

**`utilisateurs`**

| Colonne | Type | Description |
|---|---|---|
| `id` | INT, PK, AUTO_INCREMENT | Identifiant unique |
| `nom` / `prenom` | VARCHAR(100) | Identité de l'utilisateur |
| `email` | VARCHAR(150), UNIQUE | Identifiant de connexion |
| `mot_de_passe` | VARCHAR(255) | Hash bcrypt du mot de passe |
| `role` | ENUM('etudiant','enseignant','admin') | Rôle applicatif |
| `created_at` | DATETIME | Date de création du compte |

**`cours`**

| Colonne | Type | Description |
|---|---|---|
| `id` | INT, PK, AUTO_INCREMENT | Identifiant unique |
| `nom_cours` | VARCHAR(150) | Intitulé du cours |
| `programme_id` | INT, FK → `programmes.id` | Programme rattaché |
| `enseignant_id` | INT, FK → `utilisateurs.id` | Enseignant responsable |
| `credits` | INT | Nombre de crédits académiques |
| `semestre` | VARCHAR(20) | Semestre concerné |

**`paiements`**

| Colonne | Type | Description |
|---|---|---|
| `id` | INT, PK, AUTO_INCREMENT | Identifiant unique |
| `etudiant_id` | INT, FK → `utilisateurs.id` | Étudiant concerné |
| `frais_id` | INT, FK → `frais_academiques.id` | Frais réglé |
| `reference_moncash` | VARCHAR(100) | Référence transaction MonCash |
| `montant` | DECIMAL(10,2) | Montant payé (HTG) |
| `statut` | ENUM('en_attente','reussi','echoue') | Statut de la transaction |
| `date_paiement` | DATETIME | Horodatage du paiement |

> Les autres tables (`programmes`, `inscriptions`, `evaluations`, `notes`, `frais_academiques`,
> `messages`, `notifications`, `ressources`) suivent le même principe : clé primaire `id`, clés
> étrangères vers les entités liées, et colonnes métier propres à chaque domaine.

---

## 5. Spécification fonctionnelle par module

### 5.1 Connexion et compte

- Connexion par e-mail + mot de passe → retourne un token JWT.
- Récupération de mot de passe oublié.
- Changement de mot de passe depuis « Profil » → « Sécurité ».
- Le tableau de bord affiché après connexion dépend du rôle :

| Rôle | Aperçu du tableau de bord |
|---|---|
| Étudiant | Cours inscrits, dernières notes, frais à payer, messages et notifications récentes |
| Enseignant | Cours enseignés, évaluations à corriger, messages des étudiants |
| Administrateur | Vue d'ensemble des programmes, statistiques des paiements, gestion des comptes |

### 5.2 Cours et programmes académiques

- Étudiant : consulte la liste des cours de son programme, le détail de chaque cours (description,
  enseignant, crédits, semestre).
- Enseignant / Administrateur : crée, modifie, supprime un cours ; consulte la liste des étudiants
  inscrits à un cours.

### 5.3 Notes et évaluations

- Enseignant : crée une évaluation (examen, devoir, contrôle) avec date et coefficient ; saisit les
  notes des étudiants après correction.
- Étudiant : consulte, par cours, le détail de ses évaluations, sa note à chacune, et sa moyenne.
- Contrainte : les notes sont visibles par l'étudiant immédiatement après enregistrement — la saisie
  doit donc être vérifiée avant validation côté enseignant.

### 5.4 Paiement des frais académiques (MonCash)

1. L'étudiant consulte la liste de ses frais (montant dû, échéance).
2. Il sélectionne un frais et déclenche le paiement (« Payer avec MonCash »).
3. Le back-end appelle l'API MonCash pour générer une transaction et redirige l'étudiant vers la
   page de paiement MonCash.
4. L'étudiant confirme le paiement avec son numéro MonCash et son code.
5. MonCash notifie le back-end (webhook) ou le back-end interroge le statut de la transaction.
6. Le statut est mis à jour dans `paiements` et le frais correspondant passe à « Payé ».

Bonnes pratiques imposées :

- Toujours vérifier le statut d'une transaction **côté serveur** avant de la valider (ne jamais se
  fier au seul retour côté client).
- Journaliser chaque tentative de paiement (succès, échec, en attente).
- Prévoir un mode de secours (paiement manuel avec justificatif) en cas d'indisponibilité de l'API
  MonCash.

### 5.5 Communication

- Messagerie interne entre étudiant, enseignant et administration (liste de conversations,
  nouveau message).
- Notifications système (cloche) : nouvelles notes, échéances de paiement, messages non lus,
  annonces de l'administration.

### 5.6 Bibliothèque / Ressources numériques

- Recherche de ressources par cours, mot-clé ou catégorie.
- Consultation / téléchargement d'une ressource.
- Les enseignants peuvent ajouter des ressources directement depuis la page de leur cours.

---

## 6. API REST

Toutes les routes protégées requièrent un jeton JWT transmis dans l'en-tête
`Authorization: Bearer <token>`.

### 6.1 Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Création d'un compte utilisateur |
| POST | `/api/auth/login` | Connexion, retourne un token JWT |
| POST | `/api/auth/refresh` | Rafraîchissement du token |
| POST | `/api/auth/logout` | Déconnexion |

### 6.2 Cours et programmes

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/cours` | Liste des cours |
| GET | `/api/cours/:id` | Détail d'un cours |
| POST | `/api/cours` | Créer un cours (admin/enseignant) |
| PUT | `/api/cours/:id` | Modifier un cours |
| DELETE | `/api/cours/:id` | Supprimer un cours |
| GET | `/api/programmes` | Liste des programmes académiques |

### 6.3 Notes et évaluations

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/evaluations/cours/:coursId` | Évaluations d'un cours |
| POST | `/api/evaluations` | Créer une évaluation |
| POST | `/api/notes` | Saisir/mettre à jour une note |
| GET | `/api/notes/etudiant/:id` | Relevé de notes d'un étudiant |

### 6.4 Paiements (MonCash)

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/frais/etudiant/:id` | Frais dus par un étudiant |
| POST | `/api/paiements/initier` | Initier un paiement MonCash |
| GET | `/api/paiements/verifier/:reference` | Vérifier le statut d'une transaction |
| POST | `/api/paiements/webhook` | Callback de confirmation MonCash |

### 6.5 Communication et ressources

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/messages/:userId` | Messages d'un utilisateur |
| POST | `/api/messages` | Envoyer un message |
| GET | `/api/notifications/:userId` | Notifications d'un utilisateur |
| GET | `/api/ressources` | Liste des ressources numériques |
| POST | `/api/ressources` | Ajouter une ressource |

---

## 7. Authentification et sécurité

- Mots de passe hachés avec **bcryptjs** (jamais stockés en clair).
- Authentification par **JWT** avec expiration courte + mécanisme de rafraîchissement.
- Middleware de contrôle de rôle (étudiant / enseignant / admin) sur chaque route sensible.
- Limitation du débit (rate limiting) sur les routes d'authentification pour prévenir les attaques
  par force brute.
- Validation systématique des entrées côté serveur (`express-validator` ou équivalent).
- Connexions à la base de données via requêtes préparées (protection contre les injections SQL).
- HTTPS obligatoire en production.
- Variables sensibles (clés MonCash, secrets JWT) stockées dans des variables d'environnement
  (`.env`), jamais commitées.

---

## 8. Installation et déploiement

### 8.1 Prérequis

- Node.js ≥ 18.x et npm
- MySQL ≥ 8.0
- Compte marchand MonCash (clés API sandbox et production)

### 8.2 Installation locale

```bash
# Back-end
cd euni-backend
npm install
cp .env.example .env   # renseigner DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET, MONCASH_KEY...
npm run migrate        # création des tables
npm run dev             # démarrage en développement

# Front-end
cd euni-frontend
npm install
cp .env.example .env   # renseigner REACT_APP_API_URL
npm start
```

### 8.3 Déploiement

- **Front-end** : Vercel (build automatique depuis le dépôt GitHub).
- **Back-end** : VPS ou service Node (ex. Render, Railway) avec variables d'environnement
  configurées côté production.
- **Base de données** : instance MySQL managée ou hébergée localement selon les contraintes
  d'infrastructure de l'institution.
- Sauvegardes régulières (dump MySQL automatisé).

### 8.4 Variables d'environnement (back-end)

```
PORT=5000
DB_HOST=localhost
DB_USER=euni_user
DB_PASSWORD=********
DB_NAME=euni_db
JWT_SECRET=********
MONCASH_CLIENT_ID=********
MONCASH_CLIENT_SECRET=********
MONCASH_MODE=sandbox
```

---

## 9. Bonnes pratiques de développement

- Respecter la structure de dossiers définie (séparation controllers / routes / models / services).
- Utiliser des noms de branches Git explicites (`feature/`, `fix/`, `hotfix/`) et des messages de
  commit clairs.
- Documenter chaque nouvelle route API (méthode, paramètres, réponse) dans ce document.
- Écrire des tests pour la logique métier critique (paiements, calcul de notes).
- Gérer les erreurs de façon centralisée via un middleware `errorHandler`.

---

## 10. Glossaire

| Terme | Définition |
|---|---|
| JWT | JSON Web Token, format de jeton utilisé pour l'authentification |
| API REST | Interface de programmation respectant les principes REST |
| ORM | Object-Relational Mapping, couche d'abstraction entre code et base de données |
| Webhook | Notification HTTP automatique envoyée par un service externe (ici, MonCash) |

---

## 11. Documents de référence

Les documents détaillés qui ont servi de base à cette spécification sont disponibles dans
[`files/`](files/) :

- [`E-UNI_Documentation_Technique.pdf`](files/E-UNI_Documentation_Technique.pdf) — documentation
  technique complète destinée aux développeurs.
- [`E-UNI_Manuel_Utilisation.pdf`](files/E-UNI_Manuel_Utilisation.pdf) — manuel d'utilisation
  destiné aux étudiants, enseignants et administrateurs.
