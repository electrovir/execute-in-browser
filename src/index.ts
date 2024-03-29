import {randomString} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {extractRelevantArgs} from 'cli-args-vir';
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {getPortPromise} from 'portfinder';
import {alwaysReloadPlugin} from 'virmator/dist/compiled-base-configs/vite-always-reload-plugin';
import {createServer} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {tempDir} from './file-paths';
import {createHtmlFileContents} from './html-output';

async function runFileInBrowser(scriptPath: string) {
    const htmlPath = join(tempDir, `index-${randomString(4)}.html`);

    await writeHtmlFile({htmlPath, scriptPath});

    const port = await runViteServer(8321, htmlPath);

    log.info(`\nOpen URL: http://localhost:${port}/${relative(process.cwd(), htmlPath)}\n`);
}

async function writeHtmlFile({htmlPath, scriptPath}: {htmlPath: string; scriptPath: string}) {
    await mkdir(dirname(htmlPath), {recursive: true});
    await writeFile(htmlPath, createHtmlFileContents({htmlPath, scriptPath}));
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
    console.log(fileURLToPath(import.meta.url), process.argv);
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

cli(process.argv);
