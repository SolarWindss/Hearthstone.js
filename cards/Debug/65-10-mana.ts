// Created by Hand

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: '10 Mana',
    text: 'Gain 10 Mana.',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 65,

    spellSchool: 'None',

    cast(plr, self) {
        // Gain 10 Mana.
        plr.addMana(10);
    },

    test(plr, self) {
        plr.mana = 5;
        self.activate('cast');

        assert.equal(plr.mana, 10);
    },
};
