#!/usr/bin/env node

// export * from "./dist/types.d.ts";
import {dirname, resolve} from "path";
import {spawn} from "child_process";
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Generating app now...");

const child = spawn("node", [resolve(__dirname, "dist/installer/next/runner.js"), __dirname], {stdio: "inherit"});

child.on("close", (code) => console.log(`Script finished with code: ${code}`))