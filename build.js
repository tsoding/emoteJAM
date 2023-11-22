const child_process = require("child_process");
const spawn = child_process.spawn;

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

function build(target, ...args) {
    if (target === undefined) {
        tscServiceWorker();
        tscMain();
    } else if (target === 'main') {
        tscMain();
    } else if (target === 'serviceworker') {
        tscServiceWorker();
    } else {
        throw new Error(`Unknown build target {target}`);
    }
}

function watch(target, ...args) {
    if (target === undefined || target === 'main') {
        tscMain('-w');
    } else if (target === 'serviceworker') {
        tscServiceWorker('-w');
    } else {
        throw new Error(`Unknown watch target {target}`);
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
