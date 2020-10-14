const mqtt = require('mqtt');

const MQTT_SERVER_IP = 'mqtt://192.168.1.12';

function connect(clientName) {
  const originalClient = mqtt.connect(MQTT_SERVER_IP);

  const enhancedClient = Object.create(originalClient);

  enhancedClient.publish = (topic, message) => {
    const stringifiedMessage = JSON.stringify(message);
    originalClient.publish(topic, stringifiedMessage, console.log(`[${clientName}] MQTT publish:`, { topic, message }));
  };

  enhancedClient.on = (...args) => {
    if (args[0] === 'connect') {
      console.log(`[${clientName}] Connected to MQTT server at:`, MQTT_SERVER_IP);
    }

    if (args[0] === 'message') {
      const [type, originalCallback, ...otherArgs] = args;
      const enhancedCallback = (topic, messageBuffer) => {
        const stringifiedMessage = messageBuffer.toString();

        console.log(`[${clientName}] Received MQTT message:`, { topic, message: stringifiedMessage });

        originalCallback(topic, stringifiedMessage);
      };

      originalClient.on(type, enhancedCallback, ...args);
      return;
    }

    originalClient.on(...args);
  };

  return enhancedClient;
}

module.exports = {
  connect,
};
