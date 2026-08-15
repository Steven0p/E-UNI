#!/usr/bin/env bash
# Démarre la base de données MariaDB locale et l'API back-end en arrière-plan.
# Le front-end n'est PAS démarré ici : lancez-le à part avec `npm start` dans
# euni-frontend/ pour garder son terminal au premier plan (logs en direct).
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_PREFIX="$HOME/.euni-mariadb"
DB_SOCK="$DB_PREFIX/run/mysqld.sock"
BACKEND_LOG="$REPO_DIR/euni-backend/backend.log"

echo "== 1/2 Base de données (MariaDB) =="
if "$DB_PREFIX/usr/bin/mariadb-admin" --no-defaults --socket="$DB_SOCK" ping > /dev/null 2>&1; then
  echo "Déjà en cours d'exécution."
else
  mkdir -p "$DB_PREFIX/run"
  "$DB_PREFIX/usr/sbin/mariadbd" \
    --no-defaults \
    --datadir="$DB_PREFIX/data" \
    --basedir="$DB_PREFIX/usr" \
    --socket="$DB_SOCK" \
    --pid-file="$DB_PREFIX/run/mysqld.pid" \
    --port=3306 \
    --bind-address=127.0.0.1 \
    --skip-networking=0 \
    > "$DB_PREFIX/run/mysqld.log" 2>&1 &
  disown
  echo "Démarrage en cours..."
  for _ in $(seq 1 20); do
    if "$DB_PREFIX/usr/bin/mariadb-admin" --no-defaults --socket="$DB_SOCK" ping > /dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
  echo "Prête (socket : $DB_SOCK, port : 3306)."
fi

echo
echo "== 2/2 API back-end =="
if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
  echo "Déjà en cours d'exécution."
else
  if [ ! -f "$REPO_DIR/euni-backend/.env" ]; then
    echo "ERREUR : euni-backend/.env est absent. Copiez .env.example vers .env et renseignez-le d'abord." >&2
    exit 1
  fi
  (cd "$REPO_DIR/euni-backend" && setsid nohup npm start > "$BACKEND_LOG" 2>&1 < /dev/null &)
  echo "Démarrage en cours..."
  for _ in $(seq 1 20); do
    if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
  echo "Prête (logs : euni-backend/backend.log)."
fi

echo
curl -s http://localhost:5000/health && echo
echo
echo "Pour le front-end, dans un autre terminal :"
echo "  cd euni-frontend && npm start"
