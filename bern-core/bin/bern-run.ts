#!/usr/bin/env node

import path from "path";
import Server from "../server";

console.log("running!");
console.log({ argv: process.argv });

const rawPort = process.argv.at(2);
if (!rawPort) {
  console.error("Please provide a port");
  process.exit(1);
}

const port = parseInt(rawPort);

const dir = path.resolve(".");

console.log({ dir });

const srv = new Server({ dir });
srv
  .start(port)
  .then(() => {
    console.log(`> Ready on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
