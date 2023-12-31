// Created by Hand (before the Card Creator Existed)

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Goblin Lackey',
    text: '<b>Battlecry:</b> Give a friendly minion +1 Attack and <b>Rush</b>.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 26,

    attack: 1,
    health: 1,
    tribe: 'None',

    battlecry(plr, self) {
        // Give a friendly minion +1 Attack and Rush.

        // Prompt the user to select a friendly minion
        const target = game.interact.selectCardTarget('Give a friendly minion +1 Attack and Rush', self, 'friendly');

        // If no target was selected, refund
        if (!target) {
            return game.constants.refund;
        }

        // Add +1 Attack
        target.addStats(1, 0);

        // Add Rush
        target.addKeyword('Rush');
        return true;
    },

    test(plr, self) {
        // Summon a sheep
        const sheep = game.createCard(game.cardIds.sheep1, plr);
        game.summonMinion(sheep, plr);

        // Activate the battlecry, choose the sheep
        plr.inputQueue = ['1'];
        self.activate('battlecry');

        // The sheep should have 2 attack and rush
        assert.equal(sheep.attack, 2);
        assert(sheep.hasKeyword('Rush'));
    },
};
