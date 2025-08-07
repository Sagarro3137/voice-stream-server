const express = require('express');
const expressWS = require('express-ws');

const app = express();
expressWS(app);

const port = process.env.PORT || 10000;

let broadcaster = null;

app.ws('/signal', (ws, req) => {
    ws.on('message', message => {
        const data = JSON.parse(message);

        if (data.type === 'broadcaster') {
            broadcaster = ws;
        } else if (data.type === 'listener' && broadcaster) {
            broadcaster.send(JSON.stringify({ type: 'listener' }));
        } else if (data.type === 'offer' && broadcaster) {
            broadcaster.send(JSON.stringify({
                type: 'offer',
                sdp: data.sdp,
                from: ws
            }));
        } else if (data.type === 'answer' && broadcaster) {
            broadcaster.send(JSON.stringify({
                type: 'answer',
                sdp: data.sdp,
                from: ws
            }));
        } else if (data.type === 'ice-candidate' && broadcaster) {
            broadcaster.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: data.candidate,
                from: ws
            }));
        }
    });

    ws.on('close', () => {
        if (ws === broadcaster) {
            broadcaster = null;
        }
    });
});

app.listen(port, () => {
    console.log(`WebSocket signaling server running on port ${port}`);
});
