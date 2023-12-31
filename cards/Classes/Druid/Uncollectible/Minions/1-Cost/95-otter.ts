// Created by the Vanilla Card Creator

// This is the Flipper Friends Otter card

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Otter',
    text: '<b>Rush</b>',
    cost: 1,
    type: 'Minion',
    classes: ['Druid'],
    rarity: 'Free',
    collectible: false,
    id: 95,

    attack: 1,
    health: 1,
    tribe: 'Beast',

    create(plr, self) {
        // Add additional fields here
        self.addKeyword('Rush');
    },
};
