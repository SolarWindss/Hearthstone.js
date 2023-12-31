// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Galakrond\'s Wit',
    text: 'Add a random Priest minion to your hand.',
    cost: 2,
    type: 'Heropower',
    classes: ['Priest'],
    rarity: 'Legendary',
    collectible: false,
    id: 128,

    heropower(plr, self) {
        // Add a random Priest minion to your hand.
        const possibleCards = game.functions.card.getAll().filter(c => c.type === 'Minion' && game.functions.card.validateClasses(c.classes, 'Priest'));
        if (possibleCards.length <= 0) {
            return;
        }

        let card = game.lodash.sample(possibleCards);
        if (!card) {
            return;
        }

        card = game.createCard(card.id, plr);

        plr.addToHand(card);
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
