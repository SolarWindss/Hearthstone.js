// Created by Hand

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Combined Example 1',
    text: '<b>Taunt, Divine Shield. Battlecry: Dredge.</b> Gain +1/+1. (This example card combines everything you\'ve learned in stage 1 into this card.)',
    cost: 1,
    type: 'Minion',
    classes: ['Priest', 'Paladin'],
    rarity: 'Legendary',
    collectible: false,
    id: 35,

    attack: 4,
    health: 4,
    tribe: 'All',

    create(plr, self) {
        self.addKeyword('Taunt');
        self.addKeyword('Divine Shield');
    },

    battlecry(plr, self) {
        // Dredge. Gain +1/+1.

        // Ordering is important. In the description it says that it dredges first, then adds +1/+1.
        game.interact.card.dredge();

        self.addStats(1, 1);
    },

    // Ignore this
    test(plr, self) {
        // Makes the player answer "1" to the next question
        plr.inputQueue = ['1'];

        // We can't really check the dredged card here.
        self.activate('battlecry');

        // Check that the stats went up by 1
        assert.equal(self.attack! - 1, self.blueprint.attack);
        assert.equal(self.health! - 1, self.blueprint.health);
    },
};
