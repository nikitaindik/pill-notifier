const Influx = require('influx');

const influxClient = new Influx.InfluxDB({
  host: process.env.DB_ADDRESS,
  database: 'pill_notifier_database',
  schema: [
    {
      measurement: 'pill_takes',
      fields: {
        milligrams: Influx.FieldType.INTEGER,
        notes: Influx.FieldType.STRING,
      },
      tags: ['pill_name'],
    },
  ],
});

console.log('[Core] Connected to InfluxDB at:', process.env.DB_ADDRESS);

function createPillTakeRecord({ timestamp, pillName, milligrams, notes }) {
  const point = {
    measurement: 'pill_takes',
    fields: {
      milligrams,
      notes,
    },
    tags: { pill_name: pillName },
  };

  if (timestamp) {
    point.timestamp = timestamp;
  }

  return influxClient.writePoints([point], { precision: 'ms' });
}

async function deleteRecord(timestamp) {
  const timeFrom = millisecondTimestampToNanosecond(timestamp - 1);
  const timeTo = millisecondTimestampToNanosecond(timestamp + 1);

  const deleteRecordQuery = `DELETE FROM pill_takes WHERE time >= ${timeFrom} AND time <= ${timeTo}`;

  return influxClient.query(deleteRecordQuery, { precision: 'ms' });
}

async function checkIfPillTakenToday() {
  const records = await readRecords();

  if (!records.length) {
    return false;
  }

  const lastRecord = records[records.length - 1];
  const isPillTakenToday = getDayStartTimestamp() <= lastRecord.timestamp;

  return isPillTakenToday;
}

async function readRecords() {
  try {
    const rawRecords = await influxClient.query(`SELECT * FROM pill_takes`, { precision: 'ms' });

    const recordsWithUnixTimestamp = rawRecords.map((record) => ({
      timestamp: record.time.getTime(),
      pillName: record.pill_name,
      milligrams: record.milligrams,
      notes: record.notes,
    }));

    return recordsWithUnixTimestamp;
  } catch (error) {
    console.error(`Failed to read records from the database`);
    console.error(error);
  }
}

function getDayStartTimestamp() {
  const date = new Date();
  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);

  return date.getTime();
}

function millisecondTimestampToNanosecond(timestamp) {
  return timestamp.toString() + '000000';
}

module.exports = {
  readRecords,
  deleteRecord,
  createPillTakeRecord,
  checkIfPillTakenToday,
};
