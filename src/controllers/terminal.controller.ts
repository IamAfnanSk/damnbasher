import os from "os";
import * as terminalPTY from "node-pty";
import { Socket } from "socket.io";
import { basicConstants } from "../constants/basic";

export class TerminalController {
  shell: string = os.platform() === "win32" ? "powershell.exe" : "bash";
  terminalPTYProcess: terminalPTY.IPty;
  socket: Socket;
  word: string = "";

  constructor(socket: Socket) {
    this.socket = socket;
    this.terminalPTYProcess = terminalPTY.spawn(this.shell, [], {
      name: "xterm-color",
      cwd: process.env.HOME,
      // @ts-ignore
      env: process.env,
    });

    this.startPtyProcess();
  }

  startPtyProcess() {
    this.write("clear\r");
    this.write("su damner\r");
    this.write(`cd ${basicConstants.basePath}\r`);
    this.write("clear\r");

    this.sendCodedamnLogo();

    setTimeout(() => {
      this.write("\r");
      this.terminalPTYProcess.onData((data) => {
        this.sendToClient(data);
      });
    }, 5000);

    this.socket.on("disconnect", () => {
      this.write("\u0003\r");
      this.terminalPTYProcess.kill();
    });
  }

  write(data: string) {
    if (
      data === "\r" ||
      data === " " ||
      data === "" ||
      data === "\n" ||
      data === "\b" ||
      data === "\t"
    ) {
      this.word = "";
    } else {
      this.word += data;
    }

    if (this.terminalPTYProcess) {
      if (!this.word.includes("exit")) {
        this.terminalPTYProcess.write(data);
      } else {
        this.terminalPTYProcess.write("\nclear\r");
        this.terminalPTYProcess.write("'Exit dont work here'\r");
        this.word = "";
      }
    }
  }

  sendToClient(data: string) {
    this.socket.emit("output", data);
  }

  sendCodedamnLogo() {
    this.sendToClient(`\r\x1b[1;36m
                      WWW\r
                    WW   WW\r
                    WW   WW\r
                     WW WW\r
              \r
              VWW     WWWWW   WWV\r
            WWW     WW          WWW\r
          WWW       WW            WWW\r
            WWW     WWV         WWW\r
              WWW     WWWWW   WWW\r
              \r
                      WWW\r
                     WW WW\r
                    WW  WW\r
                    WW   WW\r
                   WW    WW\r
                   WW     WW\r
                    \r
          Completly interactive terminal\r\x1b[00m`);

    this.sendToClient("\n");
    this.sendToClient(
      "\x1b[1;32m⦿ ✨  Awesome terminal is loading please wait.....\x1b[00m"
    );
  }
}
