// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Dew Process',
    text: 'For the rest of the game, players draw an extra card at the start of their turn.',
    cost: 2,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Rare',
    collectible: true,
    id: 91,

    spellSchool: 'Nature',

    cast(plr, self) {
        // For the rest of the game, players draw an extra card at the start of their turn.
        game.functions.event.addListener('StartTurn', (_unknownValue, eventPlayer) => {
            eventPlayer.drawCard();
            return true;
        }, -1);
    },

    test(plr, self) {
        let handSize = plr.hand.length;

        // When the card hasn't been played, draw 1 card every turn.
        game.endTurn();
        game.endTurn();

        // Increment handSize by 1 so that we can do handSize + 2
        assert.equal(plr.hand.length, ++handSize);

        self.activate('cast');

        game.endTurn();
        game.endTurn();

        assert.equal(plr.hand.length, handSize + 2);
    },
};
