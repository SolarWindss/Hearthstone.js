// Created by Hand

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Condition Example',

    // This is a common condition
    text: '<b>Battlecry:</b> If your deck has no duplicates, draw a card.',

    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 52,

    attack: 5,
    health: 2,
    tribe: 'None',

    battlecry(plr, self) {
        // If your deck has no duplicates, draw a card.

        // Check if the condition is cleared
        if (!self.condition()) {
            return;
        }

        // Draw a card
        plr.drawCard();
    },

    // This function will be run when the card is played.
    // This function will also be run every tick in order to add / remove the ` (Condition cleared!)` text.
    // If this function returns true when this card is played, the battlecry will be triggered.
    condition(plr, self) {
        // `plr.highlander` will return true if the player has no duplicates in their deck.
        //
        // return true; // Uncomment this to see how a fulfilled condition looks like.
        return plr.highlander();
    },

    test(plr, self) {
        const { length } = plr.deck;
        plr.hand = [];

        // The player shouldn't fulfill the condition
        assert(!plr.highlander());
        self.activate('battlecry');

        // Assert that the player didn't draw a card
        assert.equal(plr.deck.length, length);
        assert.equal(plr.hand.length, 0);

        // The player should fulfill the condition
        plr.deck = [game.createCard(1, plr)];
        assert(plr.highlander());
        assert.equal(plr.deck.length, 1);

        self.activate('battlecry');

        assert.equal(plr.hand.length, 1);
    },
};
