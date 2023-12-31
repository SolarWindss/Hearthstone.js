/**
 * The entry point of the program. Acts like a hub between the tools / scripts and the game.
 * @module Hub
 */
import * as src from './src/index.js'; // Source Code
import * as dc from './tools/deckcreator.js'; // Deck Creator
import * as ccc from './tools/cardcreator/custom.js'; // Custom Card Creator
import * as vcc from './tools/cardcreator/vanilla.js'; // Vanilla Card Creator
import * as clc from './tools/cardcreator/class.js'; // Class Creator
import * as cli from './tools/cli.js'; // Command Line Interface

// These are here so we don't have to recalculate them every watermark call.
const version = game.functions.info.version(4);
const customCardsAmount = game.functions.card.getAll(false).length;
const collectibleCardsAmount = game.functions.card.getAll(true).length;
let vanillaCardsAmount = Number.NaN;
let collectibleVanillaCardsAmount = Number.NaN;

try {
    // `vanilla.getAll` will throw an error if the `vanillacards.json` file is missing.
    const vanillaCards = game.functions.card.vanilla.getAll();
    vanillaCardsAmount = vanillaCards.length;
    collectibleVanillaCardsAmount = vanillaCards.filter(card => card.collectible).length;
} catch {}

/**
 * Clears the console and prints the version information of the Hearthstone.js Hub.
 */
const watermark = () => {
    game.interact.cls();

    console.log(` /$$   /$$  /$$$$$$        /$$$$$  /$$$$$$ 
| $$  | $$ /$$__  $$      |__  $$ /$$__  $$
| $$  | $$| $$  \\__/         | $$| $$  \\__/
| $$$$$$$$|  $$$$$$          | $$|  $$$$$$ 
| $$__  $$ \\____  $$    /$$  | $$ \\____  $$
| $$  | $$ /$$  \\ $$   | $$  | $$ /$$  \\ $$
| $$  | $$|  $$$$$$//$$|  $$$$$$/|  $$$$$$/
|__/  |__/ \\______/|__/ \\______/  \\______/ 
    `);

    console.log('Version: %s', version);
    console.log('Custom Cards: <yellow>%s</yellow> (<green>%s</green> Collectible)', customCardsAmount, collectibleCardsAmount);
    console.log('Vanilla Cards: <blue>%s</blue> (<cyan>%s</cyan> Collectible)', vanillaCardsAmount, collectibleVanillaCardsAmount);
    console.log();
};

/**
 * Simulates a user input loop.
 *
 * @param prompt The prompt to ask
 * @param exitCharacter If the input's first character is this, exit the loop
 * @param callback The callback to call for each input
 */
function userInputLoop(prompt: string, exitCharacter: string | undefined, callback: (input: string) => void) {
    let running = true;
    while (running) {
        watermark();

        const user = game.input(prompt);
        if (!user) {
            continue;
        }

        if (game.interact.shouldExit(user) || user[0].toLowerCase() === exitCharacter?.toLowerCase()) {
            running = false;
            break;
        }

        callback(user);
    }
}

/**
 * Asks the user which card creator variant they want to use.
 */
function cardCreator() {
    userInputLoop('<green>Create a (C)ustom Card</green>, <blue>Import a (V)anilla Card</blue>, <red>Go (B)ack</red>: ', 'b', input => {
        const type = input[0].toLowerCase();

        game.interact.cls();

        if (type === 'v') {
            // This is to throw an error if it can't find the vanilla cards
            game.functions.card.vanilla.getAll();

            vcc.main();
        } else if (type === 'c') {
            ccc.main();
        }
    });
}

/**
 * More developer friendly options.
 */
function devmode() {
    userInputLoop('<green>Create a (C)ard</green>, <blue>Create a Clas(s)</blue>, <yellow>Enter CLI (m)ode</yellow>, <red>Go (B)ack to Normal Mode</red>: ', 'b', input => {
        input = input[0].toLowerCase();

        switch (input) {
            case 'c': {
                cardCreator();
                break;
            }

            case 's': {
                clc.main();
                break;
            }

            case 'm': {
                cli.main(userInputLoop);
                break;
            }

            // No default
        }
    });
}

userInputLoop('<green>(P)lay</green>, <blue>Create a (D)eck</blue>, <yellow>Developer (M)ode</yellow>, <red>(E)xit</red>: ', 'e', input => {
    input = input[0].toLowerCase();

    switch (input) {
        case 'p': {
            src.main();
            break;
        }

        case 'd': {
            dc.main();
            break;
        }

        case 'm': {
            devmode();
            break;
        }

        // No default
    }
});
