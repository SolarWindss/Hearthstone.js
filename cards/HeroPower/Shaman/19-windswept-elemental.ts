// Created by Hand (before the Card Creator Existed)

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Windswept Elemental',
    text: '<b>Rush</b>',
    cost: 2,
    type: 'Minion',
    classes: ['Shaman'],
    rarity: 'Free',
    collectible: false,
    id: 19,

    attack: 2,
    health: 1,
    tribe: 'Totem',

    create(plr, self) {
        self.addKeyword('Rush');
    },
};
