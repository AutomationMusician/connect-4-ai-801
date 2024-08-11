#!/bin/bash -e

SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/../

TAG=${1:-test}

docker build -t automationmusician/connect4:$TAG .
