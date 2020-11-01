const fs = require('fs');
const path = require('path');
const express = require('express');

// const jsTemplate = fs.readFileSync(path.resolve(__dirname, '../client/build/client.js'), 'utf8');
// const jsContent = jsTemplate.replace('{{WEB_UI_SERVER_ADDRESS}}', process.env.WEB_UI_SERVER_ADDRESS);

module.exports = {
  start: (port) => {
    const app = express();

    const staticFilesPath = path.resolve(__dirname, '..', 'client/build');

    app.get('/client.js', (request, response) => {
      const jsTemplate = fs.readFileSync(path.resolve(__dirname, '../client/build/client.js'), 'utf8');
      const jsContent = jsTemplate.replace('{{WEB_UI_SERVER_ADDRESS}}', process.env.WEB_UI_SERVER_ADDRESS);

      response.send(jsContent);
    });

    app.use(express.static(staticFilesPath));

    app.listen(port, '0.0.0.0', () => {
      console.log(`Web UI HTTP server listening on http://localhost:${port}`);
    });
  },
};
