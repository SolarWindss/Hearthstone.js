// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Fel Rift",
    desc: "&BCasts When Drawn.&R Summon a 3/3 Dread Imp.",
    mana: 3,
    type: "Spell",
    class: "Warlock",
    rarity: "Free",
    set: "Fractured in Alterac Valley",
    spellClass: "Fel",
    keywords: ["Cast On Draw"],
    uncollectible: true,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    cast(plr, game, self) {
        let imp = new game.Card("Dread Imp", plr);

        game.summonMinion(imp, plr);
    }
}
