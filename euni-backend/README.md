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
- `POST /api/auth/forgot-password` répond toujours le même message, que le compte existe ou non
  (anti-énumération de comptes). L'e-mail de réinitialisation part via Resend
  (`RESEND_API_KEY`/`EMAIL_FROM`) ; si la clé est absente ou l'envoi échoue, le lien est
  journalisé côté serveur et, hors production (`NODE_ENV !== 'production'`), renvoyé directement
  dans la réponse pour permettre de tester le flux sans dépendre d'un envoi réel.
- `POST /api/auth/reset-password` révoque tous les jetons de rafraîchissement actifs de
  l'utilisateur (déconnexion forcée de toutes les sessions après un changement de mot de passe).
- Trois routes complètent le contrat d'API de `SPEC.md` pour couvrir des exigences fonctionnelles
  qui n'y étaient pas explicitement listées comme endpoints :
  - `GET /api/cours/etudiant/:id` et `POST /api/cours/:id/inscription` (RF-DASH-1)
  - `POST /api/paiements/manuel` (RF-PAIE-6, paiement de secours par un administrateur)

## Base de données locale sans sudo

L'environnement de développement de ce dépôt n'a pas d'accès `sudo`, donc MariaDB n'a pas été
installé via `apt` : les paquets `.deb` ont été téléchargés avec `apt-get download` (qui ne
nécessite pas les droits root) puis extraits avec `dpkg -x` dans `~/.euni-mariadb` — un dossier
appartenant entièrement à l'utilisateur, hors de tout chemin système. Le serveur `mariadbd`
tourne depuis ce dossier comme un processus utilisateur normal, avec ses propres `--datadir`,
`--socket` et `--pid-file`, sans toucher `/etc`, `/var/lib/mysql` ni systemd.

Si `sudo` est disponible sur votre machine, il est plus simple d'installer MariaDB normalement :

```bash
sudo apt update && sudo apt install -y mariadb-server
sudo systemctl enable --now mariadb
sudo mariadb -e "CREATE DATABASE euni_db; CREATE USER 'euni_user'@'localhost' IDENTIFIED BY '...'; GRANT ALL PRIVILEGES ON euni_db.* TO 'euni_user'@'localhost'; FLUSH PRIVILEGES;"
```

Sans `sudo`, reproduire l'installation locale :

```bash
mkdir -p ~/.euni-mariadb-debs && cd ~/.euni-mariadb-debs
apt-get download mariadb-common libmariadb3 mariadb-client-core mariadb-client mariadb-server-core mariadb-server
for f in *.deb; do dpkg -x "$f" "$HOME/.euni-mariadb"; done

"$HOME/.euni-mariadb/usr/bin/mariadb-install-db" --no-defaults \
  --datadir="$HOME/.euni-mariadb/data" --basedir="$HOME/.euni-mariadb/usr" \
  --auth-root-authentication-method=normal --skip-test-db
```

Puis démarrez-le avec [`../scripts/start.sh`](../scripts/start.sh) (voir le
[`README`](../README.md) racine), et créez la base et l'utilisateur une seule fois :

```bash
"$HOME/.euni-mariadb/usr/bin/mariadb" --no-defaults --socket="$HOME/.euni-mariadb/run/mysqld.sock" -u root <<'EOF'
CREATE DATABASE euni_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'euni_user'@'127.0.0.1' IDENTIFIED BY 'euni_dev_password';
GRANT ALL PRIVILEGES ON euni_db.* TO 'euni_user'@'127.0.0.1';
FLUSH PRIVILEGES;
EOF
```
