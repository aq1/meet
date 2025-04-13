#! /usr/bin/bash

set -e
set -o allexport
set +o allexport

# Navigate to the Git repository
cd /home/aq1/dev/midi || exit 1

git pull

cd server && docker build -t midi .
