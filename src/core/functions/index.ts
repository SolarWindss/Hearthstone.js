/**
 * Functions
 * @module Functions
 */

import {
    deckcodeFunctions,
    cardFunctions,
    colorFunctions,
    utilFunctions,
    infoFunctions,
    eventFunctions,
} from '../../internal.js';

export const functions = {
    // TODO: Create better docstrings. (remember to also change the docstrings for, for example, functions.card.vanilla). #324
    /**
     * Deckcode related functions
     */
    deckcode: deckcodeFunctions,

    /**
     * Card related functions
     */
    card: cardFunctions,

    /**
     * Color related functions
     */
    color: colorFunctions,

    /**
     * Utility functions
     */
    util: utilFunctions,

    /**
     * Info functions
     */
    info: infoFunctions,

    /**
     * Event related functions
     */
    event: eventFunctions,
};
