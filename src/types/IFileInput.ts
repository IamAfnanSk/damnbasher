export interface IFileInput {
  name: string;
  content?: string;
  request: "update" | "delete" | "touch" | "ls" | "lswithcontent";
}
