#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if command -v flock >/dev/null 2>&1; then
  exec 9>".update.lock"
  if ! flock -n 9; then
    echo "==> Another update is already running. Exiting."
    exit 0
  fi
else
  LOCK_DIR=".update.lock.d"
  if ! mkdir "$LOCK_DIR" 2>/dev/null; then
    echo "==> Another update is already running. Exiting."
    exit 0
  fi
  trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT
fi

CONTAINER="meet"
BRANCH="${BRANCH:-main}"
STATE_FILE=".last-deployed-commit"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

notify() {
  local message="$1"
  if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
    curl -sf -m 10 \
      "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      -d "text=${message}" \
      -d "disable_web_page_preview=true" >/dev/null || true
  fi
}

trap 'notify "❌ meet update failed (line $LINENO). See server logs."' ERR

echo "==> Fetching latest from git ($BRANCH)..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
AFTER="$(git rev-parse HEAD)"
DEPLOYED="$(cat "$STATE_FILE" 2>/dev/null || true)"

if [ "$AFTER" = "$DEPLOYED" ]; then
  echo "==> Already built and deployed ($(git rev-parse --short HEAD)). Nothing to do."
  exit 0
fi

echo "==> Building and starting container ($CONTAINER)..."
docker compose up -d --build

echo "==> Cleaning up dangling images..."
docker image prune -f

echo "$AFTER" > "$STATE_FILE"

COMMIT="$(git rev-parse --short HEAD)"
SUBJECT="$(git log -1 --pretty=%s)"
echo "==> Done. $CONTAINER is running."
notify "✅ meet updated and restarted on $BRANCH @ ${COMMIT}: ${SUBJECT}"
