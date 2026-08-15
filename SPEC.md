# E-UNI — Espace Numérique Universitaire
## Spécification des exigences logicielles (SRS)

**Version 2.0 — Août 2026**
**Porteur du projet :** Infinity Code — Port-au-Prince, Haïti
**Statut :** Document de référence pour la conception, le développement et la recevabilité du produit.

---

## 1. Introduction

### 1.1 Objet du document

Ce document spécifie les exigences fonctionnelles et non fonctionnelles de la plateforme **E-UNI**
(Espace Numérique Universitaire). Il sert de référence unique pour l'équipe de développement, les
testeurs et les parties prenantes de l'institution universitaire cliente, afin de garantir une
compréhension commune de ce que le produit doit faire — et de ce qu'il ne doit pas faire — avant et
pendant la construction.

### 1.2 Périmètre du produit

E-UNI est une plateforme web qui centralise pour une institution universitaire haïtienne :

- la gestion des programmes académiques et des cours ;
- le suivi des notes et évaluations ;
- le paiement des frais académiques via MonCash (Digicel) ;
- la communication interne (messagerie et notifications) ;
- une bibliothèque de ressources numériques.

### 1.3 Hors périmètre (v1.0)

| Exclu | Raison |
|---|---|
| Application mobile native (iOS/Android) | Le front-end web est responsive ; une app native est un chantier séparé |
| Visioconférence / cours en direct | Nécessite une infrastructure et des coûts distincts, non requis en v1.0 |
| Admissions et diplomation | Le périmètre se limite à la gestion du cursus courant (cours, notes, paiement) |
| Multi-établissement (multi-tenant) | v1.0 cible une seule institution ; le multi-tenant est une évolution possible |

### 1.4 Définitions et acronymes

| Terme | Définition |
|---|---|
| JWT | JSON Web Token — jeton signé utilisé pour authentifier les requêtes |
| SPA | Single Page Application |
| RF | Exigence fonctionnelle (Requirement Fonctionnel) |
| RNF | Exigence non fonctionnelle |
| Webhook | Notification HTTP automatique envoyée par un service externe (MonCash) |
| HTG | Gourde haïtienne, devise des transactions |

---

## 2. Description générale

### 2.1 Parties prenantes et classes d'utilisateurs

| Rôle | Description | Besoins principaux |
|---|---|---|
| **Étudiant** | Utilisateur inscrit à un ou plusieurs cours | Consulter cours/notes, payer ses frais, communiquer, accéder aux ressources |
| **Enseignant** | Responsable d'un ou plusieurs cours | Gérer ses cours, créer des évaluations, saisir des notes, publier des ressources |
| **Administrateur** | Personnel de l'institution | Superviser programmes, comptes, statistiques de paiement |
| **Infinity Code (mainteneur)** | Équipe technique | Faire évoluer la plateforme, assurer le support |

### 2.2 Hypothèses et contraintes

- Connectivité internet localement limitée et instable → l'interface doit rester utilisable en
  connexion lente (paiements et chargements de pages optimisés, messages d'erreur clairs en cas de
  coupure).
- Le paiement s'effectue exclusivement via MonCash en v1.0 (pas de carte bancaire).
- La langue principale de l'interface est le français ; une interface bilingue français/créole est
  une évolution envisageable mais non requise en v1.0.
