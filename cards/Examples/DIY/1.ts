// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'DIY 1',
    text: '<b>This is a DIY card, it does not work by default. Battlecry:</b> Give this minion +1/+1.',
    cost: 0,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 61,

    attack: 0,
    health: 1,
    tribe: 'None',

    battlecry(plr, self) {
        // Give this minion +1/+1.

        // Try to give this minion +1/+1 yourself.

        // DON'T CHANGE ANYTHING BELOW THIS LINE

        // Testing your solution.
        const success = game.interact.verifyDiySolution(self.attack === 1 && self.health === 2, self);
        if (!success) {
            self.kill();
        }

        return true;
    },
};
