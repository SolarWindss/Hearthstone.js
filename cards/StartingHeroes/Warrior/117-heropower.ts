// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Armor Up',
    text: 'Gain 2 Armor.',
    cost: 2,
    type: 'Heropower',
    classes: ['Warrior'],
    rarity: 'Free',
    collectible: false,
    id: 117,

    heropower(plr, self) {
        // Gain 2 Armor.

        // Give the player +2 armor.
        plr.addArmor(2);
    },

    test(plr, self) {
        // The player should have 0 armor
        assert.equal(plr.armor, 0);
        self.activate('heropower');

        // The player should now have 2 armor
        assert.equal(plr.armor, 2);
    },
};
