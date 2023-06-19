// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Vanndar Stormpike",
    stats: [4, 4],
    desc: "Battlecry: If this costs less than every minion in your deck, reduce their Cost by (3).",
    mana: 4,
    type: "Minion",
    tribe: "None",
    class: "Neutral",
    rarity: "Legendary",
    set: "Fractured in Alterac Valley",
    id: 23,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    battlecry(plr, game, self) {
        let cond = true;

        let list = plr.deck.filter(c => c.type == "Minion");
        list.forEach(m => {
            if (m.mana < self.mana) cond = false;
        });

        if (!cond) return;

        // Condition cleared
        list.forEach(m => {
            //m.mana -= 3;
            m.addEnchantment("-3 mana", self);
        });
    }
}
