#!/usr/bin/env node

import path from "path";
import Server from "../server";

const rawPort = process.argv.at(2) ?? "3000";

const port = parseInt(rawPort);

const dir = path.resolve(".");

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
