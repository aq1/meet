#! /usr/bin/bash

set -e
set -o allexport
set +o allexport

export RELEASE=$(git rev-parse --short=8 HEAD)

echo "Building release ${RELEASE}"

docker build -t meet-server:${RELEASE} ./server
cd client && bun install --frozen-lockfile && bun run build && cd -
docker compose up -d
echo "Done"
