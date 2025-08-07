const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static("public")); // if needed for frontend hosting

let broadcaster = null;

wss.on("connection", (ws) => {
  console.log("🔌 New client connected");

  ws.on("message", (message) => {
    if (message.toString() === "broadcaster") {
      console.log("🎙️ Mic broadcaster connected");
      broadcaster = ws;
    } else {
      // forward to all except sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    if (ws === broadcaster) {
      console.log("🎤 Mic broadcaster disconnected");
      broadcaster = null;
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Voice stream server running on port ${PORT}`);
});
