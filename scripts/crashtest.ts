/**
 * The crash test script.
 * @module Crash Test
 */
import process from 'node:process';
import { createGame } from '../src/internal.js';

const { game } = createGame();

const gamesEnv = process.env.GAMES ?? '';
let games = game.lodash.parseInt(gamesEnv);
games = Number.isNaN(games) ? 50 : games;

/**
 * Executes the main function for the program.
 */
function main(): void {
    const decks = JSON.parse(game.functions.util.fs('read', '/decks.json') as string) as string[];

    console.warn('Looking for crashes... This might take a while...');
    if (!process.env.GAMES) {
        console.warn('Set the GAMES env variable to change how many games to play.');
    }

    console.warn('NOTE: If you see no progress being made for an extended period of time, chances are that the game got stuck in an infinite loop.');

    for (let index = 0; index < games; index++) {
        // If you're redirecting output to a file, show a progress bar
        process.stderr.write(`\r\u001B[KPlaying game ${index + 1} / ${games}...`);

        // Test the main game
        const { game, player1, player2 } = createGame();

        // Setup the ais
        game.config.ai.player1 = true;
        game.config.ai.player2 = true;
        game.doConfigAi();

        game.noInput = true;
        game.noOutput = true;

        // Choose random decks for the players
        for (let i = 0; i < 2; i++) {
            const player = game.functions.util.getPlayerFromId(i);

            const deck = game.lodash.sample(decks);
            if (typeof deck === 'string') {
                game.functions.deckcode.import(player, deck);
            }
        }

        game.startGame();
        game.interact.card.mulligan(player1);
        game.interact.card.mulligan(player2);

        try {
            while (game.running) {
                game.interact.gameLoop.doTurn();
            }
        } catch (error) {
            if (!(error instanceof Error)) {
                throw new TypeError('error is not of error type');
            }

            game.noOutput = false;

            // If it crashes, show the ai's actions, and the history of the game before actually crashing
            game.config.general.debug = true;
            game.functions.util.createLogFile(error);

            game.interact.gameLoop.handleCmds('/ai');
            game.interact.gameLoop.handleCmds('history', { debug: true });

            console.log('THE GAME CRASHED: LOOK ABOVE FOR THE HISTORY, AND THE AI\'S LOGS.');

            throw error;
        }
    }

    // Create a new game to reset `noOutput` to false.
    // Trust me, it doesn't log anything without this
    // eslint-disable-next-line no-unused-vars
    const _ = createGame();
    console.warn('\n<green>Crash test passed!</green>');
}

main();
