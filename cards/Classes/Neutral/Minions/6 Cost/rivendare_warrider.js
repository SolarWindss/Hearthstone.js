// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Rivendare Warrider",
    displayName: "Rivendare, Warrider",
    stats: [6, 6],
    desc: "&BDeathrattle:&R Shuffle the other 3 Horsemen into your deck.",
    mana: 6,
    type: "Minion",
    tribe: "Undead",
    class: "Neutral",
    rarity: "Legendary",
    set: "Return to Naxxramas",
    id: 27,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    deathrattle(plr, game, self) {
        const doShuffle = (name, concept) => {
            name = `${name} ${concept}rider`;

            let card = new game.Card(name, plr);
            plr.shuffleIntoDeck(card);
        }

        doShuffle("Blaumeaux", "Famine");
        doShuffle("Korthazz", "Death");
        doShuffle("Zeliek", "Conquest");

        game.events.increment(plr, "rivendareCounter");
    }
}
