#!/usr/bin/env bash
set -euo pipefail

PRICE="${1:-}"
MODE="${2:-}"

REPO_DIR="/home/reconociendotupoder.com/source"
TARGET_FILE="src/site/dna.config.ts"
BRANCH="reconociendotupoder"
PUBLIC_HTML="/home/reconociendotupoder.com/public_html"
BACKUP_ROOT="/home/reconociendotupoder.com/backups"
PRICE_PATTERN='const noLeEscribasPrice = [0-9]+;'

usage() {
  echo "Uso: ./cambiarprecio.sh <precio> [--no-deploy|--no-commit]"
  echo "Ejemplo: ./cambiarprecio.sh 39"
}

if [[ -z "$PRICE" ]]; then
  usage
  exit 1
fi

if ! [[ "$PRICE" =~ ^[0-9]+$ ]]; then
  echo "Error: el precio debe ser un entero positivo."
  exit 1
fi

if (( PRICE <= 0 || PRICE >= 10000 )); then
  echo "Error: precio fuera de rango permitido."
  exit 1
fi

if [[ -n "$MODE" && "$MODE" != "--no-deploy" && "$MODE" != "--no-commit" ]]; then
  echo "Error: modo inválido: $MODE"
  echo "Modos válidos: --no-deploy, --no-commit"
  exit 1
fi

if (( $# > 2 )); then
  echo "Error: se recibieron demasiados argumentos."
  usage
  exit 1
fi

cd "$REPO_DIR"

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  echo "Error: rama actual '$CURRENT_BRANCH'. Debe ser '$BRANCH'."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree no está limpio. Revisa cambios antes de continuar."
  git status --short
  exit 1
fi

MATCH_COUNT="$(grep -Ec "$PRICE_PATTERN" "$TARGET_FILE" || true)"
if [[ "$MATCH_COUNT" != "1" ]]; then
  echo "Error: se esperaba 1 coincidencia de noLeEscribasPrice, pero se encontraron $MATCH_COUNT."
  exit 1
fi

CURRENT_PRICE="$(grep -Eo "$PRICE_PATTERN" "$TARGET_FILE" | grep -Eo '[0-9]+')"
if [[ "$CURRENT_PRICE" == "$PRICE" ]]; then
  echo "Error: el precio ya es Bs $PRICE. No hay cambios para aplicar."
  exit 1
fi

echo "Cambiando precio No Le Escribas de Bs $CURRENT_PRICE a Bs $PRICE..."

perl -0pi -e "s/const noLeEscribasPrice = \\d+;/const noLeEscribasPrice = $PRICE;/" "$TARGET_FILE"

UPDATED_MATCH_COUNT="$(grep -Ec "const noLeEscribasPrice = $PRICE;" "$TARGET_FILE" || true)"
if [[ "$UPDATED_MATCH_COUNT" != "1" ]]; then
  echo "Error: no se pudo verificar el nuevo precio en $TARGET_FILE."
  exit 1
fi

echo "Validando..."

npm test
php -l public/capture.php
npm run typecheck
npm run lint
npm run build
git diff --check

echo "Diff:"
git diff --stat
git diff -- "$TARGET_FILE"

if [[ "$MODE" == "--no-commit" ]]; then
  echo "Modo --no-commit activo. No se hará commit, push ni deploy."
  echo "Precio aplicado localmente: Bs $PRICE"
  exit 0
fi

git add "$TARGET_FILE"
git commit -m "chore: set no le escribas price to Bs $PRICE"

COMMIT_HASH="$(git rev-parse HEAD)"

git push origin "$BRANCH"

if [[ "$MODE" == "--no-deploy" ]]; then
  echo "Modo --no-deploy activo. No se hará deploy."
  echo "Precio aplicado: Bs $PRICE"
  echo "Commit: $COMMIT_HASH"
  echo "Push: OK"
  git status --short
  exit 0
fi

BACKUP_DIR="$BACKUP_ROOT/public_html-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_ROOT"

echo "Creando backup en $BACKUP_DIR..."
cp -a "$PUBLIC_HTML" "$BACKUP_DIR"

echo "Deploy..."
rsync -av --delete \
  --exclude 'capture.php' \
  --exclude '/fi/' \
  --exclude '/x9m/fi/' \
  dist/ "$PUBLIC_HTML/"

chown -R recon3297:recon3297 "$PUBLIC_HTML"
chown recon3297:nogroup "$PUBLIC_HTML"
find "$PUBLIC_HTML" -type d -exec chown recon3297:nogroup {} \;
find "$PUBLIC_HTML" -type f -exec chown recon3297:recon3297 {} \;

echo "Smoke checks..."

URLS=(
  "https://reconociendotupoder.com/"
  "https://reconociendotupoder.com/x9m"
  "https://reconociendotupoder.com/no-le-escribas"
  "https://reconociendotupoder.com/x9m/no-le-escribas"
  "https://reconociendotupoder.com/confirmacion"
  "https://reconociendotupoder.com/x9m/confirmacion"
)

for url in "${URLS[@]}"; do
  STATUS="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "$url" || true)"
  echo "$STATUS $url"
  if [[ "$STATUS" != "200" ]]; then
    echo "Error: smoke check falló para $url"
    exit 1
  fi
done

echo ""
echo "Precio aplicado: Bs $PRICE"
echo "Commit: $COMMIT_HASH"
echo "Push: OK"
echo "Backup: $BACKUP_DIR"
echo "Deploy: OK"
echo "Smoke: OK"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "Working tree: clean"
else
  echo "Working tree:"
  git status --short
fi
