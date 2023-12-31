// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Wildheart Guff',
    text: '<b>Battlecry:</b> Set your maximum Mana to 20. Gain an empty Mana Crystal. Draw a card.',
    cost: 5,
    type: 'Hero',
    classes: ['Druid'],
    rarity: 'Legendary',
    collectible: true,
    id: 89,

    armor: 5,
    heropowerId: 113,

    battlecry(plr, self) {
        // Set your maximum Mana to 20. Gain an empty Mana Crystal. Draw a card.
        plr.maxMana = 20;
        plr.addEmptyMana(1);
        plr.drawCard();
    },

    test(plr, self) {
        const handSize = plr.hand.length;
        const { emptyMana } = plr;

        // Update if changing the default max mana.
        assert.equal(plr.maxMana, 10);

        self.activate('battlecry');

        assert.equal(plr.maxMana, 20);
        assert.equal(plr.emptyMana, emptyMana + 1);
        assert.equal(plr.hand.length, handSize + 1);
    },
};
