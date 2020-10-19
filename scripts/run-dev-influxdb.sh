#!/bin/bash

# https://hub.docker.com/_/eclipse-mosquitto

volume="${PWD%/*}/volume"

docker run --rm -d -p 8086:8086 -v $volume:/var/lib/influxdb --name influxdb-container influxdb