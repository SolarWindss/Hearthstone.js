// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Rune Example',
    text: 'This is an example card to show how runes work.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 39,

    attack: 1,
    health: 2,
    tribe: 'None',

    create(plr, self) {
        // You need 2 frost runes and 1 blood rune to use this card.
        self.runes = 'FFB';
    },

    test(plr, self) {
        // TODO: Test. #325
    },
};
