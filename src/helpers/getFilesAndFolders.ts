import { IFileFolders } from "../types/IFileFolders";
import { promises as fsp } from "fs";

const { readdir, readFile } = fsp;

export const getFilesAndFolders = async (
  path: string,
  fileFolders: IFileFolders[] = [],
  withContent?: boolean
): Promise<IFileFolders[]> => {
  const dirContent = await readdir(path, { withFileTypes: true });

  for await (const element of dirContent) {
    if (element.name.charAt(0) === ".") {
      continue;
    }

    if (element.isFile()) {
      const file: IFileFolders = {
        name: element.name,
        type: "file",
      };

      if (withContent) {
        const content = (await readFile(`${path}${element.name}`)).toString();
        file.content = content;
      }

      fileFolders.push(file);
    }

    if (element.isDirectory()) {
      const directory: IFileFolders = {
        name: element.name,
        type: "directory",
      };

      const details = await getFilesAndFolders(`${path}${element.name}/`, []);

      directory.inside = details;

      fileFolders.push(directory);
    }
  }
  return fileFolders;
};
