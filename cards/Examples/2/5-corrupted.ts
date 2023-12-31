// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    // Look in `corrupt.ts` first.
    // This is just an ordinary card.
    name: 'Corrupted Example',
    text: 'Corrupted.',
    cost: 0,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 41,

    attack: 2,
    health: 2,
    tribe: 'None',
};
