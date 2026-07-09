import { existsSync } from 'node:fs';
import { platform } from 'node:os';

const WINDOWS_BASH_CANDIDATES = [
  process.env.BASH_PATH,
  'C:\\Program Files\\Git\\bin\\bash.exe',
  'C:\\Program Files\\Git\\usr\\bin\\bash.exe',
  'C:\\Program Files (x86)\\Git\\bin\\bash.exe',
].filter(Boolean);

export function getBashPath() {
  if (platform() !== 'win32') {
    return 'bash';
  }

  for (const candidate of WINDOWS_BASH_CANDIDATES) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'Git Bash was not found. Install Git for Windows (https://git-scm.com/download/win) ' +
    'or set BASH_PATH to your bash.exe path.',
  );
}
