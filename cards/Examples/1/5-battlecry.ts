// Created by Hand

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Battlecry Example',

    // Remember to look at the text of these example cards to know what they're trying to do.
    // Beyond this point, no(*) cards will have comments like these above the text.
    text: '<b>Battlecry:</b> Give this minion +1/+1.',

    cost: 1,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 33,

    attack: 1,
    health: 2,
    tribe: 'None',

    // Here we put the name of the ability we want to add.
    // The card creator should be able to automatically add the correct ability
    // but so far, it can only add a single ability per card, so if you want to add multiple abilities, you'll have to do it manually.
    //
    // Instead of "battlecry", you could put "deathrattle", or "inspire", for example.
    battlecry(plr, self) {
        // Give this minion +1/+1.

        // The `plr` variable is the card's owner. This is an instance of the Player class as defined in `src/core/player.ts`.
        // The `self` variable is the actual card itself in-game. This is an instance of the Card class as defined in `src/core/card.ts`.

        // The global `game` (used later on) variable is the current game. This is an instance of the Game class as defined in `src/core/game.ts`.

        // The card class has the "addStats" function that takes in an attack and health, then adds that to the current stats.
        self.addStats(1, 1);
    },

    // Ignore this, this is just to unit test this card to make sure it doesn't break in the future.
    // I encourage you to make tests like these yourself. Run `npm run cardtest` to run these tests.
    // These tests are run in an isolated environment. The side-effect of the code here won't carry over to other tests or the game.
    test(plr, self) {
        self.activate('battlecry');

        assert.equal(self.blueprint.attack! + 1, self.attack);
        assert.equal(self.blueprint.health! + 1, self.health);
    },
};
