// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Dagger Mastery',
    text: 'Equip a 1/2 Dagger.',
    cost: 2,
    type: 'Heropower',
    classes: ['Rogue'],
    rarity: 'Free',
    collectible: false,
    id: 122,

    heropower(plr, self) {
        // Equip a 1/2 Dagger.

        // Create the weapon card
        const weapon = game.createCard(game.cardIds.wickedKnife22, plr);

        // Equip the weapon
        plr.setWeapon(weapon);
    },

    test(plr, self) {
        // The player should not have a weapon
        assert.equal(plr.weapon, undefined);
        self.activate('heropower');

        // The player should now have the wicked knife weapon
        assert.ok(plr.weapon);
        assert.equal(plr.weapon.id, 22);
    },
};
