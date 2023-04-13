#!/usr/bin/env node

import path from "path";
import { spawn } from "cross-spawn";

const commands = new Set(["build", "run"]);

if (process.argv.length < 3) {
  console.error(
    `Please provid at least 1 command. Available commands: build, run`
  );
  process.exit(1);
}

let cmd = process.argv[2];
let args;

if (commands.has(cmd)) {
  args = process.argv.slice(3);
} else {
  console.error(`Unrecognized command '${cmd}'`);
  process.exit(1);
}

const bin = path.join(__dirname, `bern-${cmd}.js`);

try {
  const proc = spawn(bin, args, { stdio: "inherit" });
  proc.on("close", (code: number) => process.exit(code));
  proc.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
} catch (err: unknown) {
  // @ts-ignore
  if (err.code === "EACCES") {
    console.error("Permission denied.");
    console.error(err);
    process.exit(1);
  }
}
