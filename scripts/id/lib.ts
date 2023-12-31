/**
 * A collection of functions relating to reading and writing ids of blueprints.
 *
 * @module Id Script
 */

import { createGame } from '../../src/internal.js';

const { game } = createGame();

const idRegex = /id: (\d+)/;

/**
 * Searches for cards and calls the callback function for each card found.
 *
 * @param callback The callback function to be called for each card found.
 *                 It takes three parameters:
 *                 - path: the path of the card file
 *                 - content: the content of the card file
 *                 - id: the ID of the card
 */
function searchCards(callback: (path: string, content: string, id: number) => void): void {
    game.functions.util.searchCardsFolder((fullPath, content) => {
        const idMatch = idRegex.exec(content);
        if (!idMatch) {
            console.error(`No id found in ${fullPath}`);
            return;
        }

        const id = Number(idMatch[1]);
        callback(fullPath, content, id);
    });
}

/**
 * Change the ids of cards starting from a given id and apply a callback function to each id.
 *
 * @param startId The id to start the changes from.
 * @param callback The callback function to apply to each id.
 * @param log Indicates whether to log the changes or not.
 *
 * @returns The number of cards that were updated.
 */
function change(startId: number, callback: (id: number) => number, log: boolean): number {
    let updated = 0;

    searchCards((path, content, id) => {
        if (id < startId) {
            if (log) {
                console.log(`<bright:yellow>Skipping ${path}</bright:yellow>`);
            }

            return;
        }

        const newId = callback(id);

        // Set the new id
        game.functions.util.fs('write', path, content.replace(idRegex, `id: ${newId}`));

        if (log) {
            console.log(`<bright:green>Updated ${path}</bright:green>`);
        }

        updated++;
    });

    if (updated > 0) {
        const latestId = Number(game.functions.util.fs('read', '/cards/.latestId'));
        const newLatestId = callback(latestId);

        game.functions.util.fs('write', '/cards/.latestId', newLatestId.toString());
    }

    if (log) {
        if (updated > 0) {
            console.log('<bright:green>Updated %s cards.</bright:green>', updated);
        } else {
            console.log('<yellow>No cards were updated.</yellow>');
        }
    }

    return updated;
}

/**
 * Decrement the ids of all cards from a starting id.
 * If the starting id is 50, it will decrement the ids of all cards with an id of 50 or more.
 * This is useful if you delete a card, and want to decrement the ids of the remaining cards to match.
 *
 * @param startId The starting id
 * @param log If it should log what it's doing. This should probably be false when using this as a library.
 *
 * @returns The number of cards that were updated
 */
export function decrement(startId: number, log: boolean): number {
    return change(startId, id => id - 1, log);
}

/**
 * Increment the ids of all cards from a starting id.
 * If the starting id is 50, it will increment the ids of all cards with an id of 50 or more.
 * This is useful if you add a card between two ids, and want to increment the ids of the remaining cards to match.
 *
 * @param startId The starting id
 * @param log If it should log what it's doing. This should probably be false when using this as a library.
 *
 * @returns The number of cards that were updated
 */
export function increment(startId: number, log: boolean): number {
    return change(startId, id => id + 1, log);
}

/**
 * Check for holes in the ids.
 * If there is a card with an id of 58 and a card with an id of 60, but no card with an id of 59, that is a hole.
 *
 * @param log If it should log what it's doing. This should probably be false when using this as a library.
 *
 * @returns Amount of holes, and amount of duplicates
 */
export function validate(log: boolean): [number, number] {
    const ids: [[number, string]] = [[-1, '']];

    searchCards((path, content, id) => {
        ids.push([id, path]);
    });

    ids.sort((a, b) => a[0] - b[0]);

    // Check if there are any holes
    let currentId = 0;
    let holes = 0;
    let duplicates = 0;

    for (const [id, path] of ids) {
        if (id === -1) {
            continue;
        }

        if (id === currentId) {
            if (log) {
                console.error(`<bright:yellow>Duplicate id in ${path}. Previous id: ${currentId}. Got id: ${id}. <green>Suggestion: Change one of these ids.</green bright:yellow>`);
            }

            duplicates++;
        } else if (id !== currentId + 1) {
            if (log) {
                console.error(`<bright:yellow>Hole in ${path}. Previous id: ${currentId}. Got id: ${id}. <green>Suggestion: Change card with id ${id} to ${id - 1}</green bright:yellow>`);
            }

            holes++;
        }

        currentId = id;
    }

    // Check if the .latestId is valid
    const latestId = game.lodash.parseInt((game.functions.util.fs('read', '/cards/.latestId') as string).trim());
    if (latestId !== currentId) {
        if (log) {
            console.log('<yellow>Latest id is invalid. Latest id found: %s, latest id in file: %s. Fixing...</yellow>', currentId, latestId);
        }

        game.functions.util.fs('write', '/cards/.latestId', currentId.toString());
    }

    if (log) {
        if (holes > 0) {
            console.log('<yellow>Found %s holes.</yellow>', holes);
        } else {
            console.log('<bright:green>No holes found.</bright:green>');
        }

        if (duplicates > 0) {
            console.log('<yellow>Found %s duplicates.</yellow>', duplicates);
        } else {
            console.log('<bright:green>No duplicates found.</bright:green>');
        }

        if (latestId === currentId) {
            console.log('<bright:green>Latest id up-to-date.</bright:green>');
        }
    }

    return [holes, duplicates];
}
