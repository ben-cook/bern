import fs from "fs/promises";
import { resolve } from "path";
import { BUILD_DIR } from "../constants";

/** Clean the build folder */
export const clean = (dir: string) => {
  const buildDir = resolve(dir, BUILD_DIR);
  return fs.rm(buildDir, { recursive: true, force: true });
};
