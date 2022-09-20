module.exports = {
    name: "Peasant",
    stats: [2, 1],
    desc: "At the start of your turn, draw a card.",
    mana: 1,
    tribe: "None",
    class: "Neutral",
    rarity: "Common",
    set: "United in Stormwind",

    startofturn(plr, game, card) {
        plr.drawCard();
    }
}