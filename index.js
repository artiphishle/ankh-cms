#!/usr/bin/env node
// export * from "./dist/types.d.ts";
import {execSynt} from "child_process";

console.log("Generating app now...");
console.log('argv:');
process.argv.forEach(console.log);
execSync(npx ankh-runner);
