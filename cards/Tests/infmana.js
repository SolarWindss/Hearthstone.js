module.exports = {
    name: "Inf Mana",
    desc: "Set your mana to 10. For the rest of the game, your mana never decreases.",
    mana: 0,
    class: "Neutral",
    rarity: "Free",
    set: "Tests",
    uncollectible: true,

    cast(plr, game, self) {
        game.functions.addPassive("", true, () => {
            plr.gainMana(1000, true);
        }, -1);
    }
}
