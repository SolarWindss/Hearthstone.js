// Created by the Custom Card Creator

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Forge Example',
    text: '<b>Forge:</b> Gain +1/+1.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 75,

    attack: 1,
    health: 1,
    tribe: 'None',

    create(plr, self) {
        // Put the id of the forged counterpart, like in corrupt.
        self.addKeyword('Forge', game.cardIds.forgedExample76);
    },
};
