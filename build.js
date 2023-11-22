import { spawn } from 'child_process';

function cmd(program, args) {
    console.log('CMD:', program, args);
    const p = spawn(program, args.flat()); // NOTE: flattening the args array enables you to group related arguments for better self-documentation of the running command
    p.stdout.on('data', (data) => process.stdout.write(data));
    p.stderr.on('data', (data) => process.stderr.write(data));
    p.on('close', (code) => {
        if (code !== 0) {
            console.error(program, args, 'exited with', code);
        }
    });
    return p;
}

const commonTscFlags = [
    '--strict',
    '--removeComments',
    '--skipLibCheck',
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
        ['--outDir', 'js'],
        ...extraParams,
        mainTs,
    ]);
}

function tscServiceWorker(...extraParams) {
    cmd('tsc', [
        ...commonTscFlags,
        ['--lib', 'webworker'],
        ['--outFile', 'serviceworker.js'],
        ...extraParams,
        'serviceworker.ts'
    ]);
}

function build(part, ...args) {
    switch (part) {
    case undefined:
        tscServiceWorker();
        tscMain();
        break;
    case 'main':
        tscMain();
        break;
    case 'serviceworker':
        tscServiceWorker();
        break;
    default:
        throw new Error(`Unknown build part ${part}. Available parts: main, serviceworker.`);
    }
}

function watch(part, ...args) {
    switch (part) {
    case undefined:
        tscMain('-w', '--preserveWatchOutput');
        tscServiceWorker('-w', '--preserveWatchOutput');
        break;
    case 'main':
        tscMain('-w', '--preserveWatchOutput');
        break;
    case 'serviceworker':
        tscServiceWorker('-w', '--preserveWatchOutput');
        break;
    default:
        throw new Error(`Unknown watch part ${part}. Available parts: main, serviceworker.`);
    }
}

const [nodePath, scriptPath, command, ...args] = process.argv;
switch (command) {
case undefined:
case 'build':
    build(...args);
    break;
case 'watch':
    watch(...args);
    break;
case 'serve':
    // TODO: maybe replace Python with something from Node itself?
    // Python is a pretty unreasonable dependency.
    cmd('python3', [['-m', 'http.server'], '6969']);
    watch();
    break;
default:
    throw new Error(`Unknown command ${command}. Available commands: build, watch.`);
}
