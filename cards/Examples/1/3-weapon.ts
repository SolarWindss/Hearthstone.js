// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    // This looks like a minion card except for the type and no tribe.
    name: 'Weapon Example',
    text: 'Just an example card (Does nothing)',
    cost: 1,

    // Remember to properly set the type (Done automatically by the card creator)
    type: 'Weapon',

    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 31,

    // Weapons have attack / health, but no tribe
    attack: 5,
    health: 3,
};
