#!/usr/bin/env bash
# Arrête l'API back-end et la base de données MariaDB locale démarrées par start.sh.
set -uo pipefail

DB_PREFIX="$HOME/.euni-mariadb"

echo "== Arrêt de l'API back-end =="
if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
  pkill -f "node server.js" && echo "Arrêtée." || echo "Échec de l'arrêt."
else
  echo "N'était pas en cours d'exécution."
fi

echo
echo "== Arrêt de MariaDB =="
if [ -S "$DB_PREFIX/run/mysqld.sock" ] && \
   "$DB_PREFIX/usr/bin/mariadb-admin" --no-defaults --socket="$DB_PREFIX/run/mysqld.sock" ping > /dev/null 2>&1; then
  "$DB_PREFIX/usr/bin/mariadb-admin" --no-defaults --socket="$DB_PREFIX/run/mysqld.sock" -u root shutdown \
    && echo "Arrêtée proprement." \
    || echo "Échec de l'arrêt propre."
else
  echo "N'était pas en cours d'exécution."
fi
