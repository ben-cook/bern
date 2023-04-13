import { PathLike } from "fs";
import fs from "fs/promises";
import path from "path";

export default async function resolve(id: string) {
  const paths = getPaths(id);
  for (const p of paths) {
    if (await isFile(p)) {
      return p;
    }
  }

  const err = new Error(`Cannot find module ${id}`);
  // @ts-ignore
  err.code = "ENOENT";
  throw err;
}

const getPaths = (id: string) => {
  const i = path.sep === "/" ? id : id.replace(/\//g, path.sep);

  if (i.slice(-3) === ".js") return [i];
  if (i[i.length - 1] === path.sep) return [i + "index.js"];

  return [i + ".js", path.join(i, "index.js")];
};

const isFile = async (p: PathLike) => {
  let stat;
  try {
    stat = await fs.stat(p);
  } catch (err: any) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
  return stat.isFile() || stat.isFIFO();
};
