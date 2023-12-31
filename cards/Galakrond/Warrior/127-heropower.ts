// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Galakrond\'s Might',
    text: 'Give your hero +3 Attack this turn.',
    cost: 2,
    type: 'Heropower',
    classes: ['Warrior'],
    rarity: 'Legendary',
    collectible: false,
    id: 127,

    heropower(plr, self) {
        // Give your hero +3 Attack this turn.

        plr.attack += 3;
    },

    test(plr, self) {
        assert.equal(plr.attack, 0);
        self.activate('heropower');

        assert.equal(plr.attack, 3);
    },
};
