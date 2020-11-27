const WebSocket = require('ws');

const enhancedMqtt = require('../../utils/enhancedMqtt');
const httpServer = require('./httpServer');

const mqttClient = enhancedMqtt.connect('Web UI server');

const HTTP_PORT = 3010;
const WS_PORT = 3011;

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`Web UI WS server listening on http://${process.env.WEB_UI_SERVER_ADDRESS}:${WS_PORT}`);
});

mqttClient.on('connect', () => {
  mqttClient.subscribe('is_pill_taken_today');
  mqttClient.subscribe('records');
  mqttClient.subscribe('pills_left');
  mqttClient.subscribe('pill_taken');
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'is_pill_taken_today') {
    const isPillTakenToday = JSON.parse(message);

    wsServer.clients.forEach((socket) => {
      socket.send(JSON.stringify({ type: 'is_pill_taken_today', payload: isPillTakenToday }));
    });
  }

  if (topic === 'records') {
    wsServer.clients.forEach((socket) => {
      socket.send(JSON.stringify({ type: 'records', payload: JSON.parse(message) }));
    });
  }

  if (topic === 'pills_left') {
    wsServer.clients.forEach((socket) => {
      socket.send(JSON.stringify({ type: 'pills_left', payload: JSON.parse(message) }));
    });
  }

  if (topic === 'pill_taken') {
    wsServer.clients.forEach((socket) => {
      socket.send(JSON.stringify({ type: 'pill_taken' }));
    });
  }
});

mqttClient.on('error', (error) => {
  console.error('[Web UI server] MQTT error occurred');
  console.error(error);
});

wsServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'button_push') {
      mqttClient.publish('button_push');
    }

    if (parsedMessage.type === 'delete_record') {
      mqttClient.publish('delete_record', parsedMessage.payload);
    }

    if (parsedMessage.type === 'update_record') {
      mqttClient.publish('update_record', parsedMessage.payload);
    }
  });

  mqttClient.publish('client_connected');
  mqttClient.publish('request_records');
});

httpServer.start(HTTP_PORT);
