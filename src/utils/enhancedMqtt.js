const mqtt = require('mqtt');

const MQTT_BROKER_URL = 'mqtt://' + process.env.MQTT_BROKER_ADDRESS;

function connect(clientName) {
  const originalClient = mqtt.connect(MQTT_BROKER_URL);

  const enhancedClient = Object.create(originalClient);

  enhancedClient.publish = (topic, message) => {
    const stringifiedMessage = JSON.stringify(message);

    originalClient.publish(topic, stringifiedMessage, () => {
      console.log(`[${clientName}] MQTT publish:`, { topic, message });
    });
  };

  enhancedClient.on = (...args) => {
    if (args[0] === 'connect') {
      const [type, originalOnConnect, ...otherArgs] = args;
      const enhancedOnConnect = (connack) => {
        console.log(`[${clientName}] Connected to MQTT broker at:`, MQTT_BROKER_URL);

        originalOnConnect(connack);
      };

      originalClient.on(type, enhancedOnConnect, ...otherArgs);
      return;
    }

    if (args[0] === 'message') {
      const [type, originalOnMessage, ...otherArgs] = args;
      const enhancedOnMessage = (topic, messageBuffer) => {
        const stringifiedMessage = messageBuffer.toString();

        console.log(`[${clientName}] Received MQTT message:`, { topic, message: stringifiedMessage });

        originalOnMessage(topic, stringifiedMessage);
      };

      originalClient.on(type, enhancedOnMessage, ...otherArgs);
      return;
    }

    if (args[0] === 'error') {
      const [type, originalOnError, ...otherArgs] = args;

      const enhancedOnError = (error) => {
        console.error(
          `[${clientName}] MQTT error! process.env.MQTT_BROKER_ADDRESS = ${process.env.MQTT_BROKER_ADDRESS}`
        );

        originalOnError(error);
      };

      originalClient.on(type, enhancedOnError, ...otherArgs);
    }

    originalClient.on(...args);
  };

  return enhancedClient;
}

module.exports = {
  connect,
};
