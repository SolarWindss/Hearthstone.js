// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Demon Claws',
    text: '+1 Attack this turn.',
    cost: 1,
    type: 'Heropower',
    classes: ['Demon Hunter'],
    rarity: 'Free',
    collectible: false,
    id: 123,

    heropower(plr, self) {
        // +1 Attack this turn.

        // Give the player +1 attack.
        plr.addAttack(1);
    },

    test(plr, self) {
        // The player should start with 0 attack
        assert.equal(plr.attack, 0);
        self.activate('heropower');

        // The player should gain 1 attack
        assert.equal(plr.attack, 1);
    },
};
