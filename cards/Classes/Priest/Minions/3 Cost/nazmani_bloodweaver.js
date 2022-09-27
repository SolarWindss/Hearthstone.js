module.exports = {
    name: "Nazmani Bloodweaver",
    stats: [2, 5],
    desc: "After you cast a spell, reduce the cost of a random card in your hand by (1).",
    mana: 3,
    tribe: "None",
    class: "Priest",
    rarity: "Rare",
    set: "Madness at the Darkmoon Faire",

    passive(plr, game, card, trigger) {
        if (trigger[0] == "spellsCast" && card.passiveCheck(trigger)) {
            if (plr.hand.filter(c => c.mana > 0).length > 0) {
                let randomCard = plr.hand[game.functions.randInt(0, plr.hand.length - 1)];

                while (randomCard.mana == 0) {
                    randomCard = plr.hand[game.functions.randInt(0, plr.hand.length - 1)];
                }

                randomCard.mana -= 1;
            }
        }
    }
}