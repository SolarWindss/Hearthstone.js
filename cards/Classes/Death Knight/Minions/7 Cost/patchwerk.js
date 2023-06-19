// Created by the Custom Card Creator

/**
 * @type {import("../../../../../src/types").Blueprint}
 */
module.exports = {
    name: "Patchwerk",
    stats: [4, 6],
    desc: "Battlecry: Destroy a random minion in your opponent's hand, deck, and battlefield.",
    mana: 7,
    type: "Minion",
    tribe: "Undead",
    class: "Death Knight",
    rarity: "Legendary",
    set: "Core",
    runes: "B",
    id: 6,

    /**
     * @type {import("../../../../../src/types").KeywordMethod}
     */
    battlecry(plr, game, self) {
        let op = plr.getOpponent();

        const doRemove = (from) => {
            let _from = from.filter(c => c.type == "Minion");
            _from = game.functions.randList(_from, false);

            game.functions.remove(from, _from);
        }

        doRemove(op.hand);
        doRemove(op.deck);
        doRemove(game.board[op.id]);
    }
}
