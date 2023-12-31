// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Floop\'s Glorious Gloop',
    text: 'Whenever a minion dies this turn, gain 1 Mana Crystal this turn only.',
    cost: 1,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Legendary',
    collectible: true,
    id: 101,

    spellSchool: 'Nature',

    cast(plr, self) {
        // Whenever a minion dies this turn, gain 1 Mana Crystal this turn only.
        const destroy = game.functions.event.addListener('KillMinion', () => {
            // Gain 1 Mana Crystal
            plr.refreshMana(1, plr.maxMana);

            return true;
        }, -1);

        game.functions.event.addListener('EndTurn', destroy);
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
