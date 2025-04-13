#! /usr/bin/bash

set -e
set -o allexport
set +o allexport

# Navigate to the Git repository
cd /home/aq1/dev/midi || exit 1

export RELEASE=$(git rev-parse --short=8 HEAD)

git pull

docker build -t midi:${RELEASE} ./server
cd client && bun run build && cd -
docker compose up -d
