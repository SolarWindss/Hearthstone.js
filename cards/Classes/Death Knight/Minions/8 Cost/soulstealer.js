// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Soulstealer",
    stats: [5, 5],
    desc: "Battlecry: Destroy all other minions. Gain 1 Corpse for each enemy destroyed.",
    mana: 8,
    type: "Minion",
    tribe: "Undead",
    class: "Death Knight",
    rarity: "Epic",
    set: "March of the Lich King",
    runes: "BBB",
    id: 7,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    battlecry(plr, game, self) {
        game.board.forEach(p => {
            p.forEach(m => {
                m.kill();
                plr.corpses++;
            });
        });
    }
}
