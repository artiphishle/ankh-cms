import {resolve} from "path";
import {execSync} from 'child_process';
import {cpSync, existsSync, mkdirSync, readFileSync, rmdirSync, rmSync} from "fs";

console.log("Generating app...");

// Get the current directory name
const cmsDir = process.argv[2];
const outDir = process.cwd();
const libDir = resolve(cmsDir,'lib/');
const distDir = resolve(outDir, 'next/');
const publicDir = resolve(distDir, 'public/');
const pagesDir = resolve(distDir, "src/app/(pages)")
const config = JSON.parse(readFileSync(resolve(outDir, "config.json"), "utf8"));

// Clear
console.log("1. Clearing");
if(existsSync(distDir)) rmdirSync(distDir);
mkdirSync(distDir);

console.log("2. Installing");
execSync(`npx create-next-app@latest ${distDir} --ts --app --src-dir --no-eslint --no-import-alias --no-tailwind`, {encoding: 'utf8'});

console.log("3. Patch next.config.mjs");
cpSync(resolve(libDir, "installer/next/templates/next.config.mjs"), resolve(distDir, "next.config.mjs"));

console.log("4. Patch public/");
rmSync(publicDir, {recursive: true, force: true});
mkdirSync(publicDir);

console.log("5. Patch globals.css");
cpSync(resolve(libDir, "installer/next/templates/globals.css"), resolve(distDir, "src/app/globals.css"));

console.log("6. Generate pages");
mkdirSync(pagesDir);
config.pages?.forEach((page: any) => {
  mkdirSync(resolve(pagesDir, page.name));
});

console.log("7. Prettier formatting");
execSync(`prettier --write ${distDir}`);