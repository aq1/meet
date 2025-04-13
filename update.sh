#! /usr/bin/bash

set -e
set -o allexport
set +o allexport

export RELEASE=$(git rev-parse --short=8 HEAD)

git pull

docker build -t meet-server:${RELEASE} ./server
cd client && bun run build && cd -
docker compose up -d
