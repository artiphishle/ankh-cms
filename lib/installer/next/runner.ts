import { basename, resolve } from 'path';
import { execSync } from 'child_process';
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { IAnkhCmsConfig, IAnkhPage, IAnkhUi, TAnkhUiProps } from '../../types';
import { convertArrayToCss } from 'ankh-css';

const cmsDir = process.argv[2]!;
const outDir = process.cwd();
const libDir = resolve(cmsDir, '../lib/');
const tplDir = resolve(libDir, 'templates/');
const distDir = resolve(outDir, 'next/');
const publicDir = resolve(distDir, 'public/');
const pagesDir = resolve(distDir, 'src/app/(pages)/');
const configFile = resolve(outDir, 'config.json');

function printTitle() {
  console.log();
  console.log('Ankhorage CMS');
  console.log('=============\n');
}
function stringifyProps(props: TAnkhUiProps) {
  return Object.keys(props).map((key: string) => {
    const propValue = props[key];
    if (typeof propValue === "string") return `${key}="${propValue}"`
    return `${key}={${JSON.stringify(propValue)}}`;
  }).join(" ");
}
function recursiveGenUi(ui: IAnkhUi) {
  let subUis = '';
  if (ui.uis?.length)
    subUis = ui.uis?.map((subUi) => recursiveGenUi(subUi)).join('\n');
  const props = stringifyProps(ui.p);
  return `<${ui.ui} ${props}>${subUis}</${ui.ui}>`;
}
function getRecursiveImports({ ui, uis }: IAnkhUi, result: string[]) {
  if (!result.includes(ui)) result.push(ui);
  uis?.forEach((subUi) => getRecursiveImports(subUi, result));

  return result;
}
function generatePage({ name, uis }: IAnkhPage) {
  /** @todo Only one at root level ATM */
  const imports = uis.map((ui) => getRecursiveImports(ui, [])).flatMap((uiArray) => uiArray);
  let uniqueImports: string[] = [];
  imports.forEach((imp) => {
    if (!uniqueImports.includes(imp)) uniqueImports.push(imp)
  });

  const imp = uniqueImports.length
    ? `import {${uniqueImports.join(',')}} from "ankh-ui";`
    : '';

  const ret = `return (<>${uis.map((ui) => recursiveGenUi(ui)).join("\n")}</>);`;

  return `${imp}\n\n/** Page: /${name} */\nexport default function Page(){\n${ret}}`;
}
function getConfig() {
  if (!existsSync(configFile))
    copyFileSync(resolve(tplDir, 'config.json'), configFile);

  return JSON.parse(readFileSync(configFile, 'utf8'));
}
function installNextJs() {
  // Clear app directory if exists
  if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir);

  // Next.js install
  execSync(
    `pnpm dlx create-next-app@latest ${distDir} --ts --app --src-dir --no-eslint --no-import-alias --no-tailwind`,
    { encoding: 'utf8' }
  );

  // Add redirection to /home to next.config.mjs
  cpSync(
    resolve(tplDir, 'next.config.mjs'),
    resolve(distDir, 'next.config.mjs')
  );

  // Empty public/ directory
  rmSync(publicDir, { recursive: true, force: true });
  mkdirSync(publicDir);

  // Add root layout
  cpSync(resolve(tplDir, 'layout.tsx'), resolve(distDir, 'src/app/layout.tsx'));

  console.log('✅ Next.js app installed & configured');
}
function installStaticFiles(config: IAnkhCmsConfig) {
  config.public?.forEach(({ name, files }) => {
    mkdirSync(resolve(publicDir, name));
    files.forEach((filename: string) =>
      cpSync(filename, resolve(publicDir, name, basename(filename)))
    );
  });
}
async function installStyles(config: IAnkhCmsConfig) {
  if (!config.styles) return;

  const style = await convertArrayToCss(config.styles);
  const css = readFileSync(resolve(tplDir, 'globals.css'), 'utf8');
  writeFileSync(resolve(distDir, 'src/app/globals.css'), `${css}\n\n${style}`);

  // Copy Reset CSS
  cpSync(
    resolve(tplDir, 'meyer.reset.css'),
    resolve(distDir, 'src/app/meyer.reset.css')
  );

  console.log(`✅ Applied CSS`);
}
function installAdditionalPackages() {
  const pkgJsonFilename = resolve(distDir, 'package.json');
  const pkgJson = JSON.parse(readFileSync(pkgJsonFilename, 'utf8'));
  pkgJson.dependencies['ankh-ui'] = 'latest';
  pkgJson.dependencies['next-themes'] = 'latest';

  writeFileSync(pkgJsonFilename, JSON.stringify(pkgJson, null, 2));
}
function installPages(config: IAnkhCmsConfig) {
  mkdirSync(pagesDir);

  // Add CMS based pages
  const cmsPages: IAnkhCmsConfig["pages"] = [{
    uis: [
      { ui: "Heading", p: { level: "h1", text: "Ankh_Theming" } },
      { ui: "Heading", p: { level: "h2", text: "Colors" } },
      { ui: "Heading", p: { level: "h3", text: "Primary" } },
      { ui: "ColorHue", p: { color: "#ff0000" } },
      { ui: "Heading", p: { level: "h3", text: "Complementary" } },
      { ui: "ColorHue", p: { color: "#00ff00" } },
      { ui: "Heading", p: { level: "h3", text: "Accent" } },
      { ui: "ColorHue", p: { color: "#0000ff" } },
      { ui: "Heading", p: { level: "h3", text: "Base" } },
      { ui: "ColorHue", p: { color: "#aaaaaa" } },
    ],
    name: "ankh-theming"
  }];
  const allPages = [...cmsPages, ...config.pages || []];

  /** @todo Custom pages cannot start with 'ankh' */
  allPages.forEach((page: IAnkhPage) => {
    mkdirSync(resolve(pagesDir, page.name));
    writeFileSync(
      resolve(pagesDir, page.name, 'page.tsx'),
      generatePage(page),
      { encoding: 'utf8' }
    );
  });
  console.log(`✅ Generated ${config.pages.length - cmsPages.length} pages (plus ${cmsPages.length} cms pages)`);
}
function finishSetup() {
  execSync(
    `cd ${distDir} && prettier --write . && pnpm install --no-frozen-lockfile`
  );
  console.log('✅ Additional packages installed: ankh-ui, next-themes');
  console.log('✅ Code files formatted');
  console.log("\nREADY! Run: 'cd next && pnpm run dev'\n");
}

(function (config: IAnkhCmsConfig) {
  return new Promise((resolve) => {
    printTitle();
    installNextJs();
    installStaticFiles(config);
    installStyles(config).then(() => {
      installAdditionalPackages();
      installPages(config);
      finishSetup();
      resolve('ok');
    });
  })
})(getConfig());