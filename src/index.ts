/**
 * The entry point of the game.
 *
 * Hearthstone.js - Hearthstone but console based.
 * Copyright (C) 2022  LunarTides
 *
 * @module Index
 */

import { validate as validateIds } from '../scripts/id/lib.js';
import { createGame } from './internal.js';

/**
 * Starts the game.
 */
export function main(): void {
    const { game, player1, player2 } = createGame();

    game.interact.info.watermark();

    // Find holes and dupes in the ids
    console.warn('\nValidating ids...');
    const [holes, dupes] = validateIds(true);
    if (holes > 0 || dupes > 0) {
        // If there were holes or dupes, pause the game so that the user gets a
        // chance to see what the problem was
        game.pause();
    }

    // Ask the players for deck codes.
    for (const player of [player1, player2]) {
        if (player.deck.length > 0) {
            continue;
        }

        // Put this in a while loop to make sure the function repeats if it fails.
        while (!game.interact.deckCode(player)) {
            // Pass
        }
    }

    game.startGame();

    game.interact.card.mulligan(player1);
    game.interact.card.mulligan(player2);

    try {
        // Game loop
        while (game.running) {
            game.interact.gameLoop.doTurn();
        }
    } catch (error) {
        if (!(error instanceof Error)) {
            throw new TypeError('error is not of error type when catching from gameloop');
        }

        // Create error report file
        game.functions.util.createLogFile(error);

        throw error;
    }
}
