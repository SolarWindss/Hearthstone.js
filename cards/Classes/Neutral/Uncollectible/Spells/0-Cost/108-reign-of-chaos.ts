// Created by the Vanilla Card Creator

// This is the Yogg-Saron, Unleashed Reign of Chaos card.

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Reign of Chaos',
    text: 'Take control of an enemy minion.',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 108,

    spellSchool: 'None',

    cast(plr, self) {
        // Take control of an enemy minion.
        const card = game.interact.selectCardTarget(self.text, self, 'enemy');
        if (!card) {
            return game.constants.refund;
        }

        card.takeControl(plr);
        return true;
    },

    test(plr, self) {
        // Get the opponent
        const opponent = plr.getOpponent();

        // Create a sheep and summon it on the opponent's side of the board
        const sheep = game.createCard(game.cardIds.sheep1, opponent);
        game.summonMinion(sheep, opponent);

        // Check if the sheep's owner is the opponent, is on the opponent's side of the board, and not the friendly player's side of the board
        assert.equal(sheep.plr, opponent);
        assert.ok(game.board[opponent.id].includes(sheep));
        assert.ok(!game.board[plr.id].includes(sheep));

        // Activate cast and make the player choose the sheep
        plr.inputQueue = ['1'];
        self.activate('cast');

        // Check if the sheep's owner is the friendly player, is on this side of the board, and not the opponent's side of the board
        assert.equal(sheep.plr, plr);
        assert.ok(game.board[plr.id].includes(sheep));
        assert.ok(!game.board[opponent.id].includes(sheep));
    },
};
