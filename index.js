#!/usr/bin/env node

// export * from "./dist/types.d.ts";
import {dirname, resolve} from "path";
import {exec} from "child_process";
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Generating app now...");

exec(`node ${resolve(__dirname, "dist/installer/next/runner.js")} ${__dirname}`, (error, stdout, stderr) => {
  if(error) return console.error(`Error output: ${stderr}`);
  console.log(`Script output: ${stdout}`);
});
