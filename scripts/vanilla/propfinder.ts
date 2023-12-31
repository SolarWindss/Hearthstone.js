/**
 * @module Vanilla Card Property Finder
 */

import process from 'node:process';
import { createGame } from '../../src/internal.js';

const { game } = createGame();

const props: Record<string, [string, number]> = {};
const stored: Record<string, Array<[any, number]>> = {};

/**
 * Does something(?) to the key and value and applies it to `stored`.
 */
function handleStoredTypes(key: string, value: any): void {
    const values = Array.isArray(value) ? value : [value];

    for (const value of values) {
        if (!stored[key]) {
            stored[key] = [[value, 1]];
            continue;
        }

        const found = stored[key].find(s => game.lodash.isEqual(s[0], value));
        if (found) {
            found[1]++;
        } else {
            stored[key].push([value, 1]);
        }
    }
}

/**
 * Runs the propfinder
 */
function main(): void {
    const vanillaCards = game.functions.card.vanilla.getAll();

    for (const [index, vanillaCard] of vanillaCards.entries()) {
        if (!process.stdout.isTTY && index % 100 === 0) {
            process.stderr.write(`\r\u001B[KProcessing ${(index / 100) + 1} / ${Math.ceil(vanillaCards.length / 100)}...`);
        }

        for (const entry of Object.entries(vanillaCard)) {
            const [key, value] = entry;

            handleStoredTypes(key, value);

            if (Object.keys(props).includes(key)) {
                const storedType = props[key][0];
                if (storedType !== typeof value) {
                    console.warn('<yellow>Discrepancy found. Stored type: %s, Found type %s.</yellow>', storedType, typeof value);
                }

                props[key][1]++;
                continue;
            }

            props[key] = [typeof value, 1];
        }
    }

    console.warn('Done!');

    console.log('<b>PROPS:</b>');
    console.log(props);
    console.log('<b>STORED:</b>');

    for (const object of Object.entries(stored)) {
        let [key, value] = object;
        value = value.sort((a, b) => b[1] - a[1]);

        console.log(`${key}:`);
        console.log(value);
    }
}

main();
