// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Prison of Yogg-Saron',
    text: 'Choose a character. Cast 4 random spells <i>(targeting it if possible)</i>.',
    cost: 7,
    type: 'Location',
    classes: ['Neutral'],
    rarity: 'Legendary',
    collectible: true,
    id: 102,

    durability: 3,
    cooldown: 2,

    use(plr, self) {
        // Choose a character. Cast 4 random spells (targeting it if possible).
        const target = game.interact.selectTarget(self.text, self, 'any', 'any');
        if (!target) {
            return game.constants.refund;
        }

        plr.forceTarget = target;

        const pool = game.functions.card.getAll().filter(card => card.type === 'Spell');
        for (let i = 0; i < 4; i++) {
            const card = game.lodash.sample(pool)?.imperfectCopy();
            if (!card) {
                continue;
            }

            card.activate('cast');
        }

        plr.forceTarget = undefined;
        return true;
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
