// Created by Hand (before the Card Creator Existed)

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Faceless Lackey',
    text: '<b>Battlecry:</b> Summon a random 2-Cost minion.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 25,

    attack: 1,
    health: 1,
    tribe: 'None',

    battlecry(plr, self) {
        // Summon a random 2-Cost minion.

        // filter out all cards that aren't 2-cost minions
        const minions = game.functions.card.getAll().filter(card => card.type === 'Minion' && card.cost === 2);

        // Choose a random minion
        const random = game.lodash.sample(minions);
        if (!random) {
            return;
        }

        // Create a new minion since we shouldn't directly use the cards from `game.functions.card.getAll()`.
        const minion = game.createCard(random.id, plr);

        // Summon the minion
        game.summonMinion(minion, plr);
    },

    test(plr, self) {
        // If there doesn't exist any 2-Cost minions, pass the test
        if (!game.functions.card.getAll().some(card => card.cost === 2 && card.type === 'Minion')) {
            return;
        }

        const exists2CostMinion = () => game.board[plr.id].some(card => card.cost === 2);

        // There shouldn't exist any 2-Cost minions right now.
        assert(!exists2CostMinion());
        self.activate('battlecry');

        // There should exist a 2-Cost minion now.
        assert(exists2CostMinion());
    },
};
