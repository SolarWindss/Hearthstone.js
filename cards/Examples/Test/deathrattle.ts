// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Deathrattle Test',
    text: '<b>Deathrattle:</b> Summon two 1/1 Sheep.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 72,

    attack: 1,
    health: 2,
    tribe: 'None',

    deathrattle(plr, self) {
        // Summon two 1/1 Sheep.

        for (let i = 0; i < 2; i++) {
            // Create the sheep
            const sheep = game.createCard(game.cardIds.sheep1, plr);

            // Summon the sheep
            game.summonMinion(sheep, plr);
        }
    },

    test(plr, self) {
        // There should be 0 minions on the board
        assert.equal(game.board[plr.id].length, 0);
        game.summonMinion(self, plr);

        // There should be 1 minion on the board
        assert.equal(game.board[plr.id].length, 1);

        game.attack(2, self);

        // There should be 2 minions on the board since the deathrattle should have triggered
        assert.equal(game.board[plr.id].length, 2);
    },
};
