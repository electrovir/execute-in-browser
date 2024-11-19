#!/usr/bin/env -S npx tsx

import {log} from '@augment-vir/common';
import {extractRelevantArgs, writeFileAndDir} from '@augment-vir/node';
import {alwaysReloadPlugin} from '@virmator/frontend/dist/always-reload.vite';
import {basename, dirname, extname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {packageUp} from 'package-up';
import {getPortPromise} from 'portfinder';
import {createServer} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {createHtmlFileContents} from './html-output.js';

async function runFileInBrowser(scriptPath: string) {
    const packageJsonPath = await packageUp();
    if (!packageJsonPath) {
        throw new Error(`Failed to find a package.json file for script '${scriptPath}'`);
    }
    const packageDir = dirname(packageJsonPath);

    const scriptName = basename(scriptPath);
    const htmlPath = join(
        packageDir,
        'node_modules',
        '.execute-in-browser',
        `${scriptName.replace(extname(scriptName), '')}.html`,
    );

    await writeFileAndDir(htmlPath, createHtmlFileContents({htmlPath, scriptPath}));

    const port = await runViteServer(8321, htmlPath);

    log.info(`\nOpen URL: http://localhost:${port}/${relative(process.cwd(), htmlPath)}\n`);
}

async function runViteServer(startingPort: number, htmlPath: string) {
    const selectedPort = await getPortPromise({
        port: startingPort,
    });

    const server = await createServer({
        clearScreen: false,
        configFile: false,
        root: process.cwd(),
        server: {
            port: selectedPort,
        },
        plugins: [
            alwaysReloadPlugin(),
            tsconfigPaths(),
        ],
        build: {
            rollupOptions: {
                input: {
                    main: htmlPath,
                },
            },
        },
    });
    await server.listen();

    return selectedPort;
}

async function cli(rawArgs: ReadonlyArray<string>) {
    const [scriptPath] = extractRelevantArgs({
        rawArgs,
        binName: 'b-run',
        fileName: fileURLToPath(import.meta.url),
    });

    if (!scriptPath) {
        throw new Error('No file found to run.');
    }

    await runFileInBrowser(scriptPath);
}

await cli(process.argv);
