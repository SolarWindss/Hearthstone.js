// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Pyroblast',
    text: 'Deal $10 damage.',
    cost: 10,
    type: 'Spell',
    classes: ['Mage'],
    rarity: 'Epic',
    collectible: true,
    id: 105,

    spellSchool: 'Fire',

    cast(plr, self) {
        // Deal $10 damage.
        const target = game.interact.selectTarget(self.text, self, 'any', 'any');
        if (!target) {
            return game.constants.refund;
        }

        game.attack('$10', target);
        return true;
    },

    test(plr, self) {
        const enemyHealth = plr.getOpponent().health;
        plr.forceTarget = plr.getOpponent();

        // If no spellDamage
        self.activate('cast');
        assert.equal(plr.getOpponent().health, enemyHealth - 10);

        // Reset health
        plr.getOpponent().health = enemyHealth;

        // If 5 spellDamage
        plr.spellDamage = 5;

        self.activate('cast');
        assert.equal(plr.getOpponent().health, enemyHealth - 15);
    },
};
