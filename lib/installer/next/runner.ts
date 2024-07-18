import {resolve} from "path";
import {execSync} from 'child_process';
import {copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from "fs";
import { IAnkhCmsConfig } from "../../types";

console.log("Generating app...");

// Get the current directory name
const cmsDir = process.argv[2]!;
const outDir = process.cwd();
const libDir = resolve(cmsDir,'../lib/');
const tplDir = resolve(libDir, "templates/")
const distDir = resolve(outDir, 'next/');
const publicDir = resolve(distDir, 'public/');
const pagesDir = resolve(distDir, "src/app/(pages)/");
const configFile = resolve(outDir, "config.json");

interface IPage {
  components: IUi[];
  name: string;
}

interface IUi {
  ui: string;
  p: Record<string, string|number>,
  uis?: IUi[];
}
function genUi({ui, p, uis}: IUi){
  const props = Object.keys(p).map((k: string)=> `${k}="${p[k]}"`);
  const subUis = uis?.map((subUi, i)=> genUi({ui: subUi.ui, p: subUi.p }))
  const subbies = subUis ? subUis?.join("\n") : [];
  const comp: string = !subbies?.length ? `<${ui} ${props.join(" ")} />` : `<${ui} ${props.join(" ")}>${subbies}</${ui}>`;
  return comp;
}

function generatePage({name, components}: IPage){
  const ui = genUi(components[0]!);

  return `import {Grid, Html} from "ankh-ui";
    export default function Page(){
      return (${ui});}`;
}

// Read config or set a default one
if(!existsSync(configFile)) copyFileSync(resolve(tplDir,"config.json"), configFile);
const config: IAnkhCmsConfig = JSON.parse(readFileSync(configFile, "utf8"));


/** 1. Prepare 6 Install Next.js */
console.log("Preparing & Installing Next.js...");

if(existsSync(distDir)) rmSync(distDir, {recursive: true, force: true});
mkdirSync(distDir);
console.log("✅ Cleared target dir");

execSync(`pnpm dlx create-next-app@latest ${distDir} --ts --app --src-dir --no-eslint --no-import-alias --no-tailwind`, {encoding: 'utf8'});
console.log("✅ Next.js app installed");

/** 2. Patch files */
console.log("Patching files...");

cpSync(resolve(tplDir, "next.config.mjs"), resolve(distDir, "next.config.mjs"));
console.log("✅ Add redirect /home ot next.config.mjs");

rmSync(publicDir, {recursive: true, force: true});
mkdirSync(publicDir);
console.log("✅ emptied public/ directory");

cpSync(resolve(tplDir, "globals.css"), resolve(distDir, "src/app/globals.css"));
console.log("✅ Default globals.css");

cpSync(resolve(tplDir, "layout.tsx"), resolve(distDir, "src/app/layout.tsx"));
console.log("✅ Add RootLayout");

/*
console.log("3. Installing 'ankh-ui'");
const child = spawn("pnpm", ["install", "ankh-ui"], { cwd: distDir, stdio: "inherit"});
child.on("error", console.log);
child.on("message", console.log);
child.on("close", console.log);
*/

/** 3. Generate pages */
console.log("Generating pages...");

mkdirSync(pagesDir);
config.pages?.forEach((page: any) => {
  mkdirSync(resolve(pagesDir, page.name));
  const generatedPage = generatePage(page);
  writeFileSync(resolve(pagesDir, page.name, "page.tsx" ), generatedPage, {encoding: "utf8"});
});

/** 4. Formatting source files (prettier) */
execSync(`prettier --write ${distDir}`);
console.log("✅ Formatted source files (Prettier)");

console.log("\n\nDONE! Now run 'cd next && pnpm install ankh-ui@latest && pnpm run dev'");