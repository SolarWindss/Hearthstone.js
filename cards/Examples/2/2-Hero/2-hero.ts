// Created by Hand

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Hero Example',
    text: '<b>Battlecry:</b> Restore your hero to full health.',
    cost: 1,
    type: 'Hero',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 37,

    // The amount of armor that the player will gain when playing this card.
    armor: 5,

    // The id of the hero power card. Here we use the `2-heropower.ts` card.
    heropowerId: 130,

    battlecry(plr, self) {
        // Restore your hero to full health.

        // Heal this card's owner to full health.
        // The `addHealth` method automatically caps the health of the player, so you don't need to worry.
        plr.addHealth(plr.maxHealth);
    },

    test(plr, self) {
        // Test battlecry
        plr.health = 1;
        self.activate('battlecry');
        assert.equal(plr.health, plr.maxHealth);
    },
};
