// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Lesser Heal',
    text: 'Restore 2 Health.',
    cost: 2,
    type: 'Heropower',
    classes: ['Priest'],
    rarity: 'Free',
    collectible: false,
    id: 118,

    heropower(plr, self) {
        // Restore 2 Health.

        // Hero power targets need to use the `forceElusive` flag.
        const target = game.interact.selectTarget('Restore 2 health.', self, 'any', 'any', ['forceElusive']);

        // If no target was selected, refund the hero power
        if (!target) {
            return game.constants.refund;
        }

        // Restore 2 health to the target
        target.addHealth(2, true);
        return true;
    },

    test(plr, self) {
        // Health: 1->3
        plr.health = 1;
        plr.inputQueue = ['face', 'n'];
        self.activate('heropower');

        assert.equal(plr.health, 1 + 2);

        // Health: 29->30 (cap at 30)
        plr.health = 29;
        plr.inputQueue = ['face', 'n'];
        self.activate('heropower');

        assert.equal(plr.health, 30);
    },
};
