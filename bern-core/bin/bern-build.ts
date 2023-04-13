#!/usr/bin/env node

import path from "path";
import { build } from "../server/build";

const dir = path.resolve(".");

build(dir)
  .then((stats) => {
    const compilationTime = (
      (stats?.endTime - stats?.startTime) /
      1000
    ).toFixed(2);
    console.info(`Built successfully in ${compilationTime}s`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
