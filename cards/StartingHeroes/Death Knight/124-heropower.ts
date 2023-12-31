// Created by the Custom Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Ghoul Charge',
    text: 'Summon a 1/1 Ghoul with Charge. It dies at end of turn.',
    cost: 2,
    type: 'Heropower',
    classes: ['Death Knight'],
    rarity: 'Free',
    collectible: false,
    id: 124,

    heropower(plr, self) {
        // Summon a 1/1 Ghoul with Charge. It dies at end of turn.

        // Create the Ghoul
        const minion = game.createCard(game.cardIds.frailGhoul23, plr);

        // Summon the Ghoul
        game.summonMinion(minion, plr);

        // The `It dies at end of turn.` part is handled by the ghoul itself, so we don't need to do anything extra here
    },

    test(plr, self) {
        const lookForMinion = () => game.board[plr.id].some(card => card.id === 23);

        // The minion shouldn't be on the board at first.
        assert(!lookForMinion());
        self.activate('heropower');

        // The minion should now be on the board.
        assert(lookForMinion());
    },
};
