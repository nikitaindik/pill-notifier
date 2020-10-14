#!/bin/bash

# https://hub.docker.com/_/eclipse-mosquitto

docker run --rm --network=mosquitto-bridge-network -d -p 1883:1883 -p 9001:9001 -v /mosquitto/data -v /mosquitto/log eclipse-mosquitto