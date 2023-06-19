// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Mistress of Mixtures",
    stats: [2, 2],
    desc: "Deathrattle: Restore 4 Health to each hero.",
    mana: 1,
    type: "Minion",
    tribe: "None",
    class: "Neutral",
    rarity: "Common",
    set: "Core",
    id: 17,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    deathrattle(plr, game, card) {
        game.player1.addHealth(4);
        game.player2.addHealth(4);
    }
}
