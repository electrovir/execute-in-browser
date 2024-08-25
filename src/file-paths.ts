import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const outputDir = join(packageDir, 'node_modules', '.execute-in-browser');
