// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Poison Seeds',
    text: 'Destroy all minions and summon 2/2 Treants to replace them.',
    cost: 4,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Common',
    collectible: true,
    id: 82,

    spellSchool: 'Nature',

    cast(plr, self) {
        // Destroy all minions and summon 2/2 Treants to replace them.
        for (const [id, side] of game.board.entries()) {
            const player = game.functions.util.getPlayerFromId(id);

            for (const card of side) {
                card.kill();

                const treant = game.createCard(game.cardIds.treant83, player);
                game.summonMinion(treant, player);
            }
        }
    },

    test(plr, self) {
        const amountOfCards = 3;

        // Summon n Sheep
        for (let i = 0; i < amountOfCards; i++) {
            const sheep = game.createCard(game.cardIds.sheep1, plr);
            game.summonMinion(sheep, plr);
        }

        // Replace with Treants
        self.activate('cast');

        // Check if every card is a Treant
        const board = game.board[plr.id];

        assert.equal(board.length, amountOfCards);
        assert.ok(board.every(card => card.id === game.cardIds.treant83));
    },
};
