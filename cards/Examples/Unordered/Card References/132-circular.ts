// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Circular Card Reference Example',
    text: 'Circular card reference: {card}',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 132,

    attack: 1,
    health: 1,
    tribe: 'None',

    placeholders(plr, self) {
        // You can reference this card in placeholders.
        // Go in-game, give yourself this card, and type 'detail' to see how it works.

        // It will eventually reach a max depth, which is set in the config.
        return { card: self };
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
