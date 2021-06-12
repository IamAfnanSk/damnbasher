import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { basicConstants } from "../constants/basic";
import { IFileInput } from "../types/IFileInput";

import { promises as fsp } from "fs";
import { getFilesAndFolders } from "../helpers/getFilesAndFolders";

const { rename, unlink, appendFile } = fsp;

const tempPath = basicConstants.tempPath;
const basePath = basicConstants.basePath;

const updateFile = async (name: string, content: string) => {
  const uuid = uuidv4();

  await appendFile(`${tempPath}/${uuid}`, content);
  await rename(`${tempPath}/${uuid}`, `${basePath}/${name}`);
};

const deleteFile = async (name: string) => {
  await unlink(`${basePath}/${name}`);
};

const touchFile = async (name: string) => {
  await appendFile(`${basePath}/${name}`, "");
};

const ls = async (withContent?: boolean) => {
  const filesAndFolders = await getFilesAndFolders(
    `${basePath}/`,
    [],
    withContent
  );
  return filesAndFolders;
};

export const fileManager = async (parsedData: IFileInput, socket: Socket) => {
  const { name, content, request } = parsedData;

  if (request === "ls") {
    try {
      const filesAndFolders = await ls();
      socket.emit(
        "fileOutput",
        JSON.stringify({ filesAndFolders, status: "success" })
      );
    } catch (error) {
      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "lswithcontent") {
    try {
      const filesAndFolders = await ls(true);
      socket.emit(
        "fileOutputWithContent",
        JSON.stringify({ filesAndFolders, status: "success" })
      );
    } catch (error) {
      socket.emit("fileOutputWithContent", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "update" && content) {
    try {
      await updateFile(name, content);
      socket.emit("fileOutput", JSON.stringify({ status: "success" }));
    } catch (error) {
      console.log(error);

      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "delete") {
    try {
      await deleteFile(name);
      socket.emit("fileOutput", JSON.stringify({ status: "success" }));
    } catch (error) {
      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "touch") {
    try {
      await touchFile(name);
      socket.emit("fileOutput", JSON.stringify({ status: "success" }));
    } catch (error) {
      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }
};
