#!/usr/bin/env node

import { execSync } from 'child_process';

const [outDir] = process.argv;
const libDir = './lib';
const distDir = './dist/next';
console.log('------>' , outDir);

function clear() {
  execSync(`rm -rf ${distDir} && mkdir ${distDir}`);
}

function install() {
  const result = execSync(
    `npx create-next-app@latest ${distDir} --ts --app --src-dir --no-eslint --no-import-alias --no-tailwind`,
    {
      encoding: 'utf8',
    }
  );
  console.log(result);
}

function patchNextConfigMjs() {
  execSync(`cp ${libDir}/installer/next/templates/next.config.mjs ${distDir}`);
}

function patchPublicDir() {
  execSync(`rm -rf ${distDir}/public && mkdir ${distDir}/public`);
}

function patchGlobalsCss() {
  execSync(`cp ${libDir}/installer/next/templates/globals.css ${distDir}`);
}

function generatePages() {
  console.log('skip page generation...');
}

function format() {
  execSync('prettier --write .');
}

clear();
install();
patchNextConfigMjs();
patchPublicDir();
patchGlobalsCss();
generatePages();
format();

/**
 * @startjson {
"pages": [
  {
    "name": "home"
    }  
  ]
}
@endjson
 */

process.exit(0);
