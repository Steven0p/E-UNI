# E-UNI — Espace Numérique Universitaire

Plateforme numérique destinée aux institutions universitaires haïtiennes : gestion des cours et
programmes, suivi des notes, paiement des frais académiques via MonCash, messagerie interne et
bibliothèque de ressources numériques.

**Stack :** React · Node.js / Express · MySQL
**Porteur du projet :** Infinity Code — Port-au-Prince, Haïti

## Lancer le projet en local

Trois services à démarrer, dans cet ordre : base de données → API back-end → front-end.

**Base de données + API** (un seul script) :

```bash
./scripts/start.sh
```

Ce script démarre MariaDB (une instance locale installée dans `~/.euni-mariadb`, sans droits
root — voir la section « Base de données locale sans sudo » de
[`euni-backend/README.md`](euni-backend/README.md) pour le détail de cette installation) et l'API
back-end (`euni-backend`) en arrière-plan. Il ne fait rien si les deux tournent déjà.

**Front-end** (dans un autre terminal, pour garder ses logs visibles) :

```bash
cd euni-frontend
npm start
```

Puis ouvrez <http://localhost:3000>.

**Vérifier ce qui tourne :**

```bash
./scripts/status.sh
```

**Tout arrêter :**

```bash
./scripts/stop.sh
```

Les données de la base survivent à l'arrêt (elles sont sur disque dans `~/.euni-mariadb/data`) ;
seuls les processus doivent être relancés à chaque session de travail.

Si `euni-backend/.env` n'existe pas encore, copiez `euni-backend/.env.example` vers `.env` et
renseignez-le avant de lancer `start.sh` (voir [`euni-backend/README.md`](euni-backend/README.md)).

## Documentation

- [`SPEC.md`](SPEC.md) — spécification fonctionnelle et technique complète (architecture, modèle
  de données, API REST, sécurité, installation).
- [`files/E-UNI_Documentation_Technique.pdf`](files/E-UNI_Documentation_Technique.pdf) —
  documentation technique détaillée pour les développeurs.
- [`files/E-UNI_Manuel_Utilisation.pdf`](files/E-UNI_Manuel_Utilisation.pdf) — manuel
  d'utilisation pour étudiants, enseignants et administrateurs.
