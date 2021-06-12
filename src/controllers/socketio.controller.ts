import http from "http";
import { Socket, Server } from "socket.io";
import { IFileInput } from "../types/IFileInput";
import { fileManager } from "./fileManager.controller";
import { FileWatcher } from "./fileWatcher.controller";
import { TerminalController } from "./terminal.controller";

export class SocketController {
  socketWorkIt(server: http.Server): void {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    console.log("Socket IO is waiting for client");

    io.on("connection", (socket: Socket) => {
      const terminal = new TerminalController(socket);

      console.log(`Client: ${socket.id} connected`);

      socket.on("disconnect", (reason) => {
        console.log(`Client: ${socket.id} disconnected because of ${reason}`);
      });

      setTimeout(() => {
        socket.on("input", (input: string) => {
          terminal.write(input);
        });
      }, 5000);

      socket.on("fileInput", async (input: string) => {
        const parsedData: IFileInput = JSON.parse(input);
        fileManager(parsedData, socket);
      });

      socket.on("fileWatcherWithContent", async (input: string) => {
        const parsedData: IFileInput = JSON.parse(input);
        fileManager(parsedData, socket);
      });

      const watcher = new FileWatcher(socket);
      watcher.startEmitting();
    });
  }
}
