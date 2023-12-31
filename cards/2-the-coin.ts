// Created by Hand (before the Card Creator Existed)

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'The Coin',
    text: 'Gain 1 Mana Crystal this turn only.',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 2,

    spellSchool: 'None',

    cast(plr, self) {
        // Gain 1 Mana Crystal this turn only.

        // Refresh 1 mana, while not going over the player's max mana. In most cases, the max mana is 10.
        // This is to prevent the player from having more than 10* mana, instead of preventing them from having more than empty mana, which
        // is the thing that goes up every turn until it reaches 10*
        plr.refreshMana(1, plr.maxMana);
    },

    test(plr, self) {
        // Assert 5->6
        plr.mana = 5;
        self.activate('cast');

        assert.equal(plr.mana, 6);

        // Assert 10->10
        plr.mana = 10;
        self.activate('cast');

        assert.equal(plr.mana, 10);
    },
};
