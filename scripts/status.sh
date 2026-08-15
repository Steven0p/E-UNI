#!/usr/bin/env bash
# Affiche l'état des services E-UNI (base de données, API, front-end).
set -uo pipefail

DB_PREFIX="$HOME/.euni-mariadb"

echo "== Base de données (MariaDB) =="
if "$DB_PREFIX/usr/bin/mariadb-admin" --no-defaults --socket="$DB_PREFIX/run/mysqld.sock" ping > /dev/null 2>&1; then
  echo "En cours d'exécution (port 3306)."
else
  echo "Arrêtée."
fi

echo
echo "== API back-end =="
if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
  echo "En cours d'exécution."
  curl -s http://localhost:5000/health && echo
else
  echo "Arrêtée."
fi

echo
echo "== Front-end =="
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
  echo "En cours d'exécution (http://localhost:3000)."
else
  echo "Arrêté (démarrez-le avec : cd euni-frontend && npm start)."
fi
