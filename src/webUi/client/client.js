const ledElement = document.querySelector('.led');
const buttonElement = document.querySelector('button');
const recordsContainerElement = document.querySelector('.records-container');

const socket = new WebSocket('ws://{{WEB_UI_SERVER_ADDRESS}}:3011');

socket.addEventListener('message', function (event) {
  const parsedMessage = JSON.parse(event.data);

  if (parsedMessage.type === 'isPillTakenToday') {
    if (parsedMessage.payload) {
      ledElement.classList.add('led--off');
      ledElement.classList.remove('led--on');
    } else {
      ledElement.classList.add('led--on');
      ledElement.classList.remove('led--off');
    }
  }

  if (parsedMessage.type === 'pillTaken') {
    ledElement.classList.add('led--off');
    ledElement.classList.remove('led--on');
  }

  if (parsedMessage.type === 'records') {
    const records = JSON.parse(parsedMessage.payload);

    const recordsHtml = records
      .map((record) => {
        const date = new Date(record.timestamp);
        const formattedTimestamp = `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString()}`;

        return `
        <div class="record">
            <div>${formattedTimestamp}</div>
            <div>${record.description}</div>
            <button data-timestamp="${record.timestamp}">Delete</div>
        </div>
    `;
      })
      .join('');

    console.log(recordsHtml);

    recordsContainerElement.innerHTML = recordsHtml;
  }
});

buttonElement.addEventListener('click', () => {
  socket.send(JSON.stringify({ type: 'buttonPush' }));
});

recordsContainerElement.addEventListener('click', (event) => {
  const timestamp = event.target.dataset.timestamp;

  if (timestamp) {
    socket.send(JSON.stringify({ type: 'deleteRecord', payload: timestamp }));
  }
});
