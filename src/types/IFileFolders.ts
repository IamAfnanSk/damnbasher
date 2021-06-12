export interface IFileFolders {
  name: string;
  type: "directory" | "file";
  inside?: IFileFolders[];
  content?: string;
}
