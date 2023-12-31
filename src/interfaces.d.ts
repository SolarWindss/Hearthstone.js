import { type Game } from './internal.js';

declare global {
    /**
     * The global game
     */
    // eslint-disable-next-line no-var, no-unused-vars
    var game: Game;
}
