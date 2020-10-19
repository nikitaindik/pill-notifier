#!/bin/sh

docker run --rm --init --env-file="../.env" -it -p 3010:3010 -p 3011:3011 --name pills-container pills-image