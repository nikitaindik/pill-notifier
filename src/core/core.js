const storage = require('./storage');
const enhancedMqtt = require('../utils/enhancedMqtt');

const ONE_HOUR = 1 * 60 * 60 * 1000;

const mqttClient = enhancedMqtt.connect('Core');

mqttClient.on('connect', () => {
  mqttClient.subscribe('client_connected');
  mqttClient.subscribe('request_records');
  mqttClient.subscribe('button_push');
  mqttClient.subscribe('update_record');
  mqttClient.subscribe('delete_record');
});

mqttClient.on('message', async (topic, message) => {
  if (topic === 'client_connected') {
    const isPillTakenToday = await storage.checkIfPillTakenToday();

    mqttClient.publish('is_pill_taken_today', isPillTakenToday);
    return;
  }

  if (topic === 'request_records') {
    const records = await storage.readRecords();
    mqttClient.publish('records', records);

    const pillsLeft = await storage.readPillsLeft();
    mqttClient.publish('pills_left', pillsLeft);
    return;
  }

  if (topic === 'button_push') {
    await storage.createPillTakeRecord({
      pillName: process.env.PILL_NAME,
      milligrams: 400,
    });
    mqttClient.publish('pill_taken');

    const records = await storage.readRecords();
    mqttClient.publish('records', records);

    await storage.decreasePillsLeft(process.env.PILL_NAME);

    const pillsLeft = await storage.readPillsLeft();
    mqttClient.publish('pills_left', pillsLeft);
    return;
  }

  if (topic === 'update_record') {
    const { originalTimestamp, updatedTimestamp, notes } = JSON.parse(message);

    await storage.deleteRecord(originalTimestamp);

    await storage.createPillTakeRecord({
      timestamp: updatedTimestamp,
      pillName: process.env.PILL_NAME,
      milligrams: 400,
      notes,
    });

    const records = await storage.readRecords();
    mqttClient.publish('records', records);

    const isPillTakenToday = await storage.checkIfPillTakenToday();
    mqttClient.publish('is_pill_taken_today', isPillTakenToday);

    return;
  }

  if (topic === 'delete_record') {
    const timestamp = Number(JSON.parse(message));
    await storage.deleteRecord(timestamp);

    const records = await storage.readRecords();
    mqttClient.publish('records', records);

    const isPillTakenToday = await storage.checkIfPillTakenToday();
    mqttClient.publish('is_pill_taken_today', isPillTakenToday);

    await storage.increasePillsLeft(process.env.PILL_NAME);

    const pillsLeft = await storage.readPillsLeft();
    mqttClient.publish('pills_left', pillsLeft);
    return;
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
