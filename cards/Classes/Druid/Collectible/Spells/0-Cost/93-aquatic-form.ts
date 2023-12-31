// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Aquatic Form',
    text: '<b>Dredge</b>. If you have the Mana to play the card this turn, draw it.',
    cost: 0,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Rare',
    collectible: true,
    id: 93,

    spellSchool: 'None',

    cast(plr, self) {
        // Dredge. If you have the Mana to play the card this turn, draw it.
        const card = game.interact.card.dredge();
        if (!card || plr.mana < card.cost) {
            return;
        }

        plr.drawCard();
    },

    test(plr, self) {
        const handSize = plr.hand.length;

        // Make the player answer 1
        plr.inputQueue = '1';

        // Shouldn't draw any cards
        plr.mana = -1;

        self.activate('cast');
        assert.equal(plr.hand.length, handSize);

        // Should draw a card
        plr.mana = 10;

        self.activate('cast');
        assert.equal(plr.hand.length, handSize + 1);
    },
};
