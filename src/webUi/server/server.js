const fs = require('fs');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');

const enhancedMqtt = require('../../utils/enhancedMqtt');

const mqttClient = enhancedMqtt.connect('Web UI server');

const HTTP_PORT = 3010;
const WS_PORT = 3011;

const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`Web UI WS server listening on http://${process.env.WEB_UI_SERVER_ADDRESS}:${WS_PORT}`);
});

mqttClient.on('connect', function () {
  mqttClient.subscribe('is_pill_taken_today');
  mqttClient.subscribe('records');
  mqttClient.subscribe('pill_taken');
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'is_pill_taken_today') {
    const isPillTakenToday = JSON.parse(message);

    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({ type: 'isPillTakenToday', payload: isPillTakenToday }));
    });
  }

  if (topic === 'records') {
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({ type: 'records', payload: JSON.parse(message) }));
    });
  }

  if (topic === 'pill_taken') {
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({ type: 'pillTaken' }));
    });
  }
});

mqttClient.on('error', (error) => {
  console.log("Can't connect to MQTT broker");
  console.error(error);
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'buttonPush') {
      mqttClient.publish('button_push');
    }

    if (parsedMessage.type === 'deleteRecord') {
      mqttClient.publish('delete_record', parsedMessage.payload);
    }
  });

  mqttClient.publish('client_connected');
  mqttClient.publish('request_records');
});

const jsTemplate = fs.readFileSync(path.resolve(__dirname, '../client/client.js'), 'utf8');
const jsContent = jsTemplate.replace('{{WEB_UI_SERVER_ADDRESS}}', process.env.WEB_UI_SERVER_ADDRESS);

const app = express();

const staticFilesPath = path.resolve(__dirname, '..', 'client');

app.get('/client.js', function (req, res) {
  res.send(jsContent);
});

app.use(express.static(staticFilesPath));

app.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`Web UI HTTP server listening on http://localhost:${HTTP_PORT}`);
});
