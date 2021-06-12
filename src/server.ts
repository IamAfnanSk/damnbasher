import http from "http";
import { SocketController } from "./controllers/socketio.controller";

const server: http.Server = http.createServer((req, res): void => {
  res.write("ok");
  res.end();
});

const PORT: number = parseInt(process.env.PORT || "") || 1337;

server.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT} ✨`);

  const socketController = new SocketController();
  try {
    socketController.socketWorkIt(server);
  } catch (error) {
    console.log("😖 Again a crash");
  }
});
