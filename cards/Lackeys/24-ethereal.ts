// Created by Hand (before the Card Creator Existed)

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Ethereal Lackey',
    text: '<b>Battlecry: Discover</b> a spell.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 24,

    attack: 1,
    health: 1,
    tribe: 'None',

    battlecry(plr, self) {
        // Discover a spell.

        // Filter out all cards that aren't spells
        const pool = game.functions.card.getAll().filter(c => c.type === 'Spell');
        if (pool.length <= 0) {
            return;
        }

        // Prompt a discover
        const card = game.interact.card.discover('Discover a spell.', pool);
        if (!card) {
            return game.constants.refund;
        }

        // Add the card to the player's hand
        plr.addToHand(card);
        return true;
    },

    test(plr, self) {
        // If there are no spells, pass the test
        if (game.functions.card.getAll().filter(c => c.type === 'Spell' && game.functions.card.validateClasses(self.classes, plr.heroClass)).length <= 0) {
            return;
        }

        // The player ALWAYS answer 1.
        plr.inputQueue = '1';

        // Do this 50 times
        for (let i = 0; i < 50; i++) {
            // Activate the battlecry and get the card from the player's hand.
            plr.hand = [];
            self.activate('battlecry');
            const card = plr.hand[0];

            assert.equal(card.type, 'Spell');
        }
    },
};
