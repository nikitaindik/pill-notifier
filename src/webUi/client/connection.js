function connect(onMessage) {
  return new Promise((resolve) => {
    const socket = new WebSocket('ws://{{WEB_UI_SERVER_ADDRESS}}:3011');

    socket.addEventListener('message', (event) => {
      console.log('Received message', event.data);

      const parsedMessage = JSON.parse(event.data);
      onMessage(parsedMessage);
    });

    socket.addEventListener('open', () => {
      resolve(socket);
    });
  });
}

async function createConnection(onMessage) {
  const socket = await connect(onMessage);

  function addRecord() {
    const stringified = JSON.stringify({ type: 'button_push' });
    socket.send(stringified);
  }

  function deleteRecord(timestamp) {
    const stringified = JSON.stringify({ type: 'delete_record', payload: timestamp });
    socket.send(stringified);
  }

  function updateRecord(record) {
    const formattedRecord = {
      ...record,
      notes: record.notes || null,
    };

    const stringified = JSON.stringify({ type: 'update_record', payload: formattedRecord });
    socket.send(stringified);
  }

  function updatePillsLeft(count) {
    const stringified = JSON.stringify({ type: 'update_pills_left', payload: count });
    socket.send(stringified);
  }

  return {
    addRecord,
    deleteRecord,
    updateRecord,
    updatePillsLeft,
  };
}

export default createConnection;
