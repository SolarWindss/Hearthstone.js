// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Contraband Stash",
    desc: "Replay 5 cards from other classes you've played this game.",
    mana: 5,
    type: "Spell",
    class: "Rogue",
    rarity: "Rare",
    set: "Fractured in Alterac Valley",
    id: 285,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    cast(plr, game, self) {
        if (!game.events.PlayCard) return;

        let cardsPlayed = game.events.PlayCard[plr.id].map(c => c[0]);
        cardsPlayed = cardsPlayed.filter(c => !game.functions.validateClass(plr, c) && c.id != self.id);
        if (cardsPlayed.length <= 0) return;

        const playCard = () => {
            let card = game.functions.randList(cardsPlayed);
            if (!card) return;

            card.costType = "none";
            game.playCard(card, plr);
        }

        for (let i = 0; i < 5; i++) playCard();
    }
}
