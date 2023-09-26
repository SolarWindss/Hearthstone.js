// Created by the Custom Card Creator

import { Blueprint } from "@Game/types.js";

export const blueprint: Blueprint = {
    name: "Shaman Starting Hero",
    displayName: "Thrall",
    text: "Shaman starting hero",
    cost: 0,
    type: "Hero",
    classes: ["Shaman"],
    rarity: "Free",
    hpText: "Summon a random Totem.",
    hpCost: 2,
    uncollectible: true,
    id: 9,

    heropower(plr, game, self) {
        // The names of the cards that can be summoned
        const totemCardNames = ["Healing Totem", "Searing Totem", "Stoneclaw Totem", "Strength Totem"];
        const filteredTotemCardNames: string[] = [];

        // Filter away totem cards that is already on the player's side of the board.
        totemCardNames.forEach(name => {
            // If the board already has a totem with this name, return
            if (game.board[plr.id].some(m => m.name === name)) return

            filteredTotemCardNames.push(name);
        });

        // If there are no totem cards to summon, refund the hero power, which gives the player back their mana
        if (filteredTotemCardNames.length == 0) return game.constants.REFUND;

        // Randomly choose one of the totem cards.
        const cardName = game.lodash.sample(filteredTotemCardNames);
        if (!cardName) throw new game.CardError("null found when randomly choosing totem card name");

        // Create a card from the name.
        const card = new game.Card(cardName, plr);

        // Summon the card on the player's side of the board
        game.summonMinion(card, plr);
        return true;
    },

    test(plr, game, self) {
        const assert = game.functions.assert;

        const totemCardNames = ["Healing Totem", "Searing Totem", "Stoneclaw Totem", "Strength Totem"];
        const checkForTotemCard = (amount: number) => {
            return game.board[plr.id].filter(card => totemCardNames.includes(card.name)).length >= amount;
        }

        // There should be 0 totem cards on the board
        assert(() => checkForTotemCard(0));

        for (let index = 0; index <= totemCardNames.length + 1; index++) {
            self.activate("heropower");

            // If all totem cards are on the board
            if (index > totemCardNames.length) {
                assert(() => checkForTotemCard(index - 1));
                continue;
            }

            // There should be n totem cards on the board
            assert(() => checkForTotemCard(index));
        }

        // Assert that all of the totem cards are on the board
        totemCardNames.forEach(name => {
            assert(() => game.board[plr.id].some(card => card.name === name));
        });

        // Assert that the board's length is equal to the amount of totem cards.
        assert(() => game.board[plr.id].length === totemCardNames.length);
    }
}
