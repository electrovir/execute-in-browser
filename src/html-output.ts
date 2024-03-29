import {basename, dirname, relative} from 'node:path';

export function createHtmlFileContents({
    htmlPath,
    scriptPath,
}: {
    htmlPath: string;
    scriptPath: string;
}): string {
    return `<!doctype html>
<html>
    <head>
        <title>${basename(scriptPath)}</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
        <script type="module" src="${relative(dirname(htmlPath), scriptPath)}"></script>
        <style>
            html, body {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: sans-serif;
                font-size: 3em;
            }
        </style>
    </head>
    <body>See the console.</body>
</html>
`;
}
