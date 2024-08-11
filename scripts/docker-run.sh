#!/bin/bash -ex

TAG=${1:-test}

docker stop connect4 || true
docker rm connect4 || true
docker run --name connect4 -p 3000:3000 -e BASE_PATH="/connect4" -d automationmusician/connect4:$TAG
