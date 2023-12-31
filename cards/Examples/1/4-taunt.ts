// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Taunt Example',

    // The description doesn't really matter, but it's nice to explain what the card does.
    // The "<b>" will bold all characters after it, and the "</b>" stops the bolding. This just makes the word "Taunt." bold, but nothing after it.
    // You can also use "<bold>" and "</bold>" if you want to be more verbose. Bold and Italic are currently the only tags that supports this.
    // Look in `game.functions.color.fromTags` for a list of these tags.
    text: '<b>Taunt.</b> This is an example card to show how to add keywords to cards.',

    cost: 1,
    type: 'Minion',
    tribe: 'None',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 32,

    attack: 2,
    health: 3,

    // This is an ability. More on abilities in `1-5`.
    // Be careful when interacting with `plr` or `self.plr` in the create ability, it might not always be the player you're expecting.
    create(plr, self) {
        // Add the Taunt keyword to this card
        self.addKeyword('Taunt');
    },
};
