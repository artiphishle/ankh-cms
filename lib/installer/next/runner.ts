import {resolve} from "path";
import {execSync} from 'child_process';
import {copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmdirSync, rmSync, writeFileSync} from "fs";

console.log("Generating app...");

// Get the current directory name
const cmsDir = process.argv[2];
const outDir = process.cwd();
const libDir = resolve(cmsDir,'lib/');
const distDir = resolve(outDir, 'next/');
const publicDir = resolve(distDir, 'public/');
const pagesDir = resolve(distDir, "src/app/(pages)");
const configFile = resolve(outDir, "config.json");

function generatePage({c, p, t}: {c: string, p: Record<string,string>, t: string}){
  const props = Object.keys(p).map((k: string)=> `${k}="${p[k]}"`);
  const comp = `<${c} ${props.join(" ")}>test: target: ${t}</${c}>`;
  
  return `
    import React from "react";
    import {${c}} from "ankh-ui";

    export default function Page(){
      return (${comp});
    }
  `;
}

if(!existsSync(configFile)) copyFileSync(resolve(libDir, "installer/next/templates/config.json"), configFile);
const config = JSON.parse(readFileSync(configFile, "utf8"));

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

console.log("6. Patch root layout");
cpSync(resolve(libDir, "installer/next/templates/layout.tsx"), resolve(distDir, "src/app/layout.tsx"));

console.log("7. Installing 'ankh-ui'");
execSync(`cd ${distDir} && pnpm i ankh-ui@latest`);

console.log("8. Generate pages");
const demoPage = `
  import React from "react";
  export default function DemoPage(){
    return (<h1>DemoPage</h1>);
  }
`
mkdirSync(pagesDir);
config.pages?.forEach((page: any) => {
  mkdirSync(resolve(pagesDir, page.name));
  const generatedPage = generatePage(page.components[0]);
  writeFileSync(resolve(pagesDir, page.name, "page.tsx" ), generatedPage, {encoding: "utf8"});
});

console.log("9. Prettier formatting");
execSync(`prettier --write ${distDir}`);

console.log("\n\nSuccess!\n\n");
console.log("Run:", "cd next && pnpm run dev");