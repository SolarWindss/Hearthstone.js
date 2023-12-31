// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Invigorate',
    text: '<b>Choose One -</b> Gain an empty Mana Crystal; or Draw a card.',
    cost: 2,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Rare',
    collectible: true,
    id: 92,

    spellSchool: 'Nature',

    cast(plr, self) {
        // Choose One - Gain an empty Mana Crystal; or Draw a card.
        game.interact.chooseOne(1, ['Gain an empty Mana Crystal', () => {
            // Gain an empty Mana Crystal
            plr.addEmptyMana(1);
        }], ['Draw a card', () => {
            // Draw a card
            plr.drawCard();
        }]);
    },

    test(plr, self) {
        // Gain an empty Mana Crystal
        const { emptyMana } = plr;

        plr.inputQueue = ['1'];
        self.activate('cast');

        assert.equal(plr.emptyMana, emptyMana + 1);

        // Draw a card
        const handSize = plr.hand.length;

        plr.inputQueue = ['2'];
        self.activate('cast');

        assert.equal(plr.hand.length, handSize + 1);
    },
};
