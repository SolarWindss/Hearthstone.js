// Created by the Vanilla Card Creator

// This is the Yogg-Saron, Unleashed Tentacle Swarm card.

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Tentacle Swarm',
    text: 'Fill your hand with 1/1 Chaotic Tendrils.',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 109,

    spellSchool: 'None',

    cast(plr, self) {
        // Fill your hand with 1/1 Chaotic Tendrils.
        const remaining = game.functions.util.getRemainingHandSize(plr);

        for (let index = 0; index < remaining; index++) {
            const card = game.createCard(game.cardIds.chaoticTendril110, plr);
            plr.addToHand(card);
        }
    },

    test(plr, self) {
        const handSize = plr.hand.length;
        self.activate('cast');

        // Check if the player's hand was filled with tendrils
        const amountOfCards = plr.hand.length - handSize;
        assert.equal(plr.hand.filter(card => card.id === game.cardIds.chaoticTendril110).length, amountOfCards);
    },
};
