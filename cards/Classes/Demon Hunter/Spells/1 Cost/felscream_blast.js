// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Felscream Blast",
    desc: "Lifesteal. Deal $1 damage to a minion and its neighbors.",
    mana: 1,
    type: "Spell",
    class: "Demon Hunter",
    rarity: "Common",
    set: "Madness at the Darkmoon Faire",
    spellClass: "Fel",
    id: 198,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    cast(plr, game, self) {
        let target = game.interact.selectTarget(self.desc, self, null, "minion");
        if (!target) return -1

        const doDamage = (t) => {
            game.attack("$1", t);
            plr.addHealth(1 + plr.spellDamage);
        }

        let board = game.board[target.plr.id];
        let index = board.indexOf(target);
        if (index == -1) return -1;

        if (index > 0) doDamage(board[index - 1]);
        doDamage(target);
        if (index < board.length - 1) doDamage(board[index + 1]);
    }
}
