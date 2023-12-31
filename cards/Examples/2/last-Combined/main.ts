// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Combined Example 2',
    text: 'Colossal +2. Dormant. Corrupt.',
    cost: 0,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Legendary',
    collectible: false,
    id: 48,

    attack: 5,
    health: 3,
    tribe: 'None',

    create(plr, self) {
        self.runes = 'BBB';

        self.addKeyword('Colossal', [game.cardIds.leftArm46, game.cardIds.null0, game.cardIds.rightArm47]);
        self.addKeyword('Corrupt', game.cardIds.combinedExample2Corrupted49);

        // The summoned minions get Dormant automatically if the main minion has dormant.
        self.addKeyword('Dormant', 2);
    },
};
