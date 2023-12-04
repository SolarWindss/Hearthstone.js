// Created by Hand (before the Card Creator Existed)

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    // Look in `titan.ts` first.
    name: 'Ability 2',
    text: 'Heal 3 damage.',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 80,

    spellSchool: 'None',

    cast(plr, self) {
        // Heal 3 damage.

        plr.addHealth(3);
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};

