// Created by the Custom Card Creator

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Titan Example',
    text: '<b>Titan</b>.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 78,

    attack: 10,
    health: 10,
    tribe: 'None',

    create(plr, self) {
        // Put the ids of the titan ability cards, like in corrupt, but a list.
        self.addKeyword('Titan', [game.cardIds.ability179, game.cardIds.ability280, game.cardIds.ability381]);
    },
};
