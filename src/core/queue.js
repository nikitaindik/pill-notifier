function makeQueue() {
  let _queue = [];
  let _isRunning = false;

  function addItem(item) {
    _queue.push(item);

    if (!_isRunning) {
      processQueue();
    }
  }

  async function processQueue() {
    _isRunning = true;

    while (_queue.length) {
      const itemToProcess = _queue.shift();
      await itemToProcess();
    }

    _isRunning = false;
  }

  return {
    addItem,
  };
}

module.exports = makeQueue;
