const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let listeners = [];

wss.on("connection", (ws) => {
  ws.isAlive = true;

  // For keep-alive check
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // First message determines role
  ws.once("message", (message) => {
    const type = message.toString();

    if (type === "listener") {
      listeners.push(ws);
    } else {
      // Broadcaster sending audio
      ws.on("message", (audioChunk) => {
        listeners.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(audioChunk);
          }
        });
      });
    }
  });

  ws.on("close", () => {
    listeners = listeners.filter((client) => client !== ws);
  });
});

// Health check for open connections (every 30s)
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

app.get("/", (req, res) => {
  res.send("🔊 Voice Stream Server is Running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Voice Server running on port ${PORT}`);
});
