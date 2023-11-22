const child_process = require("child_process");
const spawn = child_process.spawn;

// TODO: promisify cmd
function cmd(program, args) {
    console.log('CMD:', program, args);
    const p = spawn(program, args);
    p.stdout.on('data', (data) => process.stdout.write(data));
    p.stderr.on('data', (data) => process.stderr.write(data));
    p.on('close', (code) => {
        if (code !== 0) {
            console.error(program, args, 'exited with', code);
        }
    });
}

const commonTscFlags = [
    '--strict', 'true',
    '--removeComments', 'true'
];

const mainTs = [
    'ts/eval.ts',
    'ts/filters.ts',
    'ts/grecha.ts',
    'ts/index.ts'
];

function tscMain(...extraParams) {
    cmd('tsc', [
        ...commonTscFlags,
        '--outDir', 'js',
        ...extraParams,
        ...mainTs,
    ]);
}

function tscServiceWorker(...extraParams) {
    cmd('tsc', [
        ...commonTscFlags,
        '--lib', 'webworker',
        '--skipLibCheck', 'true',
        '--outFile', 'serviceworker.js',
        ...extraParams,
        'serviceworker.ts'
    ]);
}

function build(part, ...args) {
    if (part === undefined) {
        tscServiceWorker();
        tscMain();
    } else if (part === 'main') {
        tscMain();
    } else if (part === 'serviceworker') {
        tscServiceWorker();
    } else {
        throw new Error(`Unknown build part {part}`);
    }
}

function watch(part, ...args) {
    if (part === undefined || part === 'main') {
        // TODO: is it possible to watch both parts?
        tscMain('-w');
    } else if (part === 'serviceworker') {
        tscServiceWorker('-w');
    } else {
        throw new Error(`Unknown watch part {part}`);
    }
}

const [nodePath, scriptPath, command, ...args] = process.argv;

if (command === undefined) {
    build(...args);
} else if (command === 'watch') {
    watch(...args);
} else {
    throw new Error(`Unknown command {command}`);
}
