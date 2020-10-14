const storage = require('./storage');
const enhancedMqtt = require('../utils/enhancedMqtt');

const ONE_HOUR = 1 * 60 * 60 * 1000;

const mqttClient = enhancedMqtt.connect('Core');

mqttClient.on('connect', function () {
  mqttClient.subscribe('client_connected');
  mqttClient.subscribe('request_records');
  mqttClient.subscribe('button_push');
  mqttClient.subscribe('delete_record');
});

mqttClient.on('message', async function (topic, message) {
  if (topic === 'client_connected') {
    const isPillTakenToday = await storage.checkIfPillTakenToday();

    mqttClient.publish('is_pill_taken_today', isPillTakenToday);
  }

  if (topic === 'request_records') {
    const records = await storage.readRecords();

    mqttClient.publish('records', JSON.stringify(records));
  }

  if (topic === 'button_push') {
    await storage.createPillTakeRecord();
    mqttClient.publish('pill_taken');

    const records = await storage.readRecords();
    mqttClient.publish('records', JSON.stringify(records));
  }

  if (topic === 'delete_record') {
    const timestamp = Number(JSON.parse(message));
    const records = await storage.deleteRecord(timestamp);
    mqttClient.publish('records', JSON.stringify(records));

    const isPillTakenToday = await storage.checkIfPillTakenToday();
    mqttClient.publish('is_pill_taken_today', isPillTakenToday);
  }
});

global.setInterval(() => {
  const nowTimestamp = Date.now();
  const nowDate = new Date(nowTimestamp);
  const previousIntervalStartDate = new Date(nowTimestamp - ONE_HOUR);
  const hasNextDayStarted = nowDate.getDate() !== previousIntervalStartDate.getDate();

  if (hasNextDayStarted) {
    console.warn('[Core] New day!');
    mqttClient.publish('is_pill_taken_today', false);
  }
}, ONE_HOUR);
