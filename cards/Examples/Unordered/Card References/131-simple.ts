// Created by Hand

import { type Card } from '@Game/internal.js';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Simple Card Reference Example',
    text: 'The Coin: {coin}',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 131,

    attack: 1,
    health: 1,
    tribe: 'None',

    create(plr, self) {
        // Store a coin for later
        self.storage.the_coin = game.createCard(game.cardIds.theCoin2, plr);
    },

    placeholders(plr, self) {
        // You can reference entire cards in placeholders.
        // Go in-game, give yourself this card, and type 'detail' to see how it works.
        // We use the card's storage so we don't create a bajillion cards and cause memory leaks.
        const coin = self.storage.the_coin as Card | undefined;

        return { coin };
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
