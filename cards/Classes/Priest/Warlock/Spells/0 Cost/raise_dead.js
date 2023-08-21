// Created by the Custom Card Creator

/**
 * @type {import("../../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Raise Dead",
    desc: "Deal $3 damage to your hero. Return two friendly minions that died this game to your hand.",
    mana: 0,
    type: "Spell",
    class: "Priest / Warlock",
    rarity: "Common",
    set: "Scholomance Academy",
    spellClass: "Shadow",
    id: 230,

    /**
     * @type {import("../../../../../../src/types").KeywordMethod}
     */
    cast(plr, game, self) {
        game.attack("$3", plr);

        let grave = game.graveyard[plr.id];

        for (let i = 0; i < 2; i++) {
            let minion = game.functions.randList(grave);
            if (!minion) continue;

            game.functions.remove(grave, minion);

            plr.addToHand(minion);
        }
    }
}
