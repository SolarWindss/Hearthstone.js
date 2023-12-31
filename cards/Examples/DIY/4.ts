
// Created by Hand

import { type Blueprint, type EventValue } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'DIY 4',
    text: '<b>This is a DIY card, it does not work by default.</b> Whenever a friendly minion dies, Resurrect it with 1/1 stats.',
    cost: 0,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 64,

    attack: 0,
    health: 10,
    tribe: 'None',

    passive(plr, self, key, _unknownValue, eventPlayer) {
        // Whenever a minion dies, Resurrect it with 1/1 stats.

        // If the key is for a different event, stop the function.
        if (key !== 'KillMinion') {
            return;
        }

        // Here we cast the value to the correct type.
        // Do not use the '_unknownValue' variable after this.
        const value = _unknownValue as EventValue<typeof key>;

        // Don't change this line
        if (value.plr !== plr) {
            return;
        }

        // Try to:
        // 1. Resurrect the minion (val) with 1/1 stats.

        // THIS ONLY GETS VALIDATED ONCE A MINION DIES. PLEASE TRY TO CAUSE A MINION TO DIE IN ORDER TO VALIDATE YOUR SOLUTION

        // DON'T CHANGE ANYTHING BELOW THIS LINE
        // Also there are some spoilers about the solution in the verification process down below
        // so if you don't want to see it, don't scroll down

        // Testing your solution.
        if (self.storage.solved) {
            return true;
        }

        const solved = game.board[plr.id].some(card => (
            card.id === value.id
                && card.type === value.type
                && card.attack === 1
                && card.health === 1
                && card.uuid !== value.uuid
                && card.plr === plr
        ));

        game.interact.verifyDiySolution(solved, self);
        if (!solved) {
            self.kill();
        }

        self.storage.solved = true;
        return true;
    },
};
