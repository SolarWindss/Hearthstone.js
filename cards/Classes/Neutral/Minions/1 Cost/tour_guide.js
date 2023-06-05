// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Tour Guide",
    stats: [1, 1],
    desc: "&BBattlecry:&R Your next Hero Power costs (0).",
    mana: 1,
    type: "Minion",
    tribe: "None",
    class: "Neutral",
    rarity: "Common",
    set: "Scholomance Academy",
    id: 298,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    battlecry(plr, game, self) {
        plr.heroPowerCost = 0;

        game.functions.addEventListener("HeroPower", () => {
            return game.player == plr;
        }, () => {
            plr.heroPowerCost = plr.hero.hpCost || 2;
        });
    }
}
