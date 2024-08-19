const WebSocket = require("ws");

const PORT = 3000;
const gameBoard = [];

const wss = new WebSocket.Server({ port: PORT });

const sendMessage = (client, message) => {
   console.log(message);

   if (client.readyState === WebSocket.OPEN) {
     client.send(JSON.stringify(message));
   }
 };

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    gameBoard = message;
    wss.clients.forEach(client => {
      sendMessage(client, JSON.parse(message));
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
    size: wss.clients.size,
    board: gameBoard,
  });
});

console.log(`WebSocket server listening on port ${PORT}`);
