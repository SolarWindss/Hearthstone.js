// Created by the Vanilla Card Creator

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Brewing Storm',
    text: '<b>Rush</b>',
    cost: 2,
    type: 'Minion',
    classes: ['Shaman'],
    rarity: 'Free',
    collectible: false,
    id: 112,

    attack: 2,
    health: 2,
    tribe: 'Elemental',

    create(plr, self) {
        // Add additional fields here
        self.addKeyword('Rush');
    },
};
