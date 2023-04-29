module.exports = {
    name: "Peasant",
    stats: [2, 1],
    desc: "At the start of your turn, draw a card.",
    mana: 1,
    type: "Minion",
    tribe: "None",
    class: "Neutral",
    rarity: "Common",
    set: "United in Stormwind",
    id: 35,

    startofturn(plr, game, card) {
        plr.drawCard();
    }
}
