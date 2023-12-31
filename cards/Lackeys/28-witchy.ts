// Created by Hand (before the Card Creator Existed)

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Witchy Lackey',
    text: '<b>Battlecry:</b> Transform a friendly minion into one that costs (1) more.',
    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 28,

    attack: 1,
    health: 1,
    tribe: 'None',

    battlecry(plr, self) {
        // Transform a friendly minion into one that costs (1) more.

        // Ask the user which minion to transform
        const target = game.interact.selectCardTarget('Transform a friendly minion into one that costs (1) more.', self, 'friendly');

        // If no target was selected, refund
        if (!target) {
            return game.constants.refund;
        }

        // There isn't any cards that cost more than 10, so refund
        if (target.cost >= 10) {
            return game.constants.refund;
        }

        // Filter minions that cost (1) more than the target
        const minions = game.functions.card.getAll().filter(card => card.type === 'Minion' && card.cost === target.cost + 1);

        // Choose a random minion from the filtered list.
        const random = game.lodash.sample(minions);
        if (!random) {
            return game.constants.refund;
        }

        // Create the card
        const minion = game.createCard(random.id, plr);

        // Destroy the target and summon the new minion in order to get the illusion that the card was transformed
        target.destroy();

        // Summon the card to the player's side of the board
        game.summonMinion(minion, plr);
        return true;
    },

    test(plr, self) {
        const existsMinionWithCost = (cost: number) => game.board[plr.id].some(card => card.cost === cost);

        // Summon a sheep
        const sheep = game.createCard(game.cardIds.sheep1, plr);
        game.summonMinion(sheep, plr);

        // There shouldn't exist a minion with 1 more cost than the sheep.
        assert(!existsMinionWithCost(sheep.cost + 1));

        // If there doesn't exist any 2-Cost minions, pass the test
        if (!game.functions.card.getAll().some(card => card.cost === sheep.cost + 1 && card.type === 'Minion')) {
            return;
        }

        // Activate the battlecry, select the sheep.
        plr.inputQueue = ['1'];
        self.activate('battlecry');

        // There should now exist a minion with 1 more cost than the sheep.
        assert(existsMinionWithCost(sheep.cost + 1));
    },
};
