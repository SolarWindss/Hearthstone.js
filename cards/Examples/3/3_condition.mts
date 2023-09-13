// Created by Hand

import { Blueprint } from "@Game/types.js";

export const blueprint: Blueprint = {
    name: "Condition Example",
    stats: [5, 2],

    // This is a common condition
    desc: "<b>Battlecry:</b> If your deck has no duplicates, draw a card.", 

    mana: 1,
    type: "Minion",
    tribe: "None",
    classes: ["Neutral"],
    rarity: "Free",

    // By having this here, the battlecry function below will only trigger if the condition function returns true
    conditioned: ["battlecry"], 

    uncollectible: true,
    id: 52,

    // This will only trigger if the `condition` function below returns true.
    battlecry(plr, game, self) {
        // If your deck has no duplicates, draw a card.

        // Makes the card's owner draw a card.
        //
        // If you don't put the `conditioned: ["battlecry"]` at the top, you can use this code to achieve the same thing.
        //if (!self.condition()) return; 

        // Draw a card
        plr.drawCard();
    },

    // This function will be run when the card is played.
    // This function will also be run every tick in order to add / remove the ` (Condition cleared!)` text.
    // If this function returns true when this card is played, the battlecry will be triggered.
    condition(plr, game, self) {
        // `game.functions.highlander` will return true if the player has no duplicates in their deck.
        //
        //return true; // Uncomment this to see how a fulfilled condition looks like.
        return game.functions.highlander(plr);
    }
}
