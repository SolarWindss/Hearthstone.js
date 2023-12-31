// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Galakrond\'s Fury',
    text: 'Summon a 2/1 Elemental with <b>Rush</b>.',
    cost: 2,
    type: 'Heropower',
    classes: ['Shaman'],
    rarity: 'Legendary',
    collectible: false,
    id: 126,

    heropower(plr, self) {
        // Summon a 2/1 Elemental with Rush.
        const card = game.createCard(game.cardIds.windsweptElemental19, plr);
        if (!card) {
            return;
        }

        game.summonMinion(card, plr);
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
