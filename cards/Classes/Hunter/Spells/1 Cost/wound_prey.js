// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Wound Prey",
    desc: "Deal 1 damage. Summon a 1/1 Hyena with Rush.",
    mana: 1,
    type: "Spell",
    class: "Hunter",
    rarity: "Common",
    set: "Forged in the Barrens",
    id: 216,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    cast(plr, game, self) {
        let target = game.interact.selectTarget(`Deal ${1 + plr.spellDamage} damage`, true);
        if (!target) return -1;

        game.functions.spellDmg(target, 1);

        let hyena = new game.Card("Swift Hyena", plr);
        game.summonMinion(hyena, plr);
    }
}
