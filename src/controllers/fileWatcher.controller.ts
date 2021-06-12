import chokidar, { FSWatcher } from "chokidar";
import { Socket } from "socket.io";
import { basicConstants } from "../constants/basic";
import { getFilesAndFolders } from "../helpers/getFilesAndFolders";

const basePath = basicConstants.basePath;

export class FileWatcher {
  watcher: FSWatcher = chokidar.watch(basePath, {
    depth: 2,
    ignoreInitial: true,
    ignored: /^\/?(?:\w+\/)*(\.\w+)/,
  });
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  startEmitting() {
    this.watcher.on("all", async (event, path, stats) => {
      const filesAndFolders = await getFilesAndFolders(`${basePath}/`);
      this.socket.emit(
        "fileWatcher",
        JSON.stringify({ filesAndFolders, status: "success" })
      );
    });

    this.socket.on("disconnect", () => {
      this.watcher.unwatch(basePath);
    });
  }
}
