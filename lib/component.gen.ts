#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

type ComponentName = string;
type TargetIdRef = string;

interface Props {
  [key: string]: any;
}

interface IComponent {
  c: ComponentName;
  t: TargetIdRef;
  p: Props; // ignoring props for now
  cSubs?: IComponent[];
}

const components: IComponent[] = [
  { c: 'Heading', t: 't1', p: { text: 'Title', h: 1 } },
  { c: 'Card1', t: 't2', p: {}, cSubs: [] },
  { c: 'Button', t: 't3', p: {} },
];

const generateComponent = (
  { c, t, cSubs }: IComponent,
  indent: string = '  '
): string => {
  let children = '';
  if (cSubs && cSubs.length > 0) {
    children = cSubs
      .map((sub) => generateComponent(sub, indent + '  '))
      .join('\n');
  }

  return `
    ${indent}<div data-comp="${c}">
    ${indent}  <div data-target-id="${t}"/>
    ${children}
    ${indent}</div>`;
};

const generateComponentsFile = (components: IComponent[], filePath: string) => {
  const content = components.map((comp) => generateComponent(comp)).join('\n');
  const formattedContent = `
    import React from 'react';
    
    const Components = () => (
      <div>${content}</div>
    );

    export default Components;`;

  fs.writeFileSync(filePath, formattedContent);
};

const outputDir = './components';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

generateComponentsFile(
  components,
  path.join(outputDir, 'GeneratedComponents.tsx')
);

console.log('Components generated successfully.');
