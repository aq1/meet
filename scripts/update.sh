#!/usr/bin/env bash
set -euo pipefail

# Update the meet app: fetch latest from git, rebuild the Docker image, and
# restart the container under the name "meet".

cd "$(dirname "$0")/.."

IMAGE="meet"
CONTAINER="meet"
NETWORK="bond"
BRANCH="${BRANCH:-main}"

echo "==> Fetching latest from git ($BRANCH)..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> Building Docker image ($IMAGE)..."
docker build -t "$IMAGE" .

echo "==> Stopping and removing existing container ($CONTAINER)..."
docker rm -f "$CONTAINER" 2>/dev/null || true

echo "==> Starting container ($CONTAINER) on network $NETWORK..."
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  --network "$NETWORK" \
  --env-file .env \
  "$IMAGE"

echo "==> Cleaning up dangling images..."
docker image prune -f

echo "==> Done. $CONTAINER is running on network $NETWORK."
