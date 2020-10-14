const fs = require('fs');

function createPillTakeRecord() {
  return new Promise((resolve) => {
    const record = makeRecord();
    const stringifiedRecord = JSON.stringify(record);

    fs.appendFile('db.csv', `${stringifiedRecord},\n`, (error) => {
      if (error) {
        throw error;
      }

      resolve();
    });
  });
}

async function deleteRecord(timestamp) {
  const records = await readRecords();

  const updatedRecords = records.filter((record) => record.timestamp !== timestamp);

  await writeAllRecords(updatedRecords);

  return updatedRecords;
}

function writeAllRecords(records) {
  let fileContent = records.map((record) => JSON.stringify(record)).join(',\n');

  if (fileContent) {
    fileContent += ',\n';
  }

  return new Promise((resolve) => {
    fs.writeFile('db.csv', fileContent, 'utf8', () => {
      resolve();
    });
  });
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

function readRecords() {
  return new Promise((resolve) => {
    fs.readFile('db.csv', 'utf8', (error, fileContent) => {
      if (error) {
        throw error;
      }

      const fileContentWithoutLastComma = fileContent.trim().slice(0, -1);
      const records = JSON.parse(`[${fileContentWithoutLastComma}]`);

      resolve(records);
    });
  });
}

function getDayStartTimestamp() {
  const date = new Date();
  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);

  return date.getTime();
}

function makeRecord(description) {
  return {
    timestamp: Date.now(),
    description: description || '',
  };
}

module.exports = {
  readRecords,
  deleteRecord,
  createPillTakeRecord,
  checkIfPillTakenToday,
};
