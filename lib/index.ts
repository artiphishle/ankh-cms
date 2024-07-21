import { resolve } from 'path';
import { spawn } from 'child_process';

const child = spawn(
  'node',
  [resolve(__dirname, 'installer/next/runner.js'), __dirname],
  { stdio: 'inherit' }
);

child.on('close', (code) => console.log(`Script finished with code: ${code}`));
