const WebSocket = require("ws");

const PORT = 3000;

const wss = new WebSocket.Server({ port: PORT });

const sendMessage = (client, message) => {
   console.log(message);

   if (client.readyState === WebSocket.OPEN) {
     client.send(JSON.stringify(message));
   }
 };

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    wss.clients.forEach(client => {
      sendMessage(client, `Received: ${message}`);
    });
  });

  ws.on("error", (error) => {
    console.error("Error", error);
  });

  ws.on("close", () => {
    sendMessage(ws, "Client disconnected");
  });

  console.log('Number of players', wss.clients.size);
  // on "OPEN"
  sendMessage(ws, {
    number: wss.clients.size,
  });
});

console.log(`WebSocket server listening on port ${PORT}`);
