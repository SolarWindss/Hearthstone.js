import * as src from '../src/index.js'; // Source Code
import * as dc from '../tools/deckcreator.js'; // Deck Creator
import * as ccc from '../tools/cardcreator/custom.js'; // Custom Card Creator
import * as vcc from '../tools/cardcreator/vanilla.js'; // Vanilla Card Creator
import * as clc from '../tools/cardcreator/class.js'; // Class Creator
import * as cclib from '../tools/cardcreator/lib.js'; // Class Creator
import { type Blueprint } from '../src/types.js';
import { type CcType } from './cardcreator/lib.js';

/**
 * Runs the CLI.
 */
export function main(userInputLoop: (prompt: string, exitCharacter: string | undefined, callback: (input: string) => any) => any): void {
    // Common card creator variant stuff
    const doCardCreatorVariant = (usedOptions: string[], args: string[], callback: (debug: boolean, overrideType?: CcType) => any): void => {
        const doDryRun = usedOptions.includes('--dry-run');
        const doCcType = usedOptions.includes('--cc-type');

        let ccType: CcType | undefined;

        // Get cctype
        if (doCcType) {
            ccType = args[0] as CcType;

            if (!ccType) {
                console.error('<red>Invalid cc type!</red>');
                game.pause();
                return;
            }
        }

        callback(doDryRun, ccType);
    };

    // Main loop
    userInputLoop('> ', undefined, input => {
        let args = input.split(' ');
        const name = args.shift()?.toLowerCase();
        if (!name) {
            throw new Error('Name is undefined. This should never happen.');
        }

        // Options - Long, short
        const commandOptions = [
            ['--dry-run', '-n'],
            ['--cc-type', '-t'],
        ];

        // Parse args
        const usedOptions: string[] = [];

        // Clone the args. Kinda hacky.
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const parsedArguments = JSON.parse(`[${args.map(arg => `"${arg.replaceAll('"', '\'')}"`)}]`) as string[];
        for (const parsedArgument of parsedArguments) {
            // Parse -dt
            if (/^-\w\w+/.test(parsedArgument)) {
                const allArguments = [...parsedArgument];
                allArguments.shift();

                for (const argument of allArguments) {
                    const option = commandOptions.find(option => option.includes('-' + argument))?.[0];
                    if (!option) {
                        continue;
                    }

                    usedOptions.push(option);
                }

                args.shift();
                continue;
            }

            // Parse -d or --dry-run
            const option = commandOptions.find(option => option.includes(parsedArgument))?.[0];
            if (!option) {
                continue;
            }

            usedOptions.push(option);
            args.shift();
        }

        switch (name) {
            case 'help': {
                // Taken heavy inspiration from 'man'
                console.log('\n<bold>Commands</bold>');
                console.log('ccc           - Runs the custom card creator');
                console.log('vcc           - Runs the vanilla card creator');
                console.log('clc           - Runs the class creator');
                console.log('cclib (args)  - Uses the card creator library to manually create a card');
                console.log('dc            - Runs the deck creator');
                console.log('game          - Runs the main game');
                console.log('script (name) - Runs the specified script (NOT IMPLEMENTED!)');
                console.log();
                console.log('<bold>Options</bold>');
                console.log('    <bold>Card Creator Options (ccc, vcc, clc, cclib)</bold>');
                console.log('        <bold>-n, --dry-run</bold>\n            Don\'t actually create the card, just show what would be done.');
                console.log('        <bold>-t <underline>type</underline>, --cc-type <underline>type</bold underline>\n            Set the name of the card creator');
                console.log();
                console.log('    <bold>CCLib Options (cclib)</bold>');
                console.log('        <bold>name</bold>=<underline>name</underline><bold>');
                console.log('        <bold>stats</bold>=<underline>[attack, health]</underline><bold>');
                console.log();
                console.log('<bold>CCLib Example</bold>');
                console.log('cclib -dt Test name="Sheep" text="" cost=1 type="Minion" attack=1 health=1 tribe="Beast" classes=["Neutral"] rarity="Free" collectible=false id=0');
                console.log('       ^^      ^            ^              ^');
                console.log('       Dry-run The name of the card        The type of the card. Etc...');
                console.log('        CC type is "Test"   The description of the card');
                console.log();
                game.pause();

                break;
            }

            case 'ccc': {
                doCardCreatorVariant(usedOptions, args, ccc.main);

                break;
            }

            case 'vcc': {
                doCardCreatorVariant(usedOptions, args, vcc.main);

                break;
            }

            case 'clc': {
                doCardCreatorVariant(usedOptions, args, clc.main);

                break;
            }

            case 'cclib': {
                doCardCreatorVariant(usedOptions, args, (debug, overrideType) => {
                    // Here we implement our own card creator variant

                    // Only include args with an '=' in it.
                    args = args.filter(arg => arg.includes('='));

                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    const blueprint = {} as Blueprint;
                    for (const argument of args) {
                        let [key, value] = argument.split('=');

                        // Parse it as its real value instead of a string.
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        value = JSON.parse(`[ ${value} ]`)[0];

                        // HACK: Use of never
                        blueprint[key as keyof Blueprint] = value as never;
                    }

                    if (!blueprint.id && blueprint.id !== 0) {
                        return;
                    }

                    // Validate it. This will not do the compiler's job for us, only the stuff that the compiler doesn't do.
                    // That means that the blueprint isn't very validated, which means this WILL crash if you create an invalid card.
                    game.functions.card.validateBlueprint(blueprint);

                    // The default type is CLI
                    let type = 'CLI';
                    if (overrideType) {
                        type = overrideType;
                    }

                    cclib.create(type as CcType, blueprint, undefined, undefined, debug);
                });

                break;
            }

            case 'dc': {
                dc.main();

                break;
            }

            case 'game': {
                src.main();

                break;
            }

            default: { if (name === 'script') {
                const name = args[0];
                if (!name) {
                    console.error('<red>Invalid script name!</red>');
                    game.pause();
                    return;
                }

                // TODO: Implement.
                throw new Error('not implemented');
            } else {
                console.warn('<yellow>That is not a valid command.</yellow>');
                game.pause();
            }
            }
        }
    });
}
