FROM arm32v7/node:lts-alpine3.12

WORKDIR /home/pill_reminder_app

COPY src/utils utils
COPY src/core core
COPY src/webUi webUi

WORKDIR /home/pill_reminder_app/utils
RUN npm install

WORKDIR /home/pill_reminder_app/core
RUN npm install

WORKDIR /home/pill_reminder_app/webUi/server
RUN npm install

WORKDIR /home/pill_reminder_app/webUi/client
RUN npm install
RUN npm run build

WORKDIR /home/pill_reminder_app

COPY scripts/docker-entrypoint.sh .

EXPOSE 3010
EXPOSE 3011

ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]