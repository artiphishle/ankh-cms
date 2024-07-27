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
import {
  IAnkhCmsConfig,
  IAnkhCmsPage,
  IAnkhUi,
  TAnkhUiProps,
} from 'ankh-types';
import { convertArrayToCss } from 'ankh-css';

const root = {
  src: resolve(process.argv[2]!, "../"),
  dist: process.cwd()
};
const dir = {
  src: {
    lib: resolve(root.src, "lib/"),
    libTpl: resolve(root.src, 'lib/templates/')
  },
  dist: {
    next: resolve(root.dist, 'next/'),
    public: resolve(root.dist, 'next/public/'),
    nextSrcAppPages: resolve(root.dist, 'next/src/app/(pages)/')
  }
};

async function importConfig() {
  const { config } = await import("../../templates/server/config");
  console.log(`✅ Dynamically imported config file`);
  return config;
}
function printTitle() {
  console.log();
  console.log('Ankhorage CMS');
  console.log('=============\n');
}
function stringifyProps(props: TAnkhUiProps) {
  return Object.keys(props)
    .map((key: string) => {
      const propValue = props[key];
      if (typeof propValue === 'string') return `${key}="${propValue}"`;
      return `${key}={${JSON.stringify(propValue)}}`;
    })
    .join(' ');
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
function generatePage({ name, uis }: IAnkhCmsPage) {
  const imports = uis
    .map((ui) => getRecursiveImports(ui, []))
    .flatMap((uiArray) => uiArray);
  let uniqueImports: string[] = [];
  imports.forEach((imp) => {
    if (!uniqueImports.includes(imp)) uniqueImports.push(imp);
  });

  const imp = uniqueImports.length
    ? `import {${uniqueImports.join(',')}} from "@/app/_uis/index";`
    : '';

  const ret = `return (<>${uis.map((ui) => recursiveGenUi(ui)).join('\n')}</>);`;

  return `${imp}\n\n/** Page: /${name} */\nexport default function Page(){\n${ret}}`;
}
function installNextJs() {
  // Clear app directory if exists
  if (existsSync(dir.dist.next)) {
    rmSync(dir.dist.next, { recursive: true, force: true });
  }
  mkdirSync(dir.dist.next);

  // Next.js install
  execSync(
    `pnpm dlx create-next-app@latest ${dir.dist.next} --ts --app --src-dir --no-eslint --no-import-alias --no-tailwind`,
    { encoding: 'utf8' }
  );

  // Add redirection to /home to next.config.mjs
  cpSync(
    resolve(dir.src.libTpl, 'next.config.mjs'),
    resolve(dir.dist.next, 'next.config.mjs')
  );

  // Empty public/ directory
  rmSync(dir.dist.public, { recursive: true, force: true });
  mkdirSync(dir.dist.public);

  // Add tsconfig.json
  cpSync(resolve(dir.src.libTpl, "tsconfig.json"), resolve(dir.dist.next, "tsconfig.json"));

  // Add root layout
  cpSync(resolve(dir.src.libTpl, 'layout.tsx'), resolve(dir.dist.next, 'src/app/layout.tsx'));

  console.log('✅ Next.js app installed & configured');
}
function installServerActions() {
  mkdirSync(resolve(dir.dist.next, 'src/app/_server'));
  copyFileSync(
    resolve(dir.src.libTpl, "server/config.ts"),
    resolve(dir.dist.next, 'src/app/_server/config.ts')
  );
  copyFileSync(
    resolve(dir.src.libTpl, 'server/fetchConfig.ts'),
    resolve(dir.dist.next, 'src/app/_server/fetchConfig.ts')
  );
  console.log('✅ Installed Server Actions');
}
function installStaticFiles(config: IAnkhCmsConfig) {
  config.public?.forEach(({ name, files }) => {
    mkdirSync(resolve(dir.dist.public, name));
    files.forEach((filename: string) =>
      cpSync(filename, resolve(dir.dist.public, name, basename(filename)))
    );
  });
}
async function installStyles(config: IAnkhCmsConfig) {
  if (!config.styles) return;

  const style = await convertArrayToCss(config.styles);
  const css = readFileSync(resolve(dir.src.libTpl, 'globals.css'), 'utf8');
  writeFileSync(resolve(dir.dist.next, 'src/app/globals.css'), `${css}\n\n${style}`);

  // Copy Reset CSS
  cpSync(
    resolve(dir.src.libTpl, 'meyer.reset.css'),
    resolve(dir.dist.next, 'src/app/meyer.reset.css')
  );
  console.log(`✅ Applied CSS`);
}
function installAdditionalPackages() {
  const pkgJsonFilename = resolve(dir.dist.next, 'package.json');
  const pkgJson = JSON.parse(readFileSync(pkgJsonFilename, 'utf8'));
  pkgJson.dependencies['ankh-ui'] = 'latest';
  pkgJson.dependencies['ankh-hooks'] = 'latest';
  pkgJson.dependencies['next-themes'] = 'latest';
  pkgJson.dependencies['lucide-react'] = 'latest';
  pkgJson.dependencies['react-grid-gallery'] = 'latest';
  pkgJson.dependencies['ahooks'] = 'latest';
  pkgJson.dependencies['server-only'] = 'latest';
  pkgJson.devDependencies['ankh-types'] = 'latest';

  writeFileSync(pkgJsonFilename, JSON.stringify(pkgJson, null, 2));
}
function installPages(config: IAnkhCmsConfig) {
  mkdirSync(resolve(dir.dist.nextSrcAppPages));

  /** @todo Custom pages cannot start with 'ankh' */
  config.pages?.forEach((page: IAnkhCmsPage) => {
    mkdirSync(resolve(dir.dist.nextSrcAppPages, page.name));
    writeFileSync(
      resolve(dir.dist.nextSrcAppPages, page.name, 'page.tsx'),
      generatePage(page),
      { encoding: 'utf8' }
    );
  });
  console.log(`✅ Generated ${config.pages.length} pages`);
}
function installPackagesExec() {
  execSync(
    `cd ${dir.dist.next} && prettier --write . && pnpm install --no-frozen-lockfile`
  );
  console.log(
    '✅ Additional packages installed: ankh-ui, next-themes, server-only'
  );
}
function installUis() {
  mkdirSync(resolve(dir.dist.next, "src/app/_uis"));
  mkdirSync(resolve(dir.dist.next, "src/app/_auth"));
  cpSync(resolve(dir.dist.next, "node_modules/ankh-ui/lib/uis"), resolve(dir.dist.next, "src/app/_uis"), { recursive: true });
  cpSync(resolve(dir.dist.next, "node_modules/ankh-ui/lib/auth"), resolve(dir.dist.next, "src/app/_auth"), { recursive: true });
  const pkgJsonFilename = resolve(dir.dist.next, 'package.json');
  const pkgJson = JSON.parse(readFileSync(pkgJsonFilename, "utf8"));
  delete pkgJson.dependencies['ankh-ui'];
  writeFileSync(pkgJsonFilename, JSON.stringify(pkgJson, null, 2));
  execSync(`cd ${dir.dist.next} && pnpm install --no-frozen-lockfile`);
  console.log('✅ ankh-ui UI\'s installed');
}
function finishSetup() {

  console.log('✅ Code files formatted');
  console.log("\nREADY! Run: 'cd next && pnpm run dev'\n");
}

(async function () {
  printTitle();
  const config = await importConfig();
  installNextJs();
  installServerActions();
  installStaticFiles(config);
  await installStyles(config);
  installAdditionalPackages();
  installPages(config);
  installPackagesExec();
  installUis();
  finishSetup();
})();
