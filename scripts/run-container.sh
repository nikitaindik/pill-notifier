#!/bin/sh

docker run --rm \
    --init \
    --env-file="../.env" \
    -it \
    -p 3010:3010 \
    -p 3011:3011 \
    -v /Users/n.indik/Play/pill-notifier/src/webUi/client/build:/home/pill_reminder_app/webUi/client/build \
    --name pills-container \
    pills-image


    #    --entrypoint="/bin/sh" \
