#!/usr/bin/env node
export * from "./dist/types.d.ts";
import {execSync} from "child_process";

console.log("Generating app now...");
console.log('argv:');
process.argv.forEach(console.log);
(async ()=> {
  try {
    const res = await execSync("npx ankh-runner");
    console.log(res);
    process.exit(0);
  } catch(e){
    console.log(e);
    process.exit(1)
  }

})();
