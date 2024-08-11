#!/bin/bash -ex

TAG=${1:-test}

docker push automationmusician/connect4:$TAG