- L'institution fournit ses propres données de programmes/cours lors de la mise en service
  (pas d'import automatisé prévu en v1.0).

---

## 3. Exigences fonctionnelles

Chaque exigence est identifiée par un code `RF-<module>-<numéro>` et assortie d'un critère
d'acceptation vérifiable.

### 3.1 Authentification et comptes (RF-AUTH)

| ID | Exigence | Critère d'acceptation |
|---|---|---|
| RF-AUTH-1 | Un utilisateur peut créer un compte avec e-mail, mot de passe et rôle | Le compte est créé avec mot de passe haché (bcrypt) ; l'e-mail est unique |
| RF-AUTH-2 | Un utilisateur peut se connecter avec e-mail + mot de passe | Une connexion valide retourne un token JWT ; une connexion invalide retourne une erreur explicite sans révéler si c'est l'e-mail ou le mot de passe qui est erroné |
| RF-AUTH-3 | Un utilisateur peut réinitialiser un mot de passe oublié | Un lien/processus de réinitialisation est envoyé à l'e-mail associé au compte |
| RF-AUTH-4 | Un utilisateur peut se déconnecter | Le token courant est invalidé côté client (et rafraîchissement bloqué côté serveur si applicable) |
| RF-AUTH-5 | Le tableau de bord affiché après connexion dépend du rôle | Étudiant, enseignant et administrateur voient chacun un contenu de tableau de bord distinct (cf. §3.2) |

### 3.2 Tableau de bord (RF-DASH)

| ID | Exigence | Critère d'acceptation |
|---|---|---|
| RF-DASH-1 | L'étudiant voit ses cours inscrits, dernières notes, frais à payer, messages/notifications récentes | Chaque section affiche les données réelles de l'utilisateur connecté, limitées aux N éléments les plus récents |
| RF-DASH-2 | L'enseignant voit ses cours enseignés, évaluations à corriger, messages des étudiants | Idem, filtré sur les cours dont il est responsable |
| RF-DASH-3 | L'administrateur voit une vue d'ensemble des programmes, statistiques de paiement, gestion des comptes | Les statistiques agrègent l'ensemble de l'institution |

### 3.3 Cours et programmes académiques (RF-COURS)

| ID | Exigence | Critère d'acceptation |
|---|---|---|
| RF-COURS-1 | Un étudiant peut consulter la liste des cours de son programme | La liste reflète les cours réellement rattachés au programme de l'étudiant |
| RF-COURS-2 | Un étudiant peut consulter le détail d'un cours (description, enseignant, crédits, semestre) | Toutes les informations du cours sont affichées correctement |
| RF-COURS-3 | Un enseignant/administrateur peut créer, modifier, supprimer un cours | L'opération est refusée (403) si l'utilisateur n'a pas le rôle requis |
| RF-COURS-4 | Un enseignant/administrateur peut consulter la liste des étudiants inscrits à un cours | La liste correspond exactement aux inscriptions actives |

### 3.4 Notes et évaluations (RF-NOTES)

| ID | Exigence | Critère d'acceptation |
|---|---|---|
| RF-NOTES-1 | Un enseignant peut créer une évaluation (type, date, coefficient) pour un cours dont il est responsable | L'évaluation créée est immédiatement visible pour les étudiants inscrits au cours |
| RF-NOTES-2 | Un enseignant peut saisir/modifier la note d'un étudiant pour une évaluation | La note est bornée à un intervalle valide ; la modification écrase la valeur précédente et journalise la date de mise à jour |
| RF-NOTES-3 | Un étudiant peut consulter, par cours, sa note à chaque évaluation et sa moyenne | La moyenne est recalculée selon les coefficients des évaluations |
| RF-NOTES-4 | Une note saisie devient visible à l'étudiant immédiatement | Aucune étape de validation supplémentaire ne retarde l'affichage (l'enseignant doit donc vérifier avant d'enregistrer) |

### 3.5 Paiement des frais académiques — MonCash (RF-PAIE)

| ID | Exigence | Critère d'acceptation |
|---|---|---|
| RF-PAIE-1 | Un étudiant peut consulter la liste de ses frais dus (montant, échéance, statut) | Les frais affichés correspondent aux enregistrements `frais_academiques` de l'étudiant |
| RF-PAIE-2 | Un étudiant peut initier le paiement d'un frais via MonCash | Le back-end génère une transaction MonCash et redirige l'étudiant vers la page de paiement |
| RF-PAIE-3 | Le statut d'un paiement est confirmé côté serveur, jamais uniquement côté client | Le statut final du paiement provient d'un webhook MonCash ou d'une vérification serveur explicite de la référence de transaction |
| RF-PAIE-4 | Une fois le paiement confirmé, le frais correspondant passe automatiquement au statut « Payé » | La mise à jour est atomique : `paiements.statut = 'reussi'` implique `frais_academiques` mis à jour dans la même opération logique |
| RF-PAIE-5 | Chaque tentative de paiement (succès, échec, en attente) est journalisée | Un enregistrement `paiements` existe pour chaque tentative, y compris les échecs |
| RF-PAIE-6 | En cas d'indisponibilité de l'API MonCash, un mode de secours (paiement manuel avec justificatif) est disponible pour l'administrateur | Un administrateur peut marquer un frais comme payé manuellement, avec traçabilité de qui a effectué l'action |

### 3.6 Communication (RF-COM)

| ID | Exigence | Critère d'acceptation |
|---|---|---|
| RF-COM-1 | Un utilisateur peut envoyer un message à un autre utilisateur de la plateforme (étudiant, enseignant, administration) | Le message est stocké et apparaît dans la conversation des deux parties |
| RF-COM-2 | Un utilisateur peut consulter la liste de ses conversations précédentes | Les conversations sont triées par activité la plus récente |
| RF-COM-3 | Un utilisateur reçoit une notification pour : nouvelle note, échéance de paiement proche, nouveau message, annonce administrative | Chaque évènement déclencheur génère un enregistrement `notifications` associé au bon utilisateur |
| RF-COM-4 | Un indicateur visuel (cloche) signale les notifications non lues | Le compteur reflète exactement le nombre de notifications non lues en base |

### 3.7 Bibliothèque / Ressources numériques (RF-RES)

| ID | Exigence | Critère d'acceptation |
|---|---|---|
| RF-RES-1 | Un utilisateur peut rechercher une ressource par cours, mot-clé ou catégorie | Les résultats correspondent au critère de recherche saisi |
| RF-RES-2 | Un utilisateur peut consulter ou télécharger une ressource | Le fichier/lien s'ouvre ou se télécharge sans erreur pour un utilisateur autorisé |
| RF-RES-3 | Un enseignant peut ajouter une ressource depuis la page de son cours | La ressource ajoutée est immédiatement associée au bon cours et visible par les étudiants inscrits |

---

## 4. Exigences non fonctionnelles

| ID | Catégorie | Exigence |
|---|---|---|
| RNF-1 | Sécurité | Mots de passe hachés avec bcrypt ; jamais stockés ni journalisés en clair |
| RNF-2 | Sécurité | Authentification par JWT à expiration courte, avec mécanisme de rafraîchissement |
| RNF-3 | Sécurité | Contrôle d'accès par rôle appliqué sur chaque route sensible côté serveur (pas seulement côté UI) |
| RNF-4 | Sécurité | Limitation du débit (rate limiting) sur les routes d'authentification |
| RNF-5 | Sécurité | Validation systématique des entrées côté serveur ; requêtes SQL paramétrées (anti-injection) |
| RNF-6 | Sécurité | HTTPS obligatoire en production ; secrets exclusivement en variables d'environnement, jamais commités |
| RNF-7 | Fiabilité | Le statut d'un paiement ne doit jamais être déterminé uniquement par une réponse côté client |
| RNF-8 | Disponibilité | La plateforme doit rester utilisable en conditions de connectivité limitée (réponses API légères, dégradation progressive plutôt que blocage total) |
| RNF-9 | Performance | Les listes (cours, notes, ressources) doivent se charger de façon paginée pour rester réactives sur connexion lente |
| RNF-10 | Maintenabilité | Séparation stricte controllers / routes / models / services côté back-end |
| RNF-11 | Traçabilité | Toute action sensible (paiement, saisie de note, création de compte) doit être horodatée |
| RNF-12 | Sauvegarde | Sauvegarde régulière et automatisée de la base MySQL |
| RNF-13 | Portabilité | Le front-end et le back-end sont déployables indépendamment (front sur Vercel, back sur VPS/service Node) |

---

## 5. Architecture technique

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

| Couche | Technologie | Rôle |
|---|---|---|
| Front-end | React.js (+ React Router, Axios) | Interface utilisateur, SPA |
| Back-end | Node.js + Express.js | API REST, logique métier |
| Base de données | MySQL ≥ 8.0 | Stockage relationnel des données |
| Authentification | JWT + bcryptjs | Sécurisation des sessions et mots de passe |
| Paiement | API MonCash (Digicel) | Paiement des frais académiques |
| Déploiement | Vercel (front) / VPS ou service Node (back) | Hébergement |

### 5.1 Structure du projet (cible)

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

## 6. Modèle de données (MySQL)

### 6.1 Tables principales

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

### 6.2 Détail des colonnes — tables clés

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

## 7. Interface de programmation (API REST)

Toutes les routes protégées requièrent un jeton JWT transmis dans l'en-tête
`Authorization: Bearer <token>`.

### 7.1 Authentification

| Méthode | Endpoint | Description | RF associée |
|---|---|---|---|
| POST | `/api/auth/register` | Création d'un compte utilisateur | RF-AUTH-1 |
| POST | `/api/auth/login` | Connexion, retourne un token JWT | RF-AUTH-2 |
| POST | `/api/auth/refresh` | Rafraîchissement du token | RF-AUTH-2 |
| POST | `/api/auth/logout` | Déconnexion | RF-AUTH-4 |
| POST | `/api/auth/forgot-password` | Demander un lien de réinitialisation de mot de passe | RF-AUTH-3 |
| POST | `/api/auth/reset-password` | Réinitialiser le mot de passe avec un jeton valide | RF-AUTH-3 |

### 7.2 Cours et programmes

| Méthode | Endpoint | Description | RF associée |
|---|---|---|---|
| GET | `/api/cours` | Liste des cours | RF-COURS-1 |
| GET | `/api/cours/:id` | Détail d'un cours | RF-COURS-2 |
| POST | `/api/cours` | Créer un cours (admin/enseignant) | RF-COURS-3 |
| PUT | `/api/cours/:id` | Modifier un cours | RF-COURS-3 |
| DELETE | `/api/cours/:id` | Supprimer un cours | RF-COURS-3 |
| GET | `/api/cours/:id/etudiants` | Étudiants inscrits à un cours | RF-COURS-4 |
| GET | `/api/cours/etudiant/:id` | Cours auxquels un étudiant est inscrit | RF-DASH-1 |
| POST | `/api/cours/:id/inscription` | Inscrire l'étudiant courant à un cours | RF-DASH-1 |
| GET | `/api/programmes` | Liste des programmes académiques | RF-COURS-1 |

### 7.3 Notes et évaluations

| Méthode | Endpoint | Description | RF associée |
|---|---|---|---|
| GET | `/api/evaluations/cours/:coursId` | Évaluations d'un cours | RF-NOTES-1 |
| POST | `/api/evaluations` | Créer une évaluation | RF-NOTES-1 |
| POST | `/api/notes` | Saisir/mettre à jour une note | RF-NOTES-2 |
| GET | `/api/notes/etudiant/:id` | Relevé de notes d'un étudiant | RF-NOTES-3 |

### 7.4 Paiements (MonCash)

| Méthode | Endpoint | Description | RF associée |
|---|---|---|---|
| GET | `/api/frais/etudiant/:id` | Frais dus par un étudiant | RF-PAIE-1 |
| POST | `/api/paiements/initier` | Initier un paiement MonCash | RF-PAIE-2 |
| GET | `/api/paiements/verifier/:reference` | Vérifier le statut d'une transaction | RF-PAIE-3 |
| POST | `/api/paiements/webhook` | Callback de confirmation MonCash | RF-PAIE-3, RF-PAIE-4 |
| POST | `/api/paiements/manuel` | Enregistrer un paiement manuel (admin, mode de secours) | RF-PAIE-6 |

### 7.5 Communication et ressources

| Méthode | Endpoint | Description | RF associée |
|---|---|---|---|
| GET | `/api/messages/:userId` | Messages d'un utilisateur | RF-COM-2 |
| POST | `/api/messages` | Envoyer un message | RF-COM-1 |
| GET | `/api/notifications/:userId` | Notifications d'un utilisateur | RF-COM-3 |
| GET | `/api/ressources` | Liste des ressources numériques | RF-RES-1 |
| POST | `/api/ressources` | Ajouter une ressource | RF-RES-3 |

---

## 8. Flux critique — Paiement MonCash

1. L'étudiant sélectionne un frais à régler et déclenche le paiement.
2. Le back-end appelle l'API MonCash pour générer une transaction et redirige l'étudiant vers la
   page de paiement MonCash.
3. L'étudiant confirme le paiement sur son compte MonCash (numéro + code).
4. MonCash notifie le back-end (webhook) ou le back-end interroge le statut de la transaction.
5. Le statut du paiement est mis à jour dans `paiements` et le frais correspondant est marqué
   comme réglé (RF-PAIE-3, RF-PAIE-4).

**Règle non négociable :** le statut « payé » n'est jamais déclaré sur la seule foi d'une réponse
reçue par le navigateur de l'étudiant — il doit toujours être confirmé par un appel serveur à
serveur vers MonCash (webhook ou vérification explicite).

---

## 9. Installation et déploiement

### 9.1 Prérequis

- Node.js ≥ 18.x et npm
- MySQL ≥ 8.0
- Compte marchand MonCash (clés API sandbox et production)

### 9.2 Installation locale

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

### 9.3 Déploiement

- **Front-end** : Vercel (build automatique depuis le dépôt GitHub).
- **Back-end** : VPS ou service Node (ex. Render, Railway) avec variables d'environnement
  configurées côté production.
- **Base de données** : instance MySQL managée ou hébergée localement selon les contraintes
  d'infrastructure de l'institution.
- Sauvegardes régulières (dump MySQL automatisé).

### 9.4 Variables d'environnement (back-end)

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

## 10. Risques identifiés

| Risque | Impact | Mitigation |
|---|---|---|
| Indisponibilité de l'API MonCash | Étudiants bloqués pour payer leurs frais | Mode de secours manuel avec justificatif (RF-PAIE-6) |
| Connectivité instable côté utilisateur | Perte de session, doubles soumissions | Pagination, boutons désactivés pendant requête, messages d'erreur explicites |
| Erreur de saisie de note par un enseignant | Note visible immédiatement, litige étudiant | Confirmation avant validation + historique de modification |
| Fuite de secrets (clés MonCash, JWT) | Compromission de comptes ou de paiements | Secrets uniquement en `.env`, jamais commités, rotation possible |

---

## 11. Feuille de route indicative

| Phase | Contenu |
|---|---|
| **Phase 1** | Authentification, gestion des cours/programmes, structure back-end/front-end de base |
| **Phase 2** | Notes et évaluations, tableau de bord par rôle |
| **Phase 3** | Intégration MonCash (paiements) |
| **Phase 4** | Messagerie, notifications, bibliothèque de ressources |
| **Phase 5** | Durcissement sécurité, tests de charge, déploiement production |

---

## 12. Bonnes pratiques de développement

- Respecter la structure de dossiers définie (séparation controllers / routes / models / services).
- Utiliser des noms de branches Git explicites (`feature/`, `fix/`, `hotfix/`) et des messages de
  commit clairs.
- Documenter chaque nouvelle route API (méthode, paramètres, réponse) dans ce document, avec sa
  référence `RF-*`.
- Écrire des tests pour la logique métier critique (paiements, calcul de notes).
- Gérer les erreurs de façon centralisée via un middleware `errorHandler`.

---

## 13. Documents de référence

- [`files/E-UNI_Documentation_Technique.pdf`](files/E-UNI_Documentation_Technique.pdf) —
  documentation technique complète destinée aux développeurs.
- [`files/E-UNI_Manuel_Utilisation.pdf`](files/E-UNI_Manuel_Utilisation.pdf) — manuel
  d'utilisation destiné aux étudiants, enseignants et administrateurs.
