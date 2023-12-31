// Created by the Custom Card Creator

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Galakrond, the Unspeakable',
    text: '<b>Battlecry:</b> Destroy {amount} random enemy minion{plural}.',
    cost: 7,
    type: 'Hero',
    classes: ['Priest'],
    rarity: 'Legendary',
    collectible: true,
    id: 70,

    armor: 5,
    heropowerId: 128,

    battlecry(plr, self) {
        // Destroy 1 random enemy minion.
        const amount = game.functions.card.galakrondFormula(self.storage.invokeCount as number);

        for (let i = 0; i < amount; i++) {
            // Get a random minion from the opponent's board.
            const board = game.board[plr.getOpponent().id];

            const minion = game.lodash.sample(board);
            if (!minion) {
                continue;
            }

            // Kill it
            minion.kill();
        }
    },

    invoke(plr, self) {
        self.galakrondBump('invokeCount');
    },

    placeholders(plr, self) {
        if (!self.storage.invokeCount) {
            return { amount: 0, plural: 's', plural2: 'They' };
        }

        const amount = game.functions.card.galakrondFormula(self.storage.invokeCount as number);
        const multiple = amount > 1;
        const plural = multiple ? 's' : '';

        return { amount, plural };
    },
};
