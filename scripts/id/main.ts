import * as lib from './lib.js';

// Check if your git is clean
const gitStatus = game.functions.util.runCommand('git status --porcelain');
if (typeof gitStatus === 'string') {
    console.error('<yellow>WARNING: You have uncommitted changes. Please commit them before running a non-safe command.</yellow>');
    // Process.exit(1);
}

console.error('<yellow>WARNING: Be careful with this script. This might break things that are dependent on ids remaining the same, like deckcodes.</yellow>');
console.log('<green>The validate and quit commands are safe to use without issue.</green>\n');

type Commands = 'i' | 'd' | 'v' | 'q';
let running = true;

while (running) {
    let func = game.input('What do you want to do? ([i]ncrement, [d]ecrement, [v]alidate, [q]uit): ')[0] as Commands;
    if (!func) {
        game.pause('<red>Invalid command.</red>\n');
        continue;
    }

    func = func.toLowerCase() as Commands;
    const destructive = ['i', 'd'] as Commands[];

    if (destructive.includes(func)) {
        console.error('<yellow>WARNING: This is a destructive action. Be careful. I heavily recommend not doing this.</yellow>\n');
    }

    let startId: number;

    switch (func) {
        case 'i': {
            startId = Number(game.input('What id to start at: '));
            if (!startId) {
                game.pause('<red>Invalid start id.</red>\n');
                break;
            }

            lib.increment(startId, true);
            break;
        }

        case 'd': {
            startId = Number(game.input('What id to start at: '));
            if (!startId) {
                game.pause('<red>Invalid start id.</red>\n');
                break;
            }

            lib.decrement(startId, true);
            break;
        }

        case 'v': {
            lib.validate(true);
            break;
        }

        case 'q': {
            running = false;
            break;
        }

        default: {
            game.pause('<red>Invalid command.</red>\n');
            break;
        }
    }

    console.log('Done.\n');
}
