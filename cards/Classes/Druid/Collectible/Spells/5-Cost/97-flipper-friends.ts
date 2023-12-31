// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Flipper Friends',
    text: '<b>Choose One</b> - Summon a 6/6 Orca with <b>Taunt</b>; or six 1/1 Otters with <b>Rush</b>.',
    cost: 5,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Common',
    collectible: true,
    id: 97,

    spellSchool: 'Nature',

    cast(plr, self) {
        // Choose One - Summon a 6/6 Orca with Taunt; or six 1/1 Otters with Rush.
        game.interact.chooseOne(1, ['Summon a 6/6 Orca with <b>Taunt</b>', () => {
            // Summon a 6/6 Orca with Taunt
            const orca = game.createCard(game.cardIds.orca96, plr);
            game.summonMinion(orca, plr);
        }], ['Summon six 1/1 Otters with <b>Rush</b>', () => {
            // Summon six 1/1 Otters with Rush
            for (let index = 0; index < 6; index++) {
                const otter = game.createCard(game.cardIds.otter95, plr);
                game.summonMinion(otter, plr);
            }
        }]);
    },

    test(plr, self) {
        // Summon a 6/6 Orca with Taunt
        plr.inputQueue = ['1'];
        self.activate('cast');

        // There should be 1 Orca on the board
        assert.equal(game.board[plr.id].filter(card => card.id === game.cardIds.orca96).length, 1);

        // Clear the board. Isn't really required in this case, but will cause buggy behavior if summoning more than 6 Otters.
        game.board[plr.id] = [];

        // Summon six 1/1 Otters with Rush
        plr.inputQueue = ['2'];
        self.activate('cast');

        // There should be 6 Otters on the board
        assert.equal(game.board[plr.id].filter(card => card.id === game.cardIds.otter95).length, 6);
    },
};
