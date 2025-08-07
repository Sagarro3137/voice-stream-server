// ✅ Final working server.js
const WebSocket = require("ws");
const http = require("http");
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let listeners = [];

wss.on("connection", (ws) => {
  console.log("🔗 New connection");

  ws.on("message", (message) => {
    // If broadcaster sending audio
    listeners.forEach(listener => {
      if (listener.readyState === WebSocket.OPEN) {
        listener.send(message);
      }
    });
  });

  ws.on("close", () => {
    listeners = listeners.filter(l => l !== ws);
    console.log("❌ Disconnected");
  });

  // Add to listener list
  listeners.push(ws);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
