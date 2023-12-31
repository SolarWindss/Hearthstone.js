// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Branching Paths',
    text: '<b>Choose Twice -</b> Draw a card; Give your minions +1 Attack; Gain 6 Armor.',
    cost: 4,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Epic',
    collectible: true,
    id: 86,

    spellSchool: 'None',

    cast(plr, self) {
        // Choose Twice - Draw a card; Give your minions +1 Attack; Gain 6 Armor.
        game.interact.chooseOne(2, ['Draw a card', () => {
            // Draw a card
            plr.drawCard();
        }], ['Give your minions +1 Attack', () => {
            // Give your minions +1 Attack
            for (const card of game.board[plr.id]) {
                if (card.attack) {
                    card.attack += 1;
                }
            }
        }], ['Gain 6 Armor', () => {
            // Gain 6 Armor
            plr.addArmor(6);
        }]);
    },

    test(plr, self) {
        // Summon a Sheep
        const sheep = game.createCard(game.cardIds.sheep1, plr);
        game.summonMinion(sheep, plr);

        const handSize = plr.hand.length;

        // Test 'Draw a Card', and 'Give your minions +1 Attack'.
        plr.inputQueue = ['1', '2'];
        self.activate('cast');

        assert.equal(plr.hand.length, handSize + 1);
        assert.equal(sheep.attack, 2);

        // Test '+1 Attack', and 'Gain 6 Armor'.
        plr.inputQueue = ['2', '3'];
        self.activate('cast');

        assert.equal(sheep.attack, 3);
        assert.equal(plr.armor, 6);
    },
};
