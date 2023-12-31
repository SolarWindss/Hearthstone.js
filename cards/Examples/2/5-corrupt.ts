// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Corrupt Example',
    text: '<b>Corrupt.</b>',
    cost: 0,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 40,

    attack: 1,
    health: 1,
    tribe: 'None',

    create(plr, self) {
        // Put the id of the corrupted counterpart here. This is the id of 5-corrupted.ts
        // Corrupted is another system that is very untested and might get a rewrite.
        self.addKeyword('Corrupt', game.cardIds.corruptedExample41);
    },

    test(plr, self) {
        // TODO: Test. #325
    },
};
