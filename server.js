const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket connection');
  clients.add(ws);

  ws.on('message', (data) => {
    // Send to all others
    for (let client of clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(data);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('❌ WebSocket disconnected');
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
