import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, dirname, join, resolve } from 'node:path';
import { platform } from 'node:os';
import { fileURLToPath } from 'node:url';

import { getBashPath } from './get-bash.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const scriptArg = process.argv[2];

if (!scriptArg) {
  console.error('Usage: node tools/scripts/run-sh.mjs <script.sh> [args...]');
  process.exit(1);
}

const scriptPath = resolve(root, scriptArg);
const args = process.argv.slice(3);
const bash = getBashPath();
const pathKey = platform() === 'win32' ? 'Path' : 'PATH';
const binDir = join(root, 'node_modules', '.bin');
const pathPrefix = existsSync(binDir) ? `${binDir}${delimiter}` : '';
const env = {
  ...process.env,
  [pathKey]: `${pathPrefix}${process.env[pathKey] ?? ''}`,
};

const result = spawnSync(bash, [scriptPath, ...args], {
  cwd: root,
  stdio: 'inherit',
  env,
});

process.exit(result.status ?? 1);
