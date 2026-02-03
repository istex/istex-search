#!/bin/sh

export DOCKER_BUILDKIT=1

docker compose down
if [ ! $? -eq 0 ]; then
  exit 1
fi

DANGLING_IMAGES=$(docker images -q -f dangling=true)
if [ "$DANGLING_IMAGES" ]; then
  docker rmi $DANGLING_IMAGES
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
fi

docker compose up -d --build
