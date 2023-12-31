// Created by Hand

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Combined Example 3',
    text: 'If the turn counter is an even number, gain mana equal to the turn counter (up to 10). Manathirst (7): Remove the condition. (Currently: {turns})',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Legendary',
    collectible: false,
    id: 54,

    spellSchool: 'None',

    cast(plr, self) {
        if (!self.condition()) {
            return;
        }

        // If the turn counter is an even number, gain mana equal to the turn counter (up to 10).
        let turns = game.functions.util.getTraditionalTurnCounter();

        // Cap the turn counter at 10
        if (turns > 10) {
            turns = 10;
        }

        plr.addMana(turns);
    },

    condition(plr, self) {
        let turns = game.functions.util.getTraditionalTurnCounter();
        if (turns > 10) {
            turns = 10;
        }

        // `turns` % 2 will always return 0 if it is an even number, and always return 1 if it is an odd number.
        const even = (turns % 2 === 0);
        const manathirst = self.manathirst(7);

        // If the turn counter is an even number or the manathirst is fullfilled, clear the condition.
        return even || manathirst;
    },

    placeholders(plr, self) {
        let turns = game.functions.util.getTraditionalTurnCounter();
        if (turns > 10) {
            turns = 10;
        }

        return { turns };
    },

    test(plr, self) {
        const turn = () => {
            let turns = game.functions.util.getTraditionalTurnCounter();
            if (turns > 10) {
                turns = 10;
            }

            return turns;
        };

        // The condition is not cleared
        let { mana } = plr;
        assert.equal(turn(), 1);
        self.activate('cast');

        assert.equal(plr.mana, mana);

        // Next
        game.endTurn();
        game.endTurn();

        // The condition is cleared, gain 2 mana.
        mana = plr.mana;
        assert.equal(turn(), 2);
        self.activate('cast');

        assert.equal(plr.mana, mana + 2);

        // Next
        game.endTurn();
        game.endTurn();

        // The manathirst is cleared, but not the condition, still gain 3 mana.
        plr.emptyMana = 7;
        mana = plr.mana;
        assert.equal(turn(), 3);
        self.activate('cast');

        assert.equal(plr.mana, mana + 3);
    },
};
