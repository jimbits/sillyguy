import { join } from "node:path";

export async function getHTMLFile(getFile: string) {
  const root = process.cwd();
  const filePath = join(root, getFile);
  return await Bun.file(filePath).text();
}
