// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Combined Example 2 Corrupted',
    text: 'Colossal +2. Dormant. Corrupted. <b>Battlecry: Dredge.</b>',
    cost: 0,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Legendary',
    collectible: false,
    id: 49,

    attack: 9,
    health: 9,
    tribe: 'None',

    create(plr, self) {
        self.addKeyword('Colossal', [game.cardIds.leftArm46, game.cardIds.null0, game.cardIds.rightArm47]);
        self.addKeyword('Dormant', 2);
    },

    battlecry(plr, self) {
        // Dredge.

        game.interact.card.dredge();
    },
};
