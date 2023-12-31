// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Jade Idol',
    text: '<b>Choose One -</b> Summon a <b>Jade Golem</b>; or Shuffle 3 copies of this card into your deck.',
    cost: 1,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Rare',
    collectible: true,
    id: 84,

    spellSchool: 'None',

    cast(plr, self) {
        // Choose One - Summon a Jade Golem; or Shuffle 3 copies of this card into your deck.
        game.interact.chooseOne(1, ['Summon a Jade Golem', () => {
            // Summon a Jade Golem
            const jade = game.functions.card.createJade(plr);
            game.summonMinion(jade, plr);
        }], ['Shuffle 3 copies of this card into your deck', () => {
            // Shuffle
            for (let i = 0; i < 3; i++) {
                plr.shuffleIntoDeck(self.imperfectCopy());
            }
        }]);
    },

    test(plr, self) {
        // Summon a Jade Golem
        plr.inputQueue = ['1'];
        self.activate('cast');

        // There should be a jade golem
        assert.ok(game.board[plr.id].some(card => card.id === game.cardIds.jadeGolem85));

        // Shuffle 3 copies
        plr.inputQueue = ['2'];
        self.activate('cast');

        // There should be 3 copies of this card in the player's deck
        assert.equal(plr.deck.filter(card => card.id === self.id).length, 3);
    },
};
