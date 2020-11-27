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
    {
      measurement: 'pills_left',
      fields: {
        count: Influx.FieldType.INTEGER,
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

async function readPillsLeft() {
  try {
    const pillsLeftList = await influxClient.query(`SELECT * FROM pills_left`);

    return pillsLeftList.reduce(
      (pillsLeft, pill) => ({
        ...pillsLeft,
        [pill.pill_name]: pill.count,
      }),
      {}
    );
  } catch (error) {
    console.error(`Failed to read "pills left" from the database`);
    console.error(error);
  }
}

async function updatePillsLeft(pillName, change) {
  const pillsLeftForAllPills = await readPillsLeft();
  const count = pillsLeftForAllPills[pillName];

  await setPillsLeft(pillName, count + change);
}

async function setPillsLeft(pillName, count) {
  await deletePillsLeft(pillName);
  await createPillsLeft(pillName, count);
}

async function decreasePillsLeft(pillName) {
  await updatePillsLeft(pillName, -1);
}

async function increasePillsLeft(pillName) {
  await updatePillsLeft(pillName, 1);
}

async function createPillsLeft(pillName, count) {
  try {
    const point = {
      measurement: 'pills_left',
      fields: {
        count,
      },
      tags: { pill_name: pillName },
      timestamp: 1,
    };

    return influxClient.writePoints([point]);
  } catch (error) {
    console.error('Database error. Failed to create a "pills left" record');
    console.error(error);
  }
}

async function deletePillsLeft(pillName) {
  const deletePillsLeftQuery = `DROP SERIES FROM pills_left WHERE pill_name='${pillName}'`;

  await influxClient.query(deletePillsLeftQuery);
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
  readPillsLeft,
  decreasePillsLeft,
  increasePillsLeft,
  setPillsLeft,
};
