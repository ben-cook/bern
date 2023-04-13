#!/usr/bin/env node

import path from "path";
import { build } from "../server/build";

console.log("building!");
console.log({ argv: process.argv });

const dir = path.resolve(".");

console.log({ dir });

build(dir)
  .then(() => console.info("Build successful"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
