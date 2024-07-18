import {basename, resolve} from "path";
import {execSync, spawn, spawnSync} from 'child_process';
import {copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from "fs";
import { IAnkhCmsConfig, IAnkhPage, IAnkhUi } from "../../types";
import { convertArrayToCss } from "ankh-css";

const cmsDir = process.argv[2]!;
const outDir = process.cwd();
const libDir = resolve(cmsDir,'../lib/');
const tplDir = resolve(libDir, "templates/")
const distDir = resolve(outDir, 'next/');
const publicDir = resolve(distDir, 'public/');
const pagesDir = resolve(distDir, "src/app/(pages)/");
const configFile = resolve(outDir, "config.json");

function genUi({ui, p, uis}: IAnkhUi){
  const props = Object.keys(p).map((k: string)=> `${k}="${p[k]}"`);
  const subUis = uis?.map((subUi, i)=> genUi({ui: subUi.ui, p: subUi.p }))
  const subbies = subUis ? subUis?.join("\n") : [];
  const comp: string = !subbies?.length ? `<${ui} ${props.join(" ")} />` : `<${ui} ${props.join(" ")}>${subbies}</${ui}>`;
  return comp;
}
function getRecursiveImports({ui, uis}: IAnkhUi, result: string[]){
  if(!result.includes(ui)) result.push(ui);
  uis?.forEach((subUi) => getRecursiveImports(subUi, result));
  
  return result;
}
function generatePage({name, uis}: IAnkhPage){
  /** @todo Only one at root level ATM */
  const rootUi = uis[0];
  const imports = rootUi ? getRecursiveImports(rootUi, []) : [];

  const imp = imports.length ? `import {${imports.join(",")}} from "ankh-ui";` : "";
  const ret = `return (${rootUi ? genUi(rootUi) : null});`;
  
  return `${imp}\n\n/** Page: /${name} */\nexport default function Page(){\n${ret}}`;
}

// Read config or set a default one
if(!existsSync(configFile)) copyFileSync(resolve(tplDir,"config.json"), configFile);
const config: IAnkhCmsConfig = JSON.parse(readFileSync(configFile, "utf8"));

// Prepare 6 Install Next.js */
console.log("Preparing & Installing Next.js...");

// Clear app directory if exists */
if(existsSync(distDir)) rmSync(distDir, {recursive: true, force: true});
mkdirSync(distDir);

// Next.js install
execSync(`pnpm dlx create-next-app@latest ${distDir} --ts --app --src-dir --no-eslint --no-import-alias --no-tailwind`, {encoding: 'utf8'});

// Add redirection to /home to next.config.mjs
cpSync(resolve(tplDir, "next.config.mjs"), resolve(distDir, "next.config.mjs"));

// Empty public/ directory
rmSync(publicDir, {recursive: true, force: true});
mkdirSync(publicDir);

// Add root layout
cpSync(resolve(tplDir, "layout.tsx"), resolve(distDir, "src/app/layout.tsx"));

console.log("✅ Next.js app installed & configured");


// Add static files from config to public/
config.public?.forEach(({name, files})=> {
  mkdirSync(resolve(publicDir,name));
  files.forEach((filename:string)=> cpSync(filename, resolve(publicDir, name, basename(filename))))
});

// Write CSS to globals.css
async function addStyles() {
  if(!config.styles) return;

  const style = await convertArrayToCss(config.styles)
  const css = readFileSync(resolve(tplDir, "globals.css"), "utf8");
  writeFileSync(resolve(distDir, "src/app/globals.css"), `${css}\n\n${style}`)
// cpSync(resolve(tplDir, "globals.css"), resolve(distDir, "src/app/globals.css"));
}
addStyles();

console.log("✅ Applied app config");

// Install UI: 'ankh-ui'
const pkgJsonFilename = resolve(distDir, "package.json");
const pkgJson = JSON.parse(readFileSync(pkgJsonFilename, "utf8"));
pkgJson.dependencies["ankh-ui"] = "latest";
writeFileSync(pkgJsonFilename, JSON.stringify(pkgJson, null, 2));

// Generate (pages)/ directory
mkdirSync(pagesDir);

// Generate Next.js pages
config.pages?.forEach((page: IAnkhPage) => {
  mkdirSync(resolve(pagesDir, page.name));
  writeFileSync(resolve(pagesDir, page.name, "page.tsx" ), generatePage(page), {encoding: "utf8"});
});
console.log(`✅ Generated ${config.pages.length} pages`);

// Run Prettier code formatter, install app and run it.
execSync(`cd ${distDir} && prettier --write . && pnpm install --no-frozen-lockfile`, {stdio: "inherit"});

console.log("\n\nREADY! Run: 'cd next && pnpm run dev'");