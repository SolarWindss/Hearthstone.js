// Created by Hand (before the Card Creator Existed)

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    // Look in `titan.ts` first.
    name: 'Ability 3',
    text: 'Restore 2 mana.',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 81,

    spellSchool: 'None',

    cast(plr, self) {
        // Restore 2 mana.

        plr.refreshMana(2);
    },

    test(plr, self) {
        plr.mana = 5;
        plr.emptyMana = 10;

        const { mana } = plr;
        self.activate('cast');

        assert.equal(plr.mana, mana + 2);
    },
};

