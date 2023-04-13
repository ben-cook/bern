import { resolve } from "path";
import fs from "fs/promises";
import { BUILD_DIR } from ".";

/** Clean the build folder */
export const clean = (dir: string) => {
  const buildDir = resolve(dir, BUILD_DIR);
  return fs.rm(buildDir, { recursive: true, force: true });
};
