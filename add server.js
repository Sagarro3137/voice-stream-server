const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

const port = process.env.PORT || 10000;

let broadcaster = null;

app.ws('/', (ws, req) => {
  ws.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.offer && ws) {
      broadcaster = ws;
      broadcaster.offer = data.offer;
    } else if (data.listenerOffer && broadcaster) {
      broadcaster.send(JSON.stringify({ listenerOffer: data.listenerOffer }));
    } else if (data.answer && broadcaster) {
      broadcaster.send(JSON.stringify({ answer: data.answer }));
    } else if (data.ice) {
      broadcaster?.send(JSON.stringify({ ice: data.ice }));
    }
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
