#!/usr/bin/env node

import {runCliScript} from '@augment-vir/node';
import {join} from 'node:path';

await runCliScript({
    scriptPath: join(import.meta.dirname, 'src', 'cli.script.ts'),
    cliScriptFilePath: import.meta.filename,
    binName: 'b-run',
});